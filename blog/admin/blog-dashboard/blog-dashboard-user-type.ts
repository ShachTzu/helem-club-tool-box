/**
 * platform user role, ordered by increasing privilege. declared locally to
 * avoid depending on the platform entities package directly.
 */
export type BlogDashboardUserRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * authentication provider used to create the user's account.
 */
export type BlogDashboardUserProvider = 'email' | 'google';

/**
 * mock shape of the currently signed-in user, used to bypass the admin
 * auth check performed by the protected route.
 */
export type BlogDashboardUser = {
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
  role: BlogDashboardUserRole;

  /**
   * provider used by the user to authenticate.
   */
  provider: BlogDashboardUserProvider;

  /**
   * ISO timestamp of when the user was created.
   */
  createdAt: string;
};
