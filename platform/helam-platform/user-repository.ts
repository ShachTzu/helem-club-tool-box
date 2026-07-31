import { ReturnModelType } from '@typegoose/typegoose';
import { User, type PlainUser } from '@helemclub/platform.entities.user';
import { UserModel } from './user.model.js';

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
      if (isAdmin) bySub.role = 'admin';
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
      if (isAdmin) byEmail.role = 'admin';
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
      if (options.role === 'admin') existing.role = 'admin';
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
      createdAt: new Date().toISOString(),
    });

    return User.from(toPlainUser(doc.toObject()));
  }

  /**
   * count the persisted users, used to decide whether to seed on start.
   */
  async count(): Promise<number> {
    return this.userModel.countDocuments();
  }
}
