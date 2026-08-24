/**
 * a plain, serializable representation of the signed-in user used to gate
 * the version history page behind the writer/moderator/admin roles.
 */
export type VersionHistoryUser = {
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
   * role of the user, gating access to writer-and-above pages.
   */
  role: `member` | `writer` | `moderator` | `admin`;

  /**
   * the authentication provider used to create the account.
   */
  provider: `email` | `google`;

  /**
   * ISO timestamp the account was created.
   */
  createdAt: string;
};
