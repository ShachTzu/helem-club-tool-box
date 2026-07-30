import { BlogStats } from './blog-stat.js';
import type { PlainBlogStats } from './blog-stat.js';

/**
 * create a mock BlogStats snapshot, with optional partial overrides.
 */
export function mockBlogStats(overrides: Partial<PlainBlogStats> = {}) {
  return BlogStats.from({
    id: 'current',
    totalPosts: 42,
    uniqueVisitors: 8760,
    totalViews: 15320,
    topPosts: [
      { id: 'shame-and-guilt', title: 'הבושה שאף אחד לא מדבר עליה', views: 3240 },
      { id: 'triggers-toolkit', title: '5 כלים שעוזרים לי עם טריגרים', views: 2115 },
      { id: 'sleep-story', title: 'הלילות הארוכים — ומה שעזר לי לישון', views: 1870 },
    ],
    authors: [
      {
        name: 'ד״ר מיכל ברק',
        postCount: 12,
        lastPostDate: '12 במאי 2026',
        posts: [
          { title: 'הבושה שאף אחד לא מדבר עליה', date: '12 במאי 2026' },
          { title: 'ויסות רגשי אחרי טראומה', date: '2 באפריל 2026' },
        ],
      },
      {
        name: 'רון אבני',
        postCount: 7,
        lastPostDate: '28 באפריל 2026',
        posts: [{ title: '5 כלים שעוזרים לי עם טריגרים', date: '28 באפריל 2026' }],
      },
      {
        name: 'תמר גל',
        postCount: 5,
        lastPostDate: '19 באפריל 2026',
        posts: [{ title: 'הלילות הארוכים — ומה שעזר לי לישון', date: '19 באפריל 2026' }],
      },
    ],
    comments: 486,
    reactions: 1920,
    saves: 640,
    verifiedMembers: 312,
    ...overrides,
  });
}

/**
 * create a mock BlogStats snapshot representing an empty/new blog.
 */
export function mockEmptyBlogStats(overrides: Partial<PlainBlogStats> = {}) {
  return BlogStats.from({
    id: 'empty',
    totalPosts: 0,
    uniqueVisitors: 0,
    totalViews: 0,
    topPosts: [],
    authors: [],
    comments: 0,
    reactions: 0,
    saves: 0,
    verifiedMembers: 0,
    ...overrides,
  });
}
