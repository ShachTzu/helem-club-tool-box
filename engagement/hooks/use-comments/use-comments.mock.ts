import { mockComment, mockComments } from '@helemclub/engagement.entities.comment';
import type { PlainComment } from '@helemclub/engagement.entities.comment';

/**
 * mock comments for previewing and testing useComments, covering a named
 * member comment, an anonymous device-scoped comment, a members-only
 * comment, and a hidden comment that should never be visible to any viewer.
 */
export function mockCommentsList(): PlainComment[] {
  return [
    ...mockComments(),
    mockComment({
      text: 'תוכן ייחודי לחברי הקהילה בלבד, זמין לאחר הצטרפות.',
      displayName: 'רואי כהן',
      isAnonymous: false,
      membersOnly: true,
    }),
  ].map((comment) => comment.toObject());
}
