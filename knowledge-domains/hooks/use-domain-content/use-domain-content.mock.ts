import type { TaggedContent } from './use-domain-content.js';

/**
 * a single mock TaggedContent item, optionally overriding any of its properties.
 */
export function mockTaggedContent(overrides: Partial<TaggedContent> = {}): TaggedContent {
  return {
    type: 'post',
    id: 'triggers-toolkit',
    title: 'ארגז כלים להתמודדות עם טריגרים',
    excerpt: 'מדריך מעשי לזיהוי טריגרים ובניית תוכנית התמודדות אישית.',
    url: '/blog/triggers-toolkit',
    imageUrl: undefined,
    domains: ['triggers'],
    ...overrides,
  };
}

/**
 * a list of mock TaggedContent items spanning multiple content types,
 * representing a typical cross-slice result for a single domain.
 */
export function mockTaggedContentList(): TaggedContent[] {
  return [
    mockTaggedContent({
      type: 'post',
      id: 'triggers-toolkit',
      title: 'ארגז כלים להתמודדות עם טריגרים',
      excerpt: 'מדריך מעשי לזיהוי טריגרים ובניית תוכנית התמודדות אישית.',
      url: '/blog/triggers-toolkit',
      domains: ['triggers'],
    }),
    mockTaggedContent({
      type: 'record',
      id: 'panic-breathing',
      title: 'תרגול נשימה להתקפי חרדה',
      excerpt: 'הקלטה מודרכת בת 8 דקות להרגעת מערכת העצבים.',
      url: '/knowledge/panic-breathing',
      domains: ['triggers', 'anxiety'],
    }),
    mockTaggedContent({
      type: 'event',
      id: 'webinar-triggers',
      title: 'וובינר: לזהות טריגרים לפני שהם משתלטים',
      excerpt: 'מפגש קבוצתי בהנחיית מטפלת מומחית לטראומה.',
      url: '/events/webinar-triggers',
      domains: ['triggers'],
    }),
    mockTaggedContent({
      type: 'app',
      id: 'app-calm-tracker',
      title: 'מעקב רוגע יומי',
      excerpt: 'אפליקציה למעקב אחר טריגרים ותגובות במהלך היום.',
      url: '/toolbox/app-calm-tracker',
      domains: ['triggers'],
    }),
  ];
}
