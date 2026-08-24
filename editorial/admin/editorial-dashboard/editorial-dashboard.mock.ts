import type { EditorialStats } from '@helemclub/editorial.hooks.use-editorial-stats';
import type { EditorialDashboardUser } from './editorial-dashboard-user-type.js';
import type { EditorialDashboardMockDraft } from './editorial-dashboard-mock-draft-type.js';

/**
 * mock admin user, used to bypass the protected route auth check in
 * previews and tests.
 */
export const mockEditorialDashboardAdminUser: EditorialDashboardUser = {
  id: `admin-1`,
  email: `admin@helem.club`,
  displayName: `הלם אדמין`,
  role: `admin`,
  provider: `email`,
  createdAt: `2026-01-01T00:00:00.000Z`,
};

/**
 * mock member user, used to demonstrate the restricted (forbidden) view.
 */
export const mockEditorialDashboardMemberUser: EditorialDashboardUser = {
  id: `member-1`,
  email: `member@helem.club`,
  displayName: `שי כהן`,
  role: `member`,
  provider: `email`,
  createdAt: `2026-01-01T00:00:00.000Z`,
};

/**
 * rich mock editorial stats snapshot, reflecting a typical month of
 * activity with a healthy mix of content types and reviewer activity.
 */
export const mockEditorialDashboardStats: EditorialStats = {
  totalDrafts: 64,
  pendingReview: 8,
  approvedThisPeriod: 22,
  publishedThisPeriod: 19,
  rejectedThisPeriod: 4,
  avgHoursToApproval: 16.4,
  byContentType: [
    { contentType: `post`, label: `פוסט`, count: 28 },
    { contentType: `media-record`, label: `רשומת מדיה`, count: 18 },
    { contentType: `event`, label: `אירוע`, count: 12 },
    { contentType: `tool`, label: `כלי`, count: 6 },
  ],
  byReviewer: [
    { actorId: `user-1`, actorName: `נועה כהן`, approvals: 14, rejections: 1 },
    { actorId: `user-2`, actorName: `איתי לוי`, approvals: 9, rejections: 2 },
    { actorId: `user-3`, actorName: `מאיה ברק`, approvals: 6, rejections: 1 },
  ],
};

/**
 * empty mock editorial stats snapshot, representing a system with no
 * drafts or review activity, used for the empty dashboard preview.
 */
export const mockEmptyEditorialDashboardStats: EditorialStats = {
  totalDrafts: 0,
  pendingReview: 0,
  approvedThisPeriod: 0,
  publishedThisPeriod: 0,
  rejectedThisPeriod: 0,
  avgHoursToApproval: 0,
  byContentType: [],
  byReviewer: [],
};

/**
 * mock drafts pending review, ordered from most recently submitted to the
 * oldest, used to preview the "longest waiting" panel.
 */
export const mockEditorialDashboardPendingDrafts: EditorialDashboardMockDraft[] = [
  {
    id: `draft-1`,
    contentType: `post`,
    title: `הבושה שאף אחד לא מדבר עליה`,
    payload: {},
    domains: [`guilt-shame`],
    status: `in_review`,
    authorId: `writer-1`,
    authorName: `רון אבני`,
    currentVersion: 2,
    createdAt: `2026-02-01T08:00:00.000Z`,
    updatedAt: `2026-02-09T08:00:00.000Z`,
    submittedAt: `2026-02-01T08:00:00.000Z`,
  },
  {
    id: `draft-2`,
    contentType: `media-record`,
    title: `הקלטת הרצאה: ויסות רגשי בזמן משבר`,
    payload: {},
    domains: [`emotional-regulation`],
    status: `in_review`,
    authorId: `writer-2`,
    authorName: `תמר גל`,
    currentVersion: 1,
    createdAt: `2026-02-03T09:30:00.000Z`,
    updatedAt: `2026-02-06T09:30:00.000Z`,
    submittedAt: `2026-02-03T09:30:00.000Z`,
  },
  {
    id: `draft-3`,
    contentType: `event`,
    title: `שולחן עגול: התמודדות עם נדודי שינה`,
    payload: {},
    domains: [`sleep`],
    status: `in_review`,
    authorId: `writer-3`,
    authorName: `ד״ר מיכל ברק`,
    currentVersion: 3,
    createdAt: `2026-02-05T12:00:00.000Z`,
    updatedAt: `2026-02-07T12:00:00.000Z`,
    submittedAt: `2026-02-05T12:00:00.000Z`,
  },
  {
    id: `draft-4`,
    contentType: `post`,
    title: `כלב שירות שינה לי את החיים`,
    payload: {},
    domains: [`loneliness-connection`],
    status: `in_review`,
    authorId: `writer-4`,
    authorName: `איתי לוי`,
    currentVersion: 1,
    createdAt: `2026-02-08T10:15:00.000Z`,
    updatedAt: `2026-02-08T10:15:00.000Z`,
    submittedAt: `2026-02-08T10:15:00.000Z`,
  },
  {
    id: `draft-5`,
    contentType: `tool`,
    title: `תרגול הארקה בחמישה שלבים`,
    payload: {},
    domains: [`mindfulness-breathing`],
    status: `in_review`,
    authorId: `writer-5`,
    authorName: `שירה אזולאי`,
    currentVersion: 1,
    createdAt: `2026-02-10T07:45:00.000Z`,
    updatedAt: `2026-02-10T07:45:00.000Z`,
    submittedAt: `2026-02-10T07:45:00.000Z`,
  },
];
