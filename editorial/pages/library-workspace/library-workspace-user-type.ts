/**
 * platform user roles, ordered by increasing privilege.
 */
export type LibraryWorkspaceRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * the shape of the mock user accepted by the library workspace, mirroring
 * the platform's PlainUser type without depending on it directly.
 */
export type LibraryWorkspaceUser = {
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
   * role assigned to the user, determines platform privileges.
   */
  role: LibraryWorkspaceRole;

  /**
   * provider used by the user to authenticate.
   */
  provider: 'email' | 'google';

  /**
   * ISO timestamp of when the user was created.
   */
  createdAt: string;

  /**
   * optional avatar image url.
   */
  avatarUrl?: string;
};
