/**
 * platform user roles, ordered by increasing privilege. declared locally to
 * avoid depending on the platform entities package directly.
 */
export type ReviewQueueRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * the shape of the mock user accepted by the review queue, mirroring the
 * platform's PlainUser type.
 */
export type ReviewQueueUser = {
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
  role: ReviewQueueRole;

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
