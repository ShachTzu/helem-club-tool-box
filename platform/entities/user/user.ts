/**
 * The role a platform user holds, ordered by increasing privilege.
 */
export type UserRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * The authentication provider used to create the user's account.
 */
export type UserProvider = 'email' | 'google';

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
    readonly interests: string[] = []
  ) {}

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
      interests
    );
  }
}
