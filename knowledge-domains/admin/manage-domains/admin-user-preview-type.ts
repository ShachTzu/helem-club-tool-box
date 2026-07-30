/**
 * a minimal preview of the current admin user, used only to bypass the
 * auth hook when a mocked user is supplied (tests and compositions).
 */
export type AdminUserPreview = {
  /**
   * unique identifier of the user.
   */
  id: string;

  /**
   * email address of the user.
   */
  email: string;

  /**
   * display name of the user.
   */
  displayName: string;

  /**
   * avatar image url of the user.
   */
  avatarUrl?: string;

  /**
   * platform role of the user.
   */
  role: `member` | `writer` | `moderator` | `admin`;

  /**
   * sign-in provider used by the user.
   */
  provider: `email` | `google`;

  /**
   * ISO creation date of the user account.
   */
  createdAt: string;
};
