import type { Comment } from '@helemclub/engagement.entities.comment';

/**
 * filters a list of comments down to the ones a viewer is allowed to see.
 * hidden comments (e.g. moderated after reports) are always excluded.
 * members-only comments are excluded for viewers who are not members.
 */
export function filterVisibleComments(comments: Comment[], isMember: boolean): Comment[] {
  return comments.filter((comment) => {
    if (comment.hidden) return false;
    if (comment.membersOnly && !isMember) return false;
    return true;
  });
}
