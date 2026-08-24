import type { EditorialStats } from './use-editorial-stats.js';

/**
 * mock editorial stats reflecting a typical month of activity: a healthy mix
 * of content types and two active reviewers.
 */
export const mockEditorialStats: EditorialStats = {
  totalDrafts: 42,
  pendingReview: 5,
  approvedThisPeriod: 18,
  publishedThisPeriod: 15,
  rejectedThisPeriod: 3,
  avgHoursToApproval: 14.5,
  byContentType: [
    { contentType: 'post', label: 'פוסט', count: 20 },
    { contentType: 'media-record', label: 'רשומת מדיה', count: 12 },
    { contentType: 'event', label: 'אירוע', count: 10 },
  ],
  byReviewer: [
    { actorId: 'user-1', actorName: 'נועה כהן', approvals: 11, rejections: 1 },
    { actorId: 'user-2', actorName: 'איתי לוי', approvals: 7, rejections: 2 },
  ],
};

/**
 * mock editorial stats representing an empty system with no drafts or review
 * activity, used to test and preview empty states.
 */
export const emptyEditorialStats: EditorialStats = {
  totalDrafts: 0,
  pendingReview: 0,
  approvedThisPeriod: 0,
  publishedThisPeriod: 0,
  rejectedThisPeriod: 0,
  avgHoursToApproval: 0,
  byContentType: [],
  byReviewer: [],
};
