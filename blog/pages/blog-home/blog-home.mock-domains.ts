import type { DomainFilterProps } from '@helemclub/knowledge-domains.ui.domain-filter';

/**
 * mock domains for the blog home compositions and tests, matching the domain
 * ids used on the mock posts.
 */
export const MOCK_BLOG_DOMAINS: NonNullable<DomainFilterProps['mockDomains']> = [
  { id: 'anxiety', slug: 'anxiety', name: `חרדה`, count: 2 },
  { id: 'emotional-regulation', slug: 'emotional-regulation', name: `ויסות רגשי`, count: 1 },
  { id: 'sleep', slug: 'sleep', name: `שינה`, count: 1 },
  { id: 'triggers', slug: 'triggers', name: `טריגרים`, count: 1 },
  { id: 'loneliness-connection', slug: 'loneliness-connection', name: `בדידות וחיבור חברתי`, count: 1 },
  { id: 'family-relationships', slug: 'family-relationships', name: `משפחה, זוגיות ויחסים`, count: 1 },
  { id: 'work-career', slug: 'work-career', name: `עבודה וקריירה`, count: 0 },
  { id: 'mindfulness-breathing', slug: 'mindfulness-breathing', name: `מיינדפולנס ונשימות`, count: 1 },
  { id: 'guilt-shame', slug: 'guilt-shame', name: `אשמה, בושה וביקורת עצמית`, count: 1 },
];
