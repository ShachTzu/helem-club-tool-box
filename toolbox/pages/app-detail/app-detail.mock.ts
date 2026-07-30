import { mockApp } from '@helemclub/toolbox.entities.app';
import { mockAppReviews } from '@helemclub/toolbox.entities.app-review';
import type { AppDetailDomain } from './app-detail-domain-type.js';

/**
 * default coping-domain tags shown on the app detail page, matching the
 * default mock app from the toolbox app entity.
 */
export const DEFAULT_APP_DETAIL_DOMAINS: AppDetailDomain[] = [
  { id: `mindfulness-breathing`, slug: `mindfulness-breathing`, name: `מיינדפולנס ונשימות` },
  { id: `anxiety`, slug: `anxiety`, name: `חרדה` },
  { id: `sleep`, slug: `sleep`, name: `שינה` },
];

/**
 * a plain toolbox app used as the default mock for the app detail page,
 * ported from the Helam Club marketplace prototype seed catalog.
 */
export function mockAppDetailData() {
  return mockApp().toObject();
}

/**
 * a plain toolbox app with community credits and reviews, matching the
 * "ground-me" prototype seed app.
 */
export function mockGroundMeAppData() {
  return mockApp({
    id: `ground-me`,
    slug: `ground-me`,
    name: `קרקוע`,
    subtitle: `כלים להתמודדות עם טריגרים ופלאשבקים`,
    fullDescription:
      `ערכת כלי קרקוע (grounding) זמינים בלחיצה אחת ברגע של הצפה או פלאשבק — תרגילי 5-4-3-2-1, אובייקטים מרגיעים, ואנשי קשר לשעת חירום. עוצבה יחד עם מתמודדי פוסט-טראומה.`,
    externalLink: `https://example.com/ground`,
    icon: `🪨`,
    screenshots: [
      `https://images.unsplash.com/photo-1476611317561-60117649dd94?auto=format&fit=crop&w=900&q=80`,
      `https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=80`,
    ],
    costType: `חינם לחברי הקהילה`,
    platform: [`iOS`, `Android`],
    requiresSignup: false,
    clickCount: 1520,
    helpfulYes: 402,
    helpfulNo: 19,
    isFeatured: true,
    developerName: `מיכל ברק`,
    originatorName: `שרה דוד`,
    domains: [`טריגרים`, `ויסות רגשי`, `חרדה`],
    avgRating: 4.9,
    ratingCount: 143,
    ratingHistogram: [1, 1, 4, 15, 122],
  }).toObject();
}

/**
 * sample reviews for the "ground-me" app, ordered by helpfulness.
 */
export function mockAppDetailReviewsData() {
  return mockAppReviews().map((review) => review.toObject());
}
