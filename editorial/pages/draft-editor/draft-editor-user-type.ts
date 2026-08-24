/**
 * platform user roles, ordered by increasing privilege.
 */
export type DraftEditorRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * the shape of the mock user accepted by the draft editor, mirroring the
 * platform's PlainUser type without depending on it directly.
 */
export type DraftEditorUser = {
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
   * role assigned to the user.
   */
  role: DraftEditorRole;

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
