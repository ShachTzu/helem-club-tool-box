import type { PlainUser } from '@helemclub/platform.entities.user';

/**
 * mock signed-in member, used in compositions and tests.
 */
export const mockProfileUser: PlainUser = {
  id: `user-204`,
  email: `noa.levi@example.com`,
  displayName: `נועה לוי`,
  avatarUrl: `https://storage.googleapis.com/bit-generated-images/images/image_professional_friendly_headshot_0_1785193864993.png`,
  role: `writer`,
  provider: `google`,
  createdAt: new Date(`2023-11-02T08:15:00.000Z`).toISOString(),
};

/**
 * mock signed-in member without an avatar image, used to preview the
 * initials fallback.
 */
export const mockProfileUserNoAvatar: PlainUser = {
  id: `user-311`,
  email: `dan.cohen@example.com`,
  displayName: `דן כהן`,
  avatarUrl: undefined,
  role: `member`,
  provider: `email`,
  createdAt: new Date(`2024-04-18T12:00:00.000Z`).toISOString(),
};
