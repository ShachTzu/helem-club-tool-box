import type { PlainDraft } from '@helemclub/editorial.entities.draft';
import type { PlainRevision } from '@helemclub/editorial.entities.revision';
import type { PlainApprovalEntry } from '@helemclub/editorial.entities.approval-entry';
import type { DraftEditorUser } from './draft-editor-user-type.js';

/**
 * the writer who authored the mock drafts below.
 */
export const mockEditorWriter: DraftEditorUser = {
  id: 'user-writer-1',
  email: 'noa@helemclub.org',
  displayName: 'נועה בר־און',
  role: 'writer',
  provider: 'email',
  createdAt: '2024-01-12T09:00:00.000Z',
};

/**
 * a brand new draft, with almost nothing filled in yet.
 */
export const mockNewDraft: PlainDraft = {
  id: 'draft-new',
  contentType: 'post',
  title: '',
  payload: { excerpt: '', body: '' },
  domains: [],
  status: 'draft',
  authorId: 'user-writer-1',
  authorName: 'נועה בר־און',
  currentVersion: 1,
  createdAt: '2024-05-06T09:00:00.000Z',
  updatedAt: '2024-05-06T09:00:00.000Z',
};

/**
 * a draft in active editing, with several versions behind it.
 */
export const mockEditingDraft: PlainDraft = {
  id: 'draft-1',
  contentType: 'post',
  title: 'איך מדברים עם ילדים על יום אחרי',
  payload: {
    excerpt: 'שיחה כנה עם ילדים אחרי אירוע מטלטל, בלי להבטיח הבטחות שאי אפשר לקיים.',
    body: 'ילדים קולטים הרבה יותר ממה שאנחנו חושבים. הם שומעים את הטון, רואים את הפנים...',
  },
  domains: ['family', 'anxiety'],
  status: 'draft',
  authorId: 'user-writer-1',
  authorName: 'נועה בר־און',
  currentVersion: 3,
  createdAt: '2024-05-01T08:15:00.000Z',
  updatedAt: '2024-05-03T11:42:00.000Z',
};

/**
 * a draft the moderator sent back with a note, the state a writer most
 * often returns to.
 */
export const mockChangesRequestedDraft: PlainDraft = {
  ...mockEditingDraft,
  id: 'draft-3',
  status: 'changes_requested',
  currentVersion: 4,
  submittedAt: '2024-05-04T09:30:00.000Z',
  lastReviewerId: 'user-moderator-1',
  lastReviewNote:
    'הכיוון מצוין. אפשר להוסיף פסקה על מה עושים כשהילד לא רוצה לדבר בכלל, ולרכך את הסיום.',
};

/**
 * the version history behind the mock draft.
 */
export const mockEditorRevisions: PlainRevision[] = [
  {
    id: 'rev-1',
    draftId: 'draft-1',
    versionNumber: 1,
    title: 'איך מדברים עם ילדים',
    payload: { excerpt: 'טיוטה ראשונה.', body: '' },
    domains: ['family'],
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    changeSummary: 'נוצרה טיוטה ראשונה',
    createdAt: '2024-05-01T08:15:00.000Z',
  },
  {
    id: 'rev-2',
    draftId: 'draft-1',
    versionNumber: 2,
    title: 'איך מדברים עם ילדים על יום אחרי',
    payload: { excerpt: 'שיחה כנה עם ילדים אחרי אירוע מטלטל.', body: 'ילדים קולטים...' },
    domains: ['family', 'anxiety'],
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    changeSummary: 'הורחבה הכותרת ונוסף גוף ראשוני',
    createdAt: '2024-05-02T10:20:00.000Z',
  },
  {
    id: 'rev-3',
    draftId: 'draft-1',
    versionNumber: 3,
    title: 'איך מדברים עם ילדים על יום אחרי',
    payload: {
      excerpt: 'שיחה כנה עם ילדים אחרי אירוע מטלטל, בלי להבטיח הבטחות שאי אפשר לקיים.',
      body: 'ילדים קולטים הרבה יותר ממה שאנחנו חושבים...',
    },
    domains: ['family', 'anxiety'],
    authorId: 'user-writer-1',
    authorName: 'נועה בר־און',
    changeSummary: 'חודד התקציר',
    createdAt: '2024-05-03T11:42:00.000Z',
  },
];

/**
 * the approval trail matching the mock revisions.
 */
export const mockEditorApprovals: PlainApprovalEntry[] = [
  {
    id: 'app-1',
    draftId: 'draft-1',
    action: 'created',
    actorId: 'user-writer-1',
    actorName: 'נועה בר־און',
    actorRole: 'writer',
    toStatus: 'draft',
    versionNumber: 1,
    createdAt: '2024-05-01T08:15:00.000Z',
  },
  {
    id: 'app-2',
    draftId: 'draft-1',
    action: 'submitted',
    actorId: 'user-writer-1',
    actorName: 'נועה בר־און',
    actorRole: 'writer',
    fromStatus: 'draft',
    toStatus: 'in_review',
    versionNumber: 3,
    createdAt: '2024-05-04T09:00:00.000Z',
  },
  {
    id: 'app-3',
    draftId: 'draft-1',
    action: 'changes_requested',
    actorId: 'user-moderator-1',
    actorName: 'תמר לוי',
    actorRole: 'moderator',
    note: 'הכיוון מצוין. אפשר להוסיף פסקה על מה עושים כשהילד לא רוצה לדבר בכלל.',
    fromStatus: 'in_review',
    toStatus: 'changes_requested',
    versionNumber: 3,
    createdAt: '2024-05-04T14:30:00.000Z',
  },
];
