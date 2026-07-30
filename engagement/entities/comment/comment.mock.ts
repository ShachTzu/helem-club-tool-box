import { v4 as uuid } from 'uuid';
import { Comment, type PlainComment } from './comment.js';

/**
 * create a single mock Comment, optionally overriding any of its properties.
 */
export function mockComment(overrides: Partial<PlainComment> = {}): Comment {
  return Comment.from({
    id: uuid(),
    targetType: 'app',
    targetId: uuid(),
    text: 'תודה על השיתוף. הפסקה על הקרקוע הזכירה לי כמה חשוב פשוט לעצור ולנשום.',
    displayName: 'מיכל ר.',
    isAnonymous: false,
    membersOnly: false,
    deviceId: undefined,
    userId: uuid(),
    reportCount: 0,
    hidden: false,
    createdAt: new Date().toISOString(),
    ...overrides,
  });
}

/**
 * create a list of mock Comments for development and testing purposes.
 */
export function mockComments(): Comment[] {
  return [
    mockComment({
      text: 'תודה על השיתוף. הפסקה על הקרקוע הזכירה לי כמה חשוב פשוט לעצור ולנשום. שמרתי לעצמי.',
      displayName: 'מיכל ר.',
      isAnonymous: false,
      userId: uuid(),
      reportCount: 0,
    }),
    mockComment({
      text: 'שמחים שעזר 🤍 יש עוד תרגול קרקוע מודרך במאגר הידע אם בא לך.',
      displayName: 'צוות הלם קלאב',
      isAnonymous: false,
      membersOnly: false,
      userId: uuid(),
    }),
    mockComment({
      text: 'לקח לי זמן להבין שאני לא לבד עם זה. הקהילה כאן עושה הבדל.',
      displayName: 'אנונימי/ת',
      isAnonymous: true,
      userId: undefined,
      deviceId: uuid(),
    }),
    mockComment({
      text: 'תוכן פוגעני שדווח על ידי משתמשים.',
      displayName: 'אורח',
      isAnonymous: true,
      userId: undefined,
      deviceId: uuid(),
      reportCount: 3,
      hidden: true,
    }),
  ];
}
