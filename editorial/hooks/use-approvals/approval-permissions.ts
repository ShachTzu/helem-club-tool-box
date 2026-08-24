/**
 * role hierarchy of a platform user, ordered by increasing privilege.
 */
export type ReviewUserRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * the minimal shape a user needs to expose in order to be checked against
 * the editorial review and publish permissions.
 */
export type ReviewCapableUser = {
  /**
   * checks whether the user's role is at least as privileged as the
   * provided role.
   */
  isAtLeast: (role: ReviewUserRole) => boolean;
};

/**
 * whether the given user may review drafts — request changes, approve or
 * reject them. requires at least the moderator role.
 */
export function canReview(user?: ReviewCapableUser | null): boolean {
  return Boolean(user?.isAtLeast('moderator'));
}

/**
 * whether the given user may publish an approved draft. requires at least
 * the moderator role.
 */
export function canPublish(user?: ReviewCapableUser | null): boolean {
  return Boolean(user?.isAtLeast('moderator'));
}
