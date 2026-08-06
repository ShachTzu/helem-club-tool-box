import type { ReturnModelType } from '@typegoose/typegoose';
import { MemberProfileModel } from './member-profile.model.js';
import type {
  ListMemberProfilesOptions,
  MembershipStatus,
  SubmitMemberProfileInput,
} from './membership-options.js';

/**
 * the identity of the account a profile row belongs to, taken from the
 * authenticated session — never from client input.
 */
export type ProfileOwner = {
  userId: string;
  email: string;
  displayName: string;
  provider: string;
};

/**
 * escape a user-supplied search term before it reaches a RegExp, so a query
 * like `.*` (or a catastrophic backtracking pattern) can't be smuggled into
 * the Mongo filter.
 */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * data-access layer for member onboarding profiles and their membership
 * decisions.
 */
export class MemberProfileRepository {
  constructor(private profileModel: ReturnModelType<typeof MemberProfileModel>) {}

  /**
   * get the profile row of a single account, creating an empty `none` row on
   * first sight.
   *
   * every signed-in member hits this on their first authenticated page load,
   * which is what makes the admin queue able to show accounts that registered
   * but never completed onboarding — without this aspect having to read the
   * platform's user collection.
   */
  async ensureProfile(owner: ProfileOwner): Promise<MemberProfileModel> {
    const now = new Date().toISOString();
    const doc = await this.profileModel.findOneAndUpdate(
      { userId: owner.userId },
      {
        // identity fields are refreshed on every sight so the queue doesn't
        // show a name the member has since changed.
        $set: {
          accountEmail: owner.email.toLowerCase(),
          accountDisplayName: owner.displayName,
          provider: owner.provider,
        },
        $setOnInsert: { status: 'none', createdAt: now },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // `new: true` with `upsert` always yields a document; the null is only in
    // the driver's type, not in the runtime contract.
    if (!doc) throw new Error('failed to create the member profile');
    return doc.toObject() as MemberProfileModel;
  }

  /**
   * read one account's own profile without creating it.
   */
  async getProfile(userId: string): Promise<MemberProfileModel | null> {
    const doc = await this.profileModel.findOne({ userId });
    return doc ? (doc.toObject() as MemberProfileModel) : null;
  }

  /**
   * store the onboarding answers of a member and move them into `pending`.
   *
   * the row is matched on the owner's own `userId` inside the query itself, so
   * there is no path by which one member's submission can land on another
   * member's profile. a member who is already `approved` keeps that state —
   * editing your details later must not silently revoke your membership.
   */
  async submitProfile(
    owner: ProfileOwner,
    input: SubmitMemberProfileInput
  ): Promise<MemberProfileModel> {
    const existing = await this.getProfile(owner.userId);
    const keepsApproval = existing?.status === 'approved';
    const now = new Date().toISOString();

    const doc = await this.profileModel.findOneAndUpdate(
      { userId: owner.userId },
      {
        $set: {
          accountEmail: owner.email.toLowerCase(),
          accountDisplayName: owner.displayName,
          provider: owner.provider,
          status: keepsApproval ? 'approved' : 'pending',
          fullName: input.fullName,
          phone: input.phone,
          contactEmail: (input.contactEmail || '').toLowerCase(),
          age: input.age || 0,
          city: input.city || '',
          communityRoles: input.communityRoles || '',
          gender: input.gender || '',
          injuryNote: input.injuryNote || '',
          recognitionStatus: input.recognitionStatus || '',
          welcomeCallsOptIn: Boolean(input.welcomeCallsOptIn),
          interests: input.interests || [],
          submittedAt: now,
        },
        $setOnInsert: { createdAt: now },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    if (!doc) throw new Error('failed to save the member profile');
    return doc.toObject() as MemberProfileModel;
  }

  /**
   * list profiles for the admin approval queue, newest submissions first.
   */
  async listProfiles(options: ListMemberProfilesOptions = {}): Promise<MemberProfileModel[]> {
    const filter: Record<string, unknown> = {};
    if (options.status) filter.status = options.status;

    const term = (options.query || '').trim();
    if (term) {
      const pattern = new RegExp(escapeRegExp(term), 'i');
      filter.$or = [
        { fullName: pattern },
        { accountDisplayName: pattern },
        { accountEmail: pattern },
        { contactEmail: pattern },
      ];
    }

    const docs = await this.profileModel.find(filter).sort({ submittedAt: -1, createdAt: -1 });
    return docs.map((doc) => doc.toObject() as MemberProfileModel);
  }

  /**
   * record an admin's decision on a member's application.
   */
  async setStatus(
    userId: string,
    status: MembershipStatus,
    decidedBy: string,
    note?: string
  ): Promise<MemberProfileModel | null> {
    const doc = await this.profileModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          status,
          decidedAt: new Date().toISOString(),
          decidedBy,
          decisionNote: note || '',
        },
      },
      { new: true }
    );

    return doc ? (doc.toObject() as MemberProfileModel) : null;
  }

  /**
   * count profiles per membership state, for the admin queue's tabs.
   */
  async countByStatus(): Promise<Record<MembershipStatus, number>> {
    const rows = await this.profileModel.aggregate<{ _id: string; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const counts: Record<MembershipStatus, number> = {
      none: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
    };

    rows.forEach((row) => {
      if (row._id in counts) counts[row._id as MembershipStatus] = row.count;
    });

    return counts;
  }
}
