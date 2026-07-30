import { v4 } from 'uuid';
import { MediaRecord, type PlainMediaRecord } from './media-record.js';

/**
 * create a single mock MediaRecord, supporting partial override of properties.
 */
export function mockMediaRecord(overrides: Partial<PlainMediaRecord> = {}): MediaRecord {
  return MediaRecord.from({
    id: v4(),
    slug: 'grounding-flashbacks',
    labelId: 'first-aid',
    title: 'קרקוע ברגע של פלאשבק',
    description: 'תרגיל מודרך קצר להחזרת תחושת הביטחון בזמן הצפה או פלאשבק.',
    mediaType: 'video',
    mediaUrl: 'https://example.com/media/grounding-flashbacks.mp4',
    thumbnailUrl:
      'https://images.unsplash.com/photo-1476611317561-60117649dd94?auto=format&fit=crop&w=900&q=80',
    durationSec: 504,
    domains: ['טריגרים', 'חרדה', 'ויסות רגשי'],
    viewCount: 3240,
    publishedAt: '2026-03-01T09:00:00.000Z',
    ...overrides,
  });
}

/**
 * create a list of mock MediaRecords for development and testing purposes.
 */
export function mockMediaRecords(): MediaRecord[] {
  return [
    mockMediaRecord(),
    mockMediaRecord({
      id: v4(),
      slug: 'panic-breathing',
      labelId: 'first-aid',
      title: 'נשימה בזמן התקף חרדה',
      description: 'הקלטה קולית שמלווה אותך צעד-צעד דרך התקף חרדה.',
      mediaType: 'audio',
      mediaUrl: 'https://example.com/media/panic-breathing.mp3',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=900&q=80',
      durationSec: 662,
      domains: ['חרדה', 'מיינדפולנס ונשימות'],
      viewCount: 2115,
      publishedAt: '2026-02-18T09:00:00.000Z',
    }),
    mockMediaRecord({
      id: v4(),
      slug: 'life-after-panel',
      labelId: 'after',
      title: 'החיים שאחרי — שולחן עגול',
      description: 'שיחה כנה של ארבעה מתמודדים על השגרה, הזוגיות והתקווה שאחרי.',
      mediaType: 'video',
      mediaUrl: 'https://example.com/media/life-after-panel.mp4',
      thumbnailUrl:
        'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&w=900&q=80',
      durationSec: 3130,
      domains: ['משפחה, זוגיות ויחסים', 'דיכאון ותחושת תקיעות'],
      viewCount: 1870,
      publishedAt: '2026-01-22T09:00:00.000Z',
    }),
  ];
}
