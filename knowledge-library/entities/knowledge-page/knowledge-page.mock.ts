import type { PlainKnowledgePage } from './knowledge-page.js';
import { HELEM_CLUB_AUTHOR_NAME } from './knowledge-page.js';

/**
 * create a single mock knowledge-library page, supporting partial override.
 */
export function mockKnowledgePage(overrides: Partial<PlainKnowledgePage> = {}): PlainKnowledgePage {
  return {
    id: 'kp-grounding',
    slug: 'grounding-flashbacks',
    title: 'קרקוע ברגע של פלאשבק',
    body: 'תרגיל מודרך קצר להחזרת תחושת הביטחון בזמן הצפה או פלאשבק.',
    parentId: null,
    ancestorIds: [],
    domains: ['טריגרים', 'חרדה', 'ויסות רגשי'],
    mediaType: 'video',
    durationSec: 504,
    viewCount: 3240,
    publishDate: '2026-03-01T09:00:00.000Z',
    authorName: HELEM_CLUB_AUTHOR_NAME,
    isStaffAuthor: true,
    isPublished: true,
    createdAt: '2026-03-01T09:00:00.000Z',
    updatedAt: '2026-03-01T09:00:00.000Z',
    ...overrides,
  };
}

/**
 * a small list of mock pages for development, previews and the cross-content
 * wisdom feed. mirrors the shape real library content takes: a mix of written
 * chapters and recorded video/audio.
 */
export function mockKnowledgePages(): PlainKnowledgePage[] {
  return [
    mockKnowledgePage(),
    mockKnowledgePage({
      id: 'kp-panic-breathing',
      slug: 'panic-breathing',
      title: 'נשימה בזמן התקף חרדה',
      body: 'הקלטה קולית שמלווה אותך צעד-צעד דרך התקף חרדה.',
      domains: ['חרדה', 'מיינדפולנס ונשימות'],
      mediaType: 'audio',
      durationSec: 662,
      viewCount: 2115,
      publishDate: '2026-02-18T09:00:00.000Z',
    }),
    mockKnowledgePage({
      id: 'kp-recognizing-ptsd',
      slug: 'recognizing-ptsd',
      title: 'לזהות פוסט-טראומה — מה קורה בגוף ובנפש',
      body: 'הרצאה מקצועית בגובה העיניים על תסמיני פוסט-טראומה וההתמודדות איתם.',
      domains: ['טריגרים', 'ויסות רגשי'],
      mediaType: 'video',
      durationSec: 2745,
      viewCount: 1420,
      publishDate: '2026-02-05T09:00:00.000Z',
    }),
  ];
}
