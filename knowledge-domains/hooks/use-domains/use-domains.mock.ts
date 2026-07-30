import type { PlainDomain } from '@helemclub/knowledge-domains.entities.domain';

/**
 * mocked plain domains, for use with the mockData option of useDomains
 * and useGetContentDomains in tests and compositions.
 */
export const domainsMock: PlainDomain[] = [
  {
    id: 'anxiety',
    slug: 'anxiety',
    name: 'חרדה',
    description: 'כלים מיידיים ומתמשכים להתמודדות עם חרדה והתקפי פאניקה.',
    icon: '😰',
    count: 5,
  },
  {
    id: 'sleep',
    slug: 'sleep',
    name: 'שינה',
    description: 'נדודי שינה, סיוטים וכלים להירדמות רגועה.',
    icon: '🌙',
    count: 4,
  },
  {
    id: 'emotional-regulation',
    slug: 'emotional-regulation',
    name: 'ויסות רגשי',
    description: 'כלים לזיהוי, ויסות והבנת רגשות עזים.',
    icon: '🌊',
    count: 4,
  },
];
