import type { PlainDraft } from '@helemclub/editorial.entities.draft';
import type { LibraryWorkspaceUser } from './library-workspace-user-type.js';

/**
 * a signed-in writer used by the workspace compositions and tests.
 */
export const mockWorkspaceWriter: LibraryWorkspaceUser = {
  id: 'user-writer-1',
  email: 'noa@helemclub.org',
  displayName: 'נועה בר־און',
  role: 'writer',
  provider: 'email',
  createdAt: '2024-01-12T09:00:00.000Z',
};

/**
 * a signed-in moderator used to preview the "show all drafts" toggle.
 */
export const mockWorkspaceModerator: LibraryWorkspaceUser = {
  id: 'user-moderator-1',
  email: 'tamar@helemclub.org',
  displayName: 'תמר לוי',
  role: 'moderator',
  provider: 'email',
  createdAt: '2023-11-02T09:00:00.000Z',
};

/**
 * drafts authored by the mock writer, covering every editorial status the
 * workspace groups content into.
 */
export const mockWorkspaceDrafts: PlainDraft[] = [
  {
    id: 'draft-1',
    contentType: 'post',
    title: 'איך מדברים עם ילדים על יום אחרי',
    payload: {
      excerpt: 'שיחה כנה עם ילדים אחרי אירוע מטלטל, בלי להבטיח הבטחות שאי אפשר לקיים.',
    },
    domains: ['family', 'anxiety'],
    status: 'draft',
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    currentVersion: 2,
    createdAt: '2024-05-01T08:15:00.000Z',
    updatedAt: '2024-05-03T11:42:00.000Z',
  },
  {
    id: 'draft-2',
    contentType: 'post',
    title: 'שגרה חדשה: להרכיב יום כשהכול השתנה',
    payload: { excerpt: 'מדריך מעשי לבניית שגרה יומית אחרי תקופה ארוכה של חוסר ודאות.' },
    domains: ['routine'],
    status: 'in_review',
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    currentVersion: 4,
    createdAt: '2024-04-20T08:15:00.000Z',
    updatedAt: '2024-05-02T16:05:00.000Z',
    submittedAt: '2024-05-02T16:05:00.000Z',
  },
  {
    id: 'draft-3',
    contentType: 'media-record',
    title: 'הקלטה: סדנת נשימה מודרכת',
    payload: { mediaUrl: 'https://www.youtube.com/watch?v=demo', mediaType: 'video' },
    domains: ['anxiety', 'body'],
    status: 'changes_requested',
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    currentVersion: 3,
    createdAt: '2024-04-11T08:15:00.000Z',
    updatedAt: '2024-04-28T09:30:00.000Z',
    submittedAt: '2024-04-25T09:30:00.000Z',
    lastReviewerId: 'user-moderator-1',
    lastReviewNote: 'אפשר להוסיף תיאור קצר של הסדנה ולציין את שם המנחה.',
  },
  {
    id: 'draft-4',
    contentType: 'post',
    title: 'מה עוזר לי בלילות',
    payload: { excerpt: 'שישה דברים קטנים שעזרו לחברי הקהילה לעבור את שעות הלילה.' },
    domains: ['sleep'],
    status: 'approved',
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    currentVersion: 5,
    createdAt: '2024-03-30T08:15:00.000Z',
    updatedAt: '2024-04-22T14:10:00.000Z',
    submittedAt: '2024-04-20T14:10:00.000Z',
    lastReviewerId: 'user-moderator-1',
  },
  {
    id: 'draft-5',
    contentType: 'post',
    title: 'לחזור לעבודה בלי להתנצל',
    payload: { excerpt: 'על החזרה למקום העבודה, ועל מה שמותר לבקש.' },
    domains: ['work'],
    status: 'published',
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    contentRef: 'post-88',
    currentVersion: 6,
    createdAt: '2024-02-14T08:15:00.000Z',
    updatedAt: '2024-03-10T10:00:00.000Z',
    submittedAt: '2024-03-05T10:00:00.000Z',
    publishedAt: '2024-03-10T10:00:00.000Z',
    lastReviewerId: 'user-moderator-1',
  },
  {
    id: 'draft-6',
    contentType: 'media-record',
    title: 'פודקאסט: להתמודד יחד',
    payload: { mediaUrl: 'https://example.com/audio.mp3', mediaType: 'audio' },
    domains: ['community'],
    status: 'in_review',
    authorId: 'user-writer-2',
    authorName: 'יונתן שגב',
    currentVersion: 1,
    createdAt: '2024-05-04T08:15:00.000Z',
    updatedAt: '2024-05-04T08:15:00.000Z',
    submittedAt: '2024-05-04T08:15:00.000Z',
  },
];
