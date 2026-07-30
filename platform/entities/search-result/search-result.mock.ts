import { v4 as uuid } from 'uuid';
import { SearchResult, type PlainSearchResult } from './search-result.js';

/**
 * create a single mock SearchResult, optionally overriding any of its properties.
 */
export function mockSearchResult(overrides: Partial<PlainSearchResult> = {}): SearchResult {
  return SearchResult.from({
    id: uuid(),
    type: 'app',
    title: 'נשימה 4-7-8',
    excerpt: 'תרגול נשימות מודרך להפחתת חרדה והירגעות מהירה בזמן משבר.',
    url: '/apps/breathing-478',
    imageUrl: 'https://storage.googleapis.com/bit-generated-images/images/image_a_calming_minimalist_icon_styl_0_1785184768460.png',
    domains: ['חרדה', 'משבר'],
    ...overrides,
  });
}

/**
 * create a list of mock SearchResult entities for development and testing.
 */
export function mockSearchResults(): SearchResult[] {
  return [
    mockSearchResult(),
    mockSearchResult({
      id: uuid(),
      type: 'blog',
      title: 'איך להתמודד עם מחשבות טורדניות',
      excerpt: 'מאמר על טכניקות מעשיות להתמודדות עם מחשבות חוזרות ובלתי רצויות.',
      url: '/blog/intrusive-thoughts',
      imageUrl: undefined,
      domains: ['OCD', 'חרדה'],
    }),
    mockSearchResult({
      id: uuid(),
      type: 'event',
      title: 'מפגש קבוצתי - חוכמת הקהילה',
      excerpt: 'מפגש חודשי לשיתוף חוויות והתמודדויות בין חברי הקהילה.',
      url: '/events/community-meetup',
      imageUrl: 'https://storage.googleapis.com/bit-generated-images/images/image_a_warm__minimalist_illustratio_0_1785184764276.png',
      domains: ['קהילה'],
    }),
    mockSearchResult({
      id: uuid(),
      type: 'knowledge',
      title: 'מדריך: זיהוי טריגרים רגשיים',
      excerpt: undefined,
      url: '/knowledge/emotional-triggers',
      imageUrl: undefined,
      domains: ['רגשות', 'משבר'],
    }),
  ];
}
