import { mockComment, mockComments } from '@helemclub/engagement.entities.comment';
import type { PlainComment } from '@helemclub/engagement.entities.comment';

/**
 * mock comments for previewing the comment thread: a named member comment,
 * an anonymous device-scoped comment, a members-only comment (gated for
 * anonymous viewers), and a hidden comment that should never render.
 */
export function mockCommentThreadComments(): PlainComment[] {
  return [
    ...mockComments(),
    mockComment({
      text: `תוכן ייחודי לחברי הקהילה בלבד, זמין לאחר הצטרפות.`,
      displayName: `רואי כהן`,
      isAnonymous: false,
      membersOnly: true,
      hidden: false,
    }),
  ].map((comment) => comment.toObject());
}
