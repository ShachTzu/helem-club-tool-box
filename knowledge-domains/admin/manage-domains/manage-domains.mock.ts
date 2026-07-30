import type { DomainRecord } from './domain-record-type.js';

/**
 * mocked domain records, for use with the `mockDomains` prop of
 * ManageDomains in tests and compositions.
 */
export const domainRecordsMock: DomainRecord[] = [
  {
    id: `anxiety`,
    slug: `anxiety`,
    name: `חרדה`,
    description: `כלים מיידיים ומתמשכים להתמודדות עם חרדה והתקפי פאניקה.`,
    icon: `😰`,
    count: 5,
  },
  {
    id: `sleep`,
    slug: `sleep`,
    name: `שינה`,
    description: `נדודי שינה, סיוטים וכלים להירדמות רגועה.`,
    icon: `🌙`,
    count: 4,
  },
  {
    id: `emotional-regulation`,
    slug: `emotional-regulation`,
    name: `ויסות רגשי`,
    description: `כלים לזיהוי, ויסות והבנת רגשות עזים.`,
    icon: `🌊`,
    count: 4,
  },
  {
    id: `triggers`,
    slug: `triggers`,
    name: `טריגרים`,
    description: `זיהוי טריגרים וכלים מיידיים להתמודדות עם הצפה ופלאשבקים.`,
    icon: `⚡`,
    count: 0,
  },
];

/**
 * mocked admin user, for use with the `mockUser` prop of ManageDomains
 * in tests and compositions.
 */
export const adminUserMock = {
  id: `user-1`,
  email: `admin@helam.club`,
  displayName: `מנהלת הקהילה`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: `2024-01-01T00:00:00.000Z`,
};
