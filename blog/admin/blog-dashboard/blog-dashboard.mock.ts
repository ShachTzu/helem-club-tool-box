import type { BlogDashboardStats } from './blog-dashboard-stats-type.js';
import type { BlogDashboardUser } from './blog-dashboard-user-type.js';

/**
 * mock admin user, used to bypass the protected route auth check in
 * previews and tests.
 */
export const mockBlogDashboardAdminUser: BlogDashboardUser = {
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
export const mockBlogDashboardMemberUser: BlogDashboardUser = {
  id: `member-1`,
  email: `member@helem.club`,
  displayName: `שי כהן`,
  role: `member`,
  provider: `email`,
  createdAt: `2026-01-01T00:00:00.000Z`,
};

/**
 * rich mock blog stats snapshot, used for previews and tests.
 */
export const mockBlogDashboardStats: BlogDashboardStats = {
  totalPosts: 58,
  uniqueVisitors: 9840,
  totalViews: 21430,
  comments: 612,
  reactions: 2380,
  saves: 745,
  verifiedMembers: 388,
  topPosts: [
    { id: `shame-and-guilt`, title: `הבושה שאף אחד לא מדבר עליה`, views: 3240 },
    { id: `triggers-toolkit`, title: `5 כלים שעוזרים לי עם טריגרים`, views: 2115 },
    { id: `sleep-story`, title: `הלילות הארוכים — ומה שעזר לי לישון`, views: 1870 },
    { id: `boundaries`, title: `איך למדתי לשים גבולות בלי אשמה`, views: 1540 },
    { id: `group-therapy`, title: `טיפול קבוצתי: מה קרה לי בפגישה הראשונה`, views: 1290 },
    { id: `relapse`, title: `נפילה זה לא כישלון — יומן החזרה שלי`, views: 1120 },
    { id: `family-talk`, title: `איך מסבירים למשפחה מה זה PTSD`, views: 980 },
    { id: `service-dog`, title: `כלב שירות שינה לי את החיים`, views: 860 },
    { id: `night-shift`, title: `לעבוד במשמרות לילה עם נדודי שינה`, views: 710 },
    { id: `gratitude`, title: `תרגול הכרת תודה קטן שעובד בשבילי`, views: 605 },
  ],
  authors: [
    {
      name: `ד״ר מיכל ברק`,
      postCount: 14,
      lastPostDate: `12 במאי 2026`,
      posts: [
        { title: `הבושה שאף אחד לא מדבר עליה`, date: `12 במאי 2026` },
        { title: `ויסות רגשי אחרי טראומה`, date: `2 באפריל 2026` },
        { title: `גבולות בריאים במערכות יחסים`, date: `18 במרץ 2026` },
      ],
    },
    {
      name: `רון אבני`,
      postCount: 9,
      lastPostDate: `28 באפריל 2026`,
      posts: [
        { title: `5 כלים שעוזרים לי עם טריגרים`, date: `28 באפריל 2026` },
        { title: `נפילה זה לא כישלון — יומן החזרה שלי`, date: `9 במרץ 2026` },
      ],
    },
    {
      name: `תמר גל`,
      postCount: 6,
      lastPostDate: `19 באפריל 2026`,
      posts: [{ title: `הלילות הארוכים — ומה שעזר לי לישון`, date: `19 באפריל 2026` }],
    },
    {
      name: `איתי לוי`,
      postCount: 4,
      lastPostDate: `2 באפריל 2026`,
      posts: [{ title: `כלב שירות שינה לי את החיים`, date: `2 באפריל 2026` }],
    },
  ],
};

/**
 * empty mock blog stats snapshot, used to demonstrate the empty states.
 */
export const mockEmptyBlogDashboardStats: BlogDashboardStats = {
  totalPosts: 0,
  uniqueVisitors: 0,
  totalViews: 0,
  comments: 0,
  reactions: 0,
  saves: 0,
  verifiedMembers: 0,
  topPosts: [],
  authors: [],
};
