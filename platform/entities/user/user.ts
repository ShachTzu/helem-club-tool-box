/**
 * The role a platform user holds, ordered by increasing privilege.
 */
export type UserRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * The authentication provider used to create the user's account.
 */
export type UserProvider = 'email' | 'google';

/**
 * The community membership status of a user, independent of their role.
 * New signups start as 'pending' and must be approved by a moderator or an
 * admin before they gain full participation rights. 'rejected' users keep
 * read-only access but can never participate.
 */
export type MembershipStatus = 'pending' | 'approved' | 'rejected';

/**
 * Ordered role hierarchy used to compare privilege levels.
 * Roles later in the array have higher privilege.
 */
const ROLE_HIERARCHY: UserRole[] = ['member', 'writer', 'moderator', 'admin'];

/**
 * Plain, serializable representation of a User.
 */
export type PlainUser = {
  /**
   * unique identifier of the user.
   */
  id: string;

  /**
   * email address of the user.
   */
  email: string;

  /**
   * display name shown across the platform.
   */
  displayName: string;

  /**
   * optional avatar image url.
   */
  avatarUrl?: string;

  /**
   * role assigned to the user, determines platform privileges.
   */
  role: UserRole;

  /**
   * provider used by the user to authenticate.
   */
  provider: UserProvider;

  /**
   * ISO timestamp of when the user was created.
   */
  createdAt: string;

  /**
   * whether the user has completed the mandatory post-signup onboarding flow.
   */
  onboardingCompleted?: boolean;

  /**
   * the coping-domain names the user is most interested in, captured during
   * onboarding.
   */
  interests?: string[];

  /**
   * community membership status. new signups are 'pending' until a moderator
   * or an admin approves them. defaults to 'pending'.
   */
  membershipStatus?: MembershipStatus;

  /**
   * scoped content-domain admin: can manage writers, the knowledge library
   * and the blog, without holding the site-wide 'admin' role. granted
   * on top of any role — typically 'moderator' — by a full admin. defaults
   * to false.
   */
  contentAdmin?: boolean;
};

/**
 * A User entity, represents a registered member of the Helem Club platform.
 * Supports serialization and de-serialization and can be used from both
 * backend and frontend.
 */
export class User {
  constructor(
    /**
     * unique identifier of the user.
     */
    readonly id: string,

    /**
     * email address of the user.
     */
    readonly email: string,

    /**
     * display name shown across the platform.
     */
    readonly displayName: string,

    /**
     * role assigned to the user, determines platform privileges.
     */
    readonly role: UserRole,

    /**
     * provider used by the user to authenticate.
     */
    readonly provider: UserProvider,

    /**
     * ISO timestamp of when the user was created.
     */
    readonly createdAt: string,

    /**
     * optional avatar image url.
     */
    readonly avatarUrl?: string,

    /**
     * whether the user has completed the mandatory post-signup onboarding flow.
     */
    readonly onboardingCompleted: boolean = false,

    /**
     * the coping-domain names the user is most interested in, captured during
     * onboarding.
     */
    readonly interests: string[] = [],

    /**
     * community membership status. new signups are 'pending' until a moderator
     * or an admin approves them.
     */
    readonly membershipStatus: MembershipStatus = 'pending',

    /**
     * scoped content-domain admin: can manage writers, the knowledge library
     * and the blog, without holding the site-wide 'admin' role.
     */
    readonly contentAdmin: boolean = false
  ) {}

  /**
   * whether the user was approved into the community and may participate
   * (post, comment, react). pending and rejected users are read-only.
   */
  get isApprovedMember(): boolean {
    return this.membershipStatus === 'approved';
  }

  /**
   * whether the user is awaiting a moderator or admin decision.
   */
  get isPendingApproval(): boolean {
    return this.membershipStatus === 'pending';
  }

  /**
   * whether this user may approve or reject other members. moderators and
   * admins hold the membership gate.
   */
  canModerateMembers(): boolean {
    return this.isAtLeast('moderator');
  }

  /**
   * checks whether the user's role is at least as privileged as the
   * provided role, according to the platform role hierarchy
   * (member < writer < moderator < admin).
   */
  isAtLeast(role: UserRole): boolean {
    const currentIndex = ROLE_HIERARCHY.indexOf(this.role);
    const targetIndex = ROLE_HIERARCHY.indexOf(role);
    return currentIndex >= targetIndex;
  }

  /**
   * whether this user may manage the content domain — blog authors, the
   * blog itself and the knowledge library — either because they are a
   * full site admin, or because they were scoped in as a content admin.
   * a content admin does NOT gain site-wide admin privileges (user
   * management, other domains) — only this content-domain gate.
   */
  canManageContent(): boolean {
    return this.role === 'admin' || this.contentAdmin;
  }

  /**
   * serialize a User into a plain, serializable object.
   */
  toObject(): PlainUser {
    return {
      id: this.id,
      email: this.email,
      displayName: this.displayName,
      avatarUrl: this.avatarUrl,
      role: this.role,
      provider: this.provider,
      createdAt: this.createdAt,
      onboardingCompleted: this.onboardingCompleted,
      interests: this.interests,
      membershipStatus: this.membershipStatus,
      contentAdmin: this.contentAdmin,
    };
  }

  /**
   * create a User instance from a plain object.
   */
  static from(plainUser: PlainUser): User {
    const {
      id = '',
      email = '',
      displayName = '',
      avatarUrl = undefined,
      role = 'member',
      provider = 'email',
      createdAt = new Date().toISOString(),
      onboardingCompleted = false,
      interests = [],
      membershipStatus = 'pending',
      contentAdmin = false,
    } = plainUser || ({} as PlainUser);

    return new User(
      id,
      email,
      displayName,
      role,
      provider,
      createdAt,
      avatarUrl,
      onboardingCompleted,
      interests,
      membershipStatus,
      contentAdmin
    );
  }
}
