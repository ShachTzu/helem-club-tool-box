/**
 * a plain, serializable representation of the signed-in user used to gate
 * the post editor behind the writer/admin roles.
 */
export type PostEditorUser = {
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
  role: `member` | `writer` | `moderator` | `admin`;

  /**
   * provider used by the user to authenticate.
   */
  provider: `email` | `google`;

  /**
   * ISO timestamp of when the user was created.
   */
  createdAt: string;
};
