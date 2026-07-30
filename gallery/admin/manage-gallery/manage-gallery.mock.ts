import type { DomainOption } from '@helemclub/knowledge-domains.ui.domain-selector';
import type { GalleryItemRecord } from './gallery-item-record-type.js';
import type { AdminUserRecord } from './admin-user-record-type.js';

/**
 * mock coping-domains used to preview and test the domain selector without
 * a network request.
 */
export const mockManageGalleryDomains: DomainOption[] = [
  { id: `anxiety`, slug: `anxiety`, name: `חרדה`, icon: `😰`, count: 5 },
  { id: `emotional-regulation`, slug: `emotional-regulation`, name: `ויסות רגשי`, icon: `🌊`, count: 4 },
  { id: `sleep`, slug: `sleep`, name: `שינה`, icon: `🌙`, count: 3 },
  { id: `mindfulness-breathing`, slug: `mindfulness-breathing`, name: `מיינדפולנס ונשימות`, icon: `🧘`, count: 5 },
  { id: `depression`, slug: `depression`, name: `דיכאון ותחושת תקיעות`, icon: `🌧️`, count: 2 },
];

/**
 * mock gallery items used to preview and test the admin table without a
 * network request.
 */
export const mockManageGalleryItems: GalleryItemRecord[] = [
  {
    id: `1`,
    slug: `quiet-after-the-storm`,
    title: `שקט אחרי הסערה`,
    description: `יצירה שמבטאת את הרוגע שמגיע אחרי גל של הצפה רגשית.`,
    mediaType: `image`,
    mediaUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_painting_symboli_0_1785194399039.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_painting_symboli_0_1785194399039.png',
    artistName: `נועה ל.`,
    domains: [`emotional-regulation`],
    createdAt: `2026-01-12T09:00:00.000Z`,
  },
  {
    id: `2`,
    slug: `light-at-the-edge`,
    title: `אור בקצה`,
    description: `ציור המבטא תקווה והחלמה מתוך תקופה חשוכה.`,
    mediaType: `image`,
    mediaUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_painting_symboli_0_1785194399039.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_painting_symboli_0_1785194399039.png',
    artistName: `אנונימי`,
    domains: [`depression`],
    createdAt: `2026-02-03T09:00:00.000Z`,
  },
  {
    id: `3`,
    slug: `breathe-and-begin`,
    title: `נשימה והתחלה`,
    description: `סרטון קצר של תרגיל נשימה מודרך בזריחה.`,
    mediaType: `video`,
    mediaUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_painting_symboli_0_1785194399039.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_painting_symboli_0_1785194399039.png',
    artistName: `דנה כ.`,
    domains: [`mindfulness-breathing`, `anxiety`],
    createdAt: `2026-03-01T09:00:00.000Z`,
  },
];

/**
 * mock admin user used to bypass the auth check when previewing or testing
 * the protected admin panel.
 */
export const mockManageGalleryAdmin: AdminUserRecord = {
  id: `admin-1`,
  email: `admin@helemclub.org`,
  displayName: `הלם אדמין`,
  role: `admin`,
  provider: `google`,
  createdAt: `2024-01-15T09:30:00.000Z`,
};

/**
 * mock signed-in member (insufficient role) used to test the access-denied path.
 */
export const mockManageGalleryMember: AdminUserRecord = {
  id: `member-1`,
  email: `sam.doe@example.com`,
  displayName: `סם דו`,
  role: `member`,
  provider: `email`,
  createdAt: `2024-01-15T09:30:00.000Z`,
};
