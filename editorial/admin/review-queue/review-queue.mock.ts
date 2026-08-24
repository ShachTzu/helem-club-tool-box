import type { PlainDraft } from '@helemclub/editorial.entities.draft';
import type { PlainApprovalEntry } from '@helemclub/editorial.entities.approval-entry';
import type { ReviewQueueUser } from './review-queue-user-type.js';

/**
 * a fixed "now" so waiting times render deterministically in previews.
 */
export const mockReviewQueueNow = new Date('2024-05-10T09:00:00.000Z');

/**
 * the moderator reviewing the queue.
 */
export const mockReviewQueueModerator: ReviewQueueUser = {
  id: 'user-moderator-1',
  email: 'tamar@helemclub.org',
  displayName: 'תמר לוי',
  role: 'moderator',
  provider: 'email',
  createdAt: '2023-11-02T09:00:00.000Z',
};

/**
 * a member, used to preview the access-denied path.
 */
export const mockReviewQueueMember: ReviewQueueUser = {
  id: 'user-member-1',
  email: 'dana@helemclub.org',
  displayName: 'דנה כהן',
  role: 'member',
  provider: 'email',
  createdAt: '2024-02-02T09:00:00.000Z',
};

/**
 * six drafts awaiting a decision, including two that waited past the
 * overdue threshold.
 */
export const mockReviewQueueDrafts: PlainDraft[] = [
  {
    id: 'draft-q1',
    contentType: 'post',
    title: 'מה עוזר לי בלילות',
    payload: { excerpt: 'שישה דברים קטנים שעזרו לחברי הקהילה לעבור את שעות הלילה.' },
    domains: ['sleep'],
    status: 'in_review',
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    currentVersion: 3,
    createdAt: '2024-04-20T08:00:00.000Z',
    updatedAt: '2024-04-28T08:00:00.000Z',
    submittedAt: '2024-04-28T08:00:00.000Z',
  },
  {
    id: 'draft-q2',
    contentType: 'media-record',
    title: 'הקלטה: סדנת נשימה מודרכת',
    payload: { mediaUrl: 'https://www.youtube.com/watch?v=demo', mediaType: 'video' },
    domains: ['anxiety', 'body'],
    status: 'in_review',
    authorId: 'user-writer-2',
    authorName: 'יונתן שגב',
    currentVersion: 2,
    createdAt: '2024-04-25T08:00:00.000Z',
    updatedAt: '2024-05-01T08:00:00.000Z',
    submittedAt: '2024-05-01T08:00:00.000Z',
  },
  {
    id: 'draft-q3',
    contentType: 'post',
    title: 'לחזור לעבודה בלי להתנצל',
    payload: { excerpt: 'על החזרה למקום העבודה, ועל מה שמותר לבקש.' },
    domains: ['work'],
    status: 'in_review',
    authorId: 'user-writer-3',
    authorName: 'מיכל אדרי',
    currentVersion: 5,
    createdAt: '2024-04-30T08:00:00.000Z',
    updatedAt: '2024-05-06T08:00:00.000Z',
    submittedAt: '2024-05-06T08:00:00.000Z',
  },
  {
    id: 'draft-q4',
    contentType: 'post',
    title: 'שגרה חדשה: להרכיב יום כשהכול השתנה',
    payload: { excerpt: 'מדריך מעשי לבניית שגרה יומית אחרי תקופה ארוכה של חוסר ודאות.' },
    domains: ['routine'],
    status: 'in_review',
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    currentVersion: 4,
    createdAt: '2024-05-02T08:00:00.000Z',
    updatedAt: '2024-05-08T08:00:00.000Z',
    submittedAt: '2024-05-08T08:00:00.000Z',
  },
  {
    id: 'draft-q5',
    contentType: 'media-record',
    title: 'פודקאסט: להתמודד יחד',
    payload: { mediaUrl: 'https://example.com/audio.mp3', mediaType: 'audio' },
    domains: ['community'],
    status: 'in_review',
    authorId: 'user-writer-2',
    authorName: 'יונתן שגב',
    currentVersion: 1,
    createdAt: '2024-05-09T08:00:00.000Z',
    updatedAt: '2024-05-09T08:00:00.000Z',
    submittedAt: '2024-05-09T08:00:00.000Z',
  },
  {
    id: 'draft-q6',
    contentType: 'post',
    title: 'איך מדברים עם ילדים על יום אחרי',
    payload: { excerpt: 'שיחה כנה עם ילדים אחרי אירוע מטלטל.' },
    domains: ['family'],
    status: 'in_review',
    authorId: 'user-writer-3',
    authorName: 'מיכל אדרי',
    currentVersion: 2,
    createdAt: '2024-04-15T08:00:00.000Z',
    updatedAt: '2024-04-22T08:00:00.000Z',
    submittedAt: '2024-04-22T08:00:00.000Z',
  },
];

/**
 * recent editorial decisions, shown on the second tab.
 */
export const mockReviewQueueDecisions: PlainApprovalEntry[] = [
  {
    id: 'dec-1',
    draftId: 'draft-old-1',
    action: 'approved',
    actorId: 'user-moderator-1',
    actorName: 'תמר לוי',
    actorRole: 'moderator',
    fromStatus: 'in_review',
    toStatus: 'approved',
    versionNumber: 4,
    createdAt: '2024-05-08T12:00:00.000Z',
  },
  {
    id: 'dec-2',
    draftId: 'draft-old-2',
    action: 'changes_requested',
    actorId: 'user-moderator-1',
    actorName: 'תמר לוי',
    actorRole: 'moderator',
    note: 'אפשר להוסיף תיאור קצר של הסדנה ולציין את שם המנחה.',
    fromStatus: 'in_review',
    toStatus: 'changes_requested',
    versionNumber: 3,
    createdAt: '2024-05-07T09:30:00.000Z',
  },
  {
    id: 'dec-3',
    draftId: 'draft-old-3',
    action: 'rejected',
    actorId: 'user-admin-1',
    actorName: 'אורי מזרחי',
    actorRole: 'admin',
    note: 'התוכן חופף למאמר שכבר פורסם בקהילה.',
    fromStatus: 'in_review',
    toStatus: 'archived',
    versionNumber: 1,
    createdAt: '2024-05-05T15:45:00.000Z',
  },
];
