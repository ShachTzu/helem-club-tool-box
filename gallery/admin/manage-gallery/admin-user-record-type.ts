/**
 * platform user role, ordered by increasing privilege.
 */
export type AdminUserRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * plain, serializable current-user record used to bypass the auth query when
 * testing or previewing the protected admin panel.
 */
export type AdminUserRecord = {
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
  role: AdminUserRole;

  /**
   * provider used by the user to authenticate.
   */
  provider: 'email' | 'google';

  /**
   * ISO timestamp of when the user was created.
   */
  createdAt: string;
};
