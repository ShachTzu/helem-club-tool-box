/**
 * the minimal shape a user must satisfy to be checked for review
 * permissions — the role-comparison method exposed by the platform's User
 * entity.
 */
export type ReviewPermissionUser = {
  isAtLeast: (role: string) => boolean;
};

/**
 * whether the given user may review drafts — request changes, approve or
 * reject them. reviewing is reserved for moderators and admins.
 */
export function canReview(user?: ReviewPermissionUser | null): boolean {
  return Boolean(user?.isAtLeast('moderator'));
}

/**
 * whether the given user may publish an approved draft. publishing is
 * reserved for moderators and admins, same as reviewing.
 */
export function canPublish(user?: ReviewPermissionUser | null): boolean {
  return Boolean(user?.isAtLeast('moderator'));
}
