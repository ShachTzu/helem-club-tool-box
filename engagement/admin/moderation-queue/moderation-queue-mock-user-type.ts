/**
 * platform user role, ordered by increasing privilege. mirrored locally so
 * this component does not depend on the platform user entity package.
 */
export type ModerationQueueUserRole = `member` | `writer` | `moderator` | `admin`;

/**
 * a minimal, plain representation of the current user used to bypass the
 * protected route's auth check for tests and previews.
 */
export type ModerationQueueMockUser = {
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
  role: ModerationQueueUserRole;

  /**
   * provider used by the user to authenticate.
   */
  provider: `email` | `google`;

  /**
   * ISO timestamp of when the user was created.
   */
  createdAt: string;
};
