import type { PlainUser } from '@helemclub/platform.entities.user';

/**
 * a mock list of platform users covering the full role hierarchy and every
 * membership status — including signups awaiting approval — used for
 * compositions and tests.
 */
export const MOCK_PLATFORM_USERS: PlainUser[] = [
  {
    id: `user-1`,
    email: `sam.doe@example.com`,
    displayName: `Sam Doe`,
    role: `member`,
    provider: `email`,
    createdAt: `2023-01-12T09:30:00.000Z`,
    membershipStatus: `approved`,
  },
  {
    id: `user-2`,
    email: `noa.writer@example.com`,
    displayName: `נועה כותבת`,
    role: `writer`,
    provider: `google`,
    avatarUrl: `https://i.pravatar.cc/150?u=noa.writer@example.com`,
    createdAt: `2023-05-03T09:30:00.000Z`,
    membershipStatus: `approved`,
  },
  {
    id: `user-3`,
    email: `dan.mod@example.com`,
    displayName: `דן מודרטור`,
    role: `moderator`,
    provider: `email`,
    createdAt: `2023-09-21T09:30:00.000Z`,
    membershipStatus: `approved`,
  },
  {
    id: `user-4`,
    email: `admin@helemclub.org`,
    displayName: `הלם אדמין`,
    role: `admin`,
    provider: `google`,
    avatarUrl: `https://i.pravatar.cc/150?u=admin@helemclub.org`,
    createdAt: `2022-11-14T09:30:00.000Z`,
    membershipStatus: `approved`,
  },
  {
    id: `user-5`,
    email: `shira.azoulay@example.com`,
    displayName: `שירה אזולאי`,
    role: `member`,
    provider: `email`,
    createdAt: `2024-02-02T09:30:00.000Z`,
    membershipStatus: `pending`,
  },
  {
    id: `user-6`,
    email: `yuval.peretz@example.com`,
    displayName: `יובל פרץ`,
    role: `writer`,
    provider: `email`,
    createdAt: `2024-04-18T09:30:00.000Z`,
    membershipStatus: `pending`,
  },
  {
    id: `user-7`,
    email: `omer.spam@example.com`,
    displayName: `עומר נדח`,
    role: `member`,
    provider: `email`,
    createdAt: `2024-06-01T09:30:00.000Z`,
    membershipStatus: `rejected`,
  },
];
