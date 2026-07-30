import { mockLabel as buildMockLabel, type PlainLabel } from '@helemclub/knowledge-base.entities.label';
import { mockMediaRecord, type MediaRecord } from '@helemclub/knowledge-base.entities.media-record';
import type { UseDomainsOptions } from '@helemclub/knowledge-domains.hooks.use-domains';

/**
 * the shape of a single mocked domain, derived from the useDomains hook mock data type.
 */
export type LabelLobbyMockDomain = NonNullable<UseDomainsOptions['mockData']>[number];

/**
 * a mock "עזרה ראשונה" (first-aid) label, for use in compositions and tests.
 */
export const mockFirstAidLabel: PlainLabel = buildMockLabel({
  id: `label-first-aid`,
  slug: `first-aid`,
  name: `עזרה ראשונה`,
  description: `כלים מיידיים לרגעי הצפה, חרדה ומשבר — זמינים בכל רגע.`,
  coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_calming_abstract_illustration__0_1785198117301.png`,
  recordCount: 3,
}).toObject();

/**
 * a list of mock media records belonging to the first-aid label, for use in compositions and tests.
 */
export const mockFirstAidRecords: MediaRecord[] = [
  mockMediaRecord({
    id: `record-grounding-flashbacks`,
    slug: `grounding-flashbacks`,
    labelId: `label-first-aid`,
    title: `קרקוע ברגע של פלאשבק`,
    description: `תרגיל מודרך קצר להחזרת תחושת הביטחון בזמן הצפה או פלאשבק.`,
    mediaType: `video`,
    mediaUrl: `https://example.com/media/grounding-flashbacks.mp4`,
    thumbnailUrl: `https://storage.googleapis.com/bit-generated-images/images/image_calming_therapeutic_scene_for__0_1785198472281.png`,
    durationSec: 504,
    domains: [`triggers`, `anxiety`],
    viewCount: 3240,
    publishedAt: `2026-03-01T09:00:00.000Z`,
  }),
  mockMediaRecord({
    id: `record-panic-breathing`,
    slug: `panic-breathing`,
    labelId: `label-first-aid`,
    title: `נשימה בזמן התקף חרדה`,
    description: `הקלטה קולית שמלווה אותך צעד-צעד דרך התקף חרדה.`,
    mediaType: `audio`,
    mediaUrl: `https://example.com/media/panic-breathing.mp3`,
    thumbnailUrl: `https://storage.googleapis.com/bit-generated-images/images/image_soft_illustration_for_a_breath_0_1785198470360.png`,
    durationSec: 662,
    domains: [`anxiety`, `mindfulness-breathing`],
    viewCount: 2115,
    publishedAt: `2026-02-18T09:00:00.000Z`,
  }),
  mockMediaRecord({
    id: `record-sleep-wind-down`,
    slug: `sleep-wind-down`,
    labelId: `label-first-aid`,
    title: `הרגעה לפני שינה`,
    description: `תרגול קצר להרגעת הגוף והנפש לקראת שינה, אחרי יום עמוס.`,
    mediaType: `audio`,
    mediaUrl: `https://example.com/media/sleep-wind-down.mp3`,
    thumbnailUrl: `https://storage.googleapis.com/bit-generated-images/images/image_peaceful_nighttime_illustratio_0_1785198469760.png`,
    durationSec: 780,
    domains: [`sleep`],
    viewCount: 1420,
    publishedAt: `2026-01-05T09:00:00.000Z`,
  }),
];

/**
 * mock domains covering the tags used by the first-aid mock records, for use with the domain filter.
 */
export const mockLabelLobbyDomains: LabelLobbyMockDomain[] = [
  {
    id: `anxiety`,
    slug: `anxiety`,
    name: `חרדה`,
    description: `כלים מיידיים ומתמשכים להתמודדות עם חרדה והתקפי פאניקה.`,
    icon: `😰`,
    count: 2,
  },
  {
    id: `triggers`,
    slug: `triggers`,
    name: `טריגרים`,
    description: `זיהוי טריגרים וכלים מיידיים להתמודדות עם הצפה ופלאשבקים.`,
    icon: `⚡`,
    count: 1,
  },
  {
    id: `mindfulness-breathing`,
    slug: `mindfulness-breathing`,
    name: `מיינדפולנס ונשימות`,
    description: `תרגילי נשימה, מדיטציה ומיינדפולנס להרגעת הגוף והנפש.`,
    icon: `🧘`,
    count: 1,
  },
  {
    id: `sleep`,
    slug: `sleep`,
    name: `שינה`,
    description: `נדודי שינה, סיוטים וכלים להירדמות רגועה.`,
    icon: `🌙`,
    count: 1,
  },
];
