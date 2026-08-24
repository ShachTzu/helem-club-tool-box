import { v4 as uuid } from 'uuid';
import { Draft, PlainDraft } from './draft.js';

/**
 * generate mock drafts for development and testing purposes.
 * accepts an optional list of partial overrides, one per generated draft.
 */
export function mockDrafts(overrides: Partial<PlainDraft>[] = []): Draft[] {
  const baseDrafts: PlainDraft[] = [
    {
      id: uuid(),
      contentType: 'post',
      title: 'חמישה טיפים לניהול זמן יעיל בעבודה מהבית',
      payload: {
        body: 'עבודה מהבית דורשת משמעת עצמית גבוהה. במאמר זה נסקור חמישה טיפים...',
        coverImage: '',
      },
      domains: ['תעסוקה', 'רווחה נפשית'],
      status: 'draft',
      authorId: 'user-101',
      authorName: 'נועה כהן',
      currentVersion: 1,
      createdAt: '2024-05-01T08:30:00.000Z',
      updatedAt: '2024-05-01T08:30:00.000Z',
    },
    {
      id: uuid(),
      contentType: 'post',
      title: 'מדריך זכויות עובדים חדשים בשנת 2024',
      payload: {
        body: 'סקירה מקיפה של הזכויות המגיעות לעובדים חדשים, כולל ימי מחלה, חופשה ועוד...',
      },
      domains: ['תעסוקה', 'זכויות'],
      status: 'in_review',
      authorId: 'user-102',
      authorName: 'איתי לוי',
      currentVersion: 2,
      createdAt: '2024-05-03T10:00:00.000Z',
      updatedAt: '2024-05-04T12:15:00.000Z',
      submittedAt: '2024-05-04T12:15:00.000Z',
    },
    {
      id: uuid(),
      contentType: 'media-record',
      contentRef: 'media-55',
      title: 'הרצאה מוקלטת: התמודדות עם חרדה חברתית',
      payload: {
        videoUrl: 'https://example.com/videos/anxiety-lecture.mp4',
        durationMinutes: 42,
      },
      domains: ['רווחה נפשית'],
      status: 'changes_requested',
      authorId: 'user-103',
      authorName: 'מיכל אברהם',
      currentVersion: 2,
      createdAt: '2024-04-20T09:00:00.000Z',
      updatedAt: '2024-04-25T14:40:00.000Z',
      submittedAt: '2024-04-22T11:00:00.000Z',
      lastReviewerId: 'user-900',
      lastReviewNote: 'יש להוסיף כתוביות בעברית ולקצר את המבוא.',
    },
    {
      id: uuid(),
      contentType: 'post',
      title: 'איך למלא טופס בקשה למענק דיור',
      payload: {
        body: 'הסבר שלב-אחר-שלב על תהליך הגשת הבקשה למענק הדיור...',
      },
      domains: ['דיור', 'תמיכה כלכלית'],
      status: 'approved',
      authorId: 'user-104',
      authorName: 'דנה שפירא',
      currentVersion: 3,
      createdAt: '2024-04-10T07:20:00.000Z',
      updatedAt: '2024-04-18T16:00:00.000Z',
      submittedAt: '2024-04-15T09:00:00.000Z',
      lastReviewerId: 'user-900',
      lastReviewNote: 'מאושר לפרסום, עבודה מצוינת.',
    },
    {
      id: uuid(),
      contentType: 'post',
      contentRef: 'post-231',
      title: 'רשימת קווים חמים לתמיכה נפשית זמינה 24/7',
      payload: {
        body: 'ריכוז של כל הקווים החמים הזמינים לתמיכה נפשית בכל שעות היממה...',
      },
      domains: ['רווחה נפשית', 'בריאות'],
      status: 'published',
      authorId: 'user-105',
      authorName: 'יובל מזרחי',
      currentVersion: 4,
      createdAt: '2024-03-01T06:00:00.000Z',
      updatedAt: '2024-03-05T08:30:00.000Z',
      submittedAt: '2024-03-02T07:00:00.000Z',
      publishedAt: '2024-03-05T08:30:00.000Z',
      lastReviewerId: 'user-901',
      lastReviewNote: 'פורסם בהצלחה.',
    },
    {
      id: uuid(),
      contentType: 'media-record',
      contentRef: 'media-12',
      title: 'סדנת הכנה לראיון עבודה (גרסה ישנה)',
      payload: {
        videoUrl: 'https://example.com/videos/old-interview-prep.mp4',
        durationMinutes: 55,
      },
      domains: ['תעסוקה'],
      status: 'archived',
      authorId: 'user-106',
      authorName: 'רותם ברק',
      currentVersion: 1,
      createdAt: '2023-11-01T10:00:00.000Z',
      updatedAt: '2024-02-01T10:00:00.000Z',
      submittedAt: '2023-11-02T10:00:00.000Z',
      publishedAt: '2023-11-05T10:00:00.000Z',
      lastReviewerId: 'user-900',
      lastReviewNote: 'הוחלף בגרסה מעודכנת, הועבר לארכיון.',
    },
  ];

  return baseDrafts.map((base, index) => Draft.from({ ...base, ...overrides[index] }));
}
