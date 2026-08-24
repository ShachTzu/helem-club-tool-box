import { ReturnModelType } from '@typegoose/typegoose';
import { User, type PlainUser, type MembershipStatus } from '@helemclub/platform.entities.user';
import { UserModel } from './user.model.js';
import { escapeRegExp } from './escape-reg-exp.js';

/**
 * build a mongo filter matching a membership status.
 *
 * accounts created before `membershipStatus` was introduced have no such
 * field at all. every read path already treats a missing value as 'pending'
 * (see `toPlainUser`), so a plain equality filter would silently disagree
 * with what the admin panel displays — the approval queue would list members
 * that the pending *count* could not see. matching a missing field as
 * 'pending' keeps the two consistent.
 *
 * @param status the membership status to match.
 * @returns the mongo filter fragment.
 */
function membershipStatusFilter(status: MembershipStatus): Record<string, unknown> {
  if (status !== 'pending') return { membershipStatus: status };
  return { $or: [{ membershipStatus: 'pending' }, { membershipStatus: { $exists: false } }] };
}

export type CreateUserProps = {
  /**
   * email address of the new user.
   */
  email: string;

  /**
   * display name shown across the platform.
   */
  displayName?: string;

  /**
   * optional avatar image url.
   */
  avatarUrl?: string;

  /**
   * the provider used to authenticate (email OTP or Google).
   */
  provider?: string;

  /**
   * community role assigned to the user.
   */
  role?: string;

  /**
   * initial membership status. defaults to 'pending' — new signups wait for a
   * moderator decision.
   */
  membershipStatus?: MembershipStatus;
};

/**
 * options for listing platform users from the admin panel.
 */
export type ListUsersOptions = {
  /**
   * free-text search applied to the display name and email.
   */
  query?: string;

  /**
   * when set, only users holding this membership status are returned.
   */
  membershipStatus?: MembershipStatus;

  /**
   * maximum number of users to return. defaults to 200.
   */
  limit?: number;
};



/**
 * maps a persisted user document to the platform's serializable User entity.
 */
function toPlainUser(doc: UserModel): PlainUser {
  return {
    id: doc.userId,
    email: doc.email,
    displayName: doc.displayName,
    avatarUrl: doc.avatarUrl,
    role: (doc.role || 'member') as PlainUser['role'],
    provider: (doc.provider || 'email') as PlainUser['provider'],
    createdAt: doc.createdAt || new Date().toISOString(),
    onboardingCompleted: doc.onboardingCompleted ?? false,
    interests: doc.interests ?? [],
    membershipStatus: (doc.membershipStatus || 'pending') as MembershipStatus,
    contentAdmin: doc.contentAdmin ?? false,
  };
}

/**
 * data-access layer for platform users, wrapping the typegoose User model.
 */
export class UserRepository {
  constructor(private userModel: ReturnModelType<typeof UserModel>) {}

  /**
   * create a new user with the given details.
   */
  async createUser(options: CreateUserProps): Promise<User> {
    const userId = crypto.randomUUID();
    const displayName = options.displayName || options.email.split('@')[0];
    const doc = await this.userModel.create({
      userId,
      email: options.email.toLowerCase(),
      displayName,
      avatarUrl: options.avatarUrl,
      provider: options.provider || 'email',
      role: options.role || 'member',
      onboardingCompleted: false,
      interests: [],
      membershipStatus: options.membershipStatus || 'pending',
      createdAt: new Date().toISOString(),
    });

    return User.from(toPlainUser(doc.toObject()));
  }

  /**
   * find a user by their stable id.
   */
  async findById(userId: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ userId });
    return doc ? User.from(toPlainUser(doc.toObject())) : null;
  }

  /**
   * find a user by their email address.
   */
  async findByEmail(email: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ email: email.toLowerCase() });
    return doc ? User.from(toPlainUser(doc.toObject())) : null;
  }

  /**
   * find an existing user by email, or create one when none exists yet.
   */
  async findOrCreate(options: CreateUserProps): Promise<User> {
    const existing = await this.findByEmail(options.email);
    if (existing) return existing;
    return this.createUser(options);
  }

  /**
   * find a user by their Google subject identifier.
   *
   * @param googleSub the stable `sub` claim from a verified Google ID token.
   * @returns the matching user, or null.
   */
  async findByGoogleSub(googleSub: string): Promise<User | null> {
    const doc = await this.userModel.findOne({ googleSub });
    return doc ? User.from(toPlainUser(doc.toObject())) : null;
  }

  /**
   * resolve the account for a verified Google identity, creating one on first
   * sign-in.
   *
   * accounts are keyed on `googleSub` rather than email, because a user can
   * change their Google email address while keeping the same account. when an
   * email-provisioned account already exists for the address, it is linked to
   * the Google subject instead of creating a duplicate.
   *
   * @param identity a Google identity that has already been cryptographically verified.
   * @param adminEmails addresses that should be promoted to the admin role.
   * @returns the resolved user.
   */
  async findOrCreateFromGoogle(
    identity: {
      googleSub: string;
      email: string;
      displayName?: string;
      avatarUrl?: string;
    },
    adminEmails: string[] = []
  ): Promise<User> {
    const email = identity.email.toLowerCase();
    const isAdmin = adminEmails.includes(email);

    const bySub = await this.userModel.findOne({ googleSub: identity.googleSub });
    if (bySub) {
      bySub.email = email;
      bySub.emailVerified = true;
      if (identity.displayName) bySub.displayName = identity.displayName;
      if (identity.avatarUrl) bySub.avatarUrl = identity.avatarUrl;
      // being listed in ADMIN_EMAILS is itself the trust decision — promoting the
      // role without approving membership would leave an admin stuck in the
      // pending gate, unable to reach the very screen that clears it.
      if (isAdmin) {
        bySub.role = 'admin';
        bySub.membershipStatus = 'approved';
      }
      await bySub.save();
      return User.from(toPlainUser(bySub.toObject()));
    }

    // an account already exists for this address (provisioned by email) — link
    // it rather than creating a second account for the same person.
    const byEmail = await this.userModel.findOne({ email });
    if (byEmail) {
      byEmail.googleSub = identity.googleSub;
      byEmail.emailVerified = true;
      byEmail.provider = 'google';
      if (identity.displayName && !byEmail.displayName) {
        byEmail.displayName = identity.displayName;
      }
      if (identity.avatarUrl) byEmail.avatarUrl = identity.avatarUrl;
      if (isAdmin) {
        byEmail.role = 'admin';
        byEmail.membershipStatus = 'approved';
      }
      await byEmail.save();
      return User.from(toPlainUser(byEmail.toObject()));
    }

    const doc = await this.userModel.create({
      userId: crypto.randomUUID(),
      email,
      displayName: identity.displayName || email.split('@')[0],
      avatarUrl: identity.avatarUrl,
      provider: 'google',
      googleSub: identity.googleSub,
      emailVerified: true,
      role: isAdmin ? 'admin' : 'member',
      onboardingCompleted: false,
      interests: [],
      // admins provisioned from configuration are trusted members by
      // definition; everyone else waits for a moderator decision.
      membershipStatus: isAdmin ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
    });

    return User.from(toPlainUser(doc.toObject()));
  }

  /**
   * resolve the account for an email address whose ownership has just been
   * proven by a one-time code, creating one on first sign-in.
   *
   * this is the email counterpart to {@link findOrCreateFromGoogle}: emailed
   * sign-in doubles as sign-up, so there is no separate registration step.
   * `emailVerified` is set here and only here for this path — redeeming a code
   * sent to the address is exactly what proves ownership of it.
   *
   * @param options the verified address, plus the display name and role to
   * apply when the account is created.
   * @returns the resolved user.
   */
  async findOrCreateVerifiedByEmail(options: {
    email: string;
    displayName?: string;
    role?: string;
  }): Promise<User> {
    const email = options.email.toLowerCase();

    const existing = await this.userModel.findOne({ email });
    if (existing) {
      existing.emailVerified = true;
      // a name captured at signup fills a blank, but never overwrites a name
      // the member has since chosen for themselves.
      if (options.displayName && !existing.displayName) {
        existing.displayName = options.displayName;
      }
      if (options.role === 'admin') {
        existing.role = 'admin';
        existing.membershipStatus = 'approved';
      }
      await existing.save();
      return User.from(toPlainUser(existing.toObject()));
    }

    const doc = await this.userModel.create({
      userId: crypto.randomUUID(),
      email,
      displayName: options.displayName || email.split('@')[0],
      provider: 'email',
      emailVerified: true,
      role: options.role || 'member',
      onboardingCompleted: false,
      interests: [],
      membershipStatus: options.role === 'admin' ? 'approved' : 'pending',
      createdAt: new Date().toISOString(),
    });

    return User.from(toPlainUser(doc.toObject()));
  }

  /**
   * persist the mandatory post-signup onboarding profile: marks the user as
   * having completed onboarding and stores the coping-domain interests they
   * selected. called once, right after the onboarding wizard is submitted.
   *
   * @param userId the stable id of the user completing onboarding.
   * @param options the interests collected by the onboarding wizard.
   * @returns the updated user.
   */
  async completeOnboarding(
    userId: string,
    options: { interests?: string[] }
  ): Promise<User> {
    const doc = await this.userModel.findOne({ userId });
    if (!doc) {
      throw new Error('לא נמצא משתמש להשלמת תהליך ההרשמה');
    }

    doc.onboardingCompleted = true;
    doc.interests = options.interests ?? [];
    await doc.save();

    return User.from(toPlainUser(doc.toObject()));
  }

  /**
   * list platform users for the admin panel, optionally filtered by a
   * free-text query and by membership status. newest signups come first so
   * the approval queue reads top-down.
   *
   * @param options the search query, status filter and result limit.
   * @returns the matching users.
   */
  async listUsers(options: ListUsersOptions = {}): Promise<User[]> {
    const { query, membershipStatus, limit = 200 } = options;

    // both clauses below can be an $or, so they are combined under $and
    // rather than assigned onto the same key — otherwise a status filter and
    // a search query would silently overwrite one another.
    const clauses: Record<string, unknown>[] = [];

    if (membershipStatus) {
      clauses.push(membershipStatusFilter(membershipStatus));
    }

    const trimmed = query?.trim();
    if (trimmed) {
      const pattern = new RegExp(escapeRegExp(trimmed), 'i');
      clauses.push({ $or: [{ displayName: pattern }, { email: pattern }] });
    }

    const filter = clauses.length > 0 ? { $and: clauses } : {};

    const docs = await this.userModel.find(filter).sort({ createdAt: -1 }).limit(limit);
    return docs.map((doc) => User.from(toPlainUser(doc.toObject())));
  }

  /**
   * update a user's community role.
   *
   * @param userId the stable id of the user to update.
   * @param role the role to assign.
   * @returns the updated user.
   */
  async updateUserRole(userId: string, role: string): Promise<User> {
    const doc = await this.userModel.findOne({ userId });
    if (!doc) throw new Error('לא נמצא משתמש לעדכון');

    doc.role = role;
    await doc.save();

    return User.from(toPlainUser(doc.toObject()));
  }

  /**
   * grant or revoke scoped content-domain admin: manage writers, the
   * knowledge library and the blog, without site-wide admin privileges.
   * admin-only — enforced by the caller.
   *
   * @param userId the stable id of the user to update.
   * @param contentAdmin whether the user should hold the content-admin scope.
   * @returns the updated user.
   */
  async updateContentAdmin(userId: string, contentAdmin: boolean): Promise<User> {
    const doc = await this.userModel.findOne({ userId });
    if (!doc) throw new Error('לא נמצא משתמש לעדכון');

    doc.contentAdmin = contentAdmin;
    await doc.save();

    return User.from(toPlainUser(doc.toObject()));
  }

  /**
   * decide on a user's community membership — approving a pending signup into
   * the community, or rejecting them. the deciding moderator and the timestamp
   * are recorded so decisions stay auditable.
   *
   * @param userId the stable id of the user being decided on.
   * @param membershipStatus the decision to record.
   * @param decidedBy the id of the moderator or admin making the decision.
   * @returns the updated user.
   */
  async updateMembershipStatus(
    userId: string,
    membershipStatus: MembershipStatus,
    decidedBy?: string
  ): Promise<User> {
    const doc = await this.userModel.findOne({ userId });
    if (!doc) throw new Error('לא נמצא משתמש לעדכון');

    doc.membershipStatus = membershipStatus;
    doc.membershipDecidedBy = decidedBy;
    doc.membershipDecidedAt = new Date().toISOString();
    await doc.save();

    return User.from(toPlainUser(doc.toObject()));
  }

  /**
   * count the users awaiting a membership decision, used to badge the admin
   * approval queue.
   */
  async countPendingMembers(): Promise<number> {
    return this.userModel.countDocuments(membershipStatusFilter('pending'));
  }

  /**
   * count the persisted users, used to decide whether to seed on start.
   */
  async count(): Promise<number> {
    return this.userModel.countDocuments();
  }
}
