import { prop, index } from '@typegoose/typegoose';

/**
 * typegoose model for a knowledge-base media record — an externally hosted
 * video or audio item, grouped under a label (project) and tagged with
 * cross-cutting coping domains.
 */
@index({ title: 'text', description: 'text' })
@index({ slug: 1 }, { unique: true })
@index({ labelId: 1 })
export class MediaRecordModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public slug: string;

  @prop({ required: true, type: String })
  public labelId: string;

  @prop({ required: true, type: String })
  public title: string;

  @prop({ type: String })
  public description?: string;

  @prop({ required: true, type: String, default: 'video' })
  public mediaType: string;

  @prop({ required: true, type: String })
  public mediaUrl: string;

  @prop({ type: String })
  public thumbnailUrl?: string;

  @prop({ type: Number })
  public durationSec?: number;

  @prop({ type: [String], default: [] })
  public domains?: string[];

  @prop({ type: Number, default: 0 })
  public viewCount?: number;

  @prop({ required: true, type: String })
  public publishedAt: string;
}

/**
 * seed records for the knowledge base, mirroring the media-record entity mocks
 * and tied to the seeded label ids.
 */
export const MEDIA_RECORD_MOCKS: MediaRecordModel[] = [
  {
    id: 'rec-grounding-flashbacks',
    slug: 'grounding-flashbacks',
    labelId: 'label-first-aid',
    title: 'קרקוע ברגע של פלאשבק',
    description: 'תרגיל מודרך קצר להחזרת תחושת הביטחון בזמן הצפה או פלאשבק.',
    mediaType: 'video',
    mediaUrl: 'https://example.com/media/grounding-flashbacks.mp4',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm__soothing_therapeutic_vid_0_1785194430013.png',
    durationSec: 504,
    domains: ['טריגרים', 'חרדה', 'ויסות רגשי'],
    viewCount: 3240,
    publishedAt: '2026-03-01T09:00:00.000Z',
  },
  {
    id: 'rec-panic-breathing',
    slug: 'panic-breathing',
    labelId: 'label-first-aid',
    title: 'נשימה בזמן התקף חרדה',
    description: 'הקלטה קולית שמלווה אותך צעד-צעד דרך התקף חרדה.',
    mediaType: 'audio',
    mediaUrl: 'https://example.com/media/panic-breathing.mp3',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm_podcast_audio_cover_art___0_1785194429395.png',
    durationSec: 662,
    domains: ['חרדה', 'מיינדפולנס ונשימות'],
    viewCount: 2115,
    publishedAt: '2026-02-18T09:00:00.000Z',
  },
  {
    id: 'rec-life-after-panel',
    slug: 'life-after-panel',
    labelId: 'label-after',
    title: 'החיים שאחרי — שולחן עגול',
    description: 'שיחה כנה של ארבעה מתמודדים על השגרה, הזוגיות והתקווה שאחרי.',
    mediaType: 'video',
    mediaUrl: 'https://example.com/media/life-after-panel.mp4',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_warm_supportive_group_conversa_0_1785194430053.png',
    durationSec: 3130,
    domains: ['משפחה, זוגיות ויחסים', 'דיכאון ותחושת תקיעות'],
    viewCount: 1870,
    publishedAt: '2026-01-22T09:00:00.000Z',
  },
  {
    id: 'rec-recognizing-ptsd',
    slug: 'recognizing-ptsd',
    labelId: 'label-recognition',
    title: 'לזהות פוסט-טראומה — מה קורה בגוף ובנפש',
    description: 'הרצאה מקצועית בגובה העיניים על תסמיני פוסט-טראומה וההתמודדות איתם.',
    mediaType: 'video',
    mediaUrl: 'https://example.com/media/recognizing-ptsd.mp4',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_an_abstract_illustration_of_a__0_1785184760710.png',
    durationSec: 2745,
    domains: ['טריגרים', 'ויסות רגשי'],
    viewCount: 1420,
    publishedAt: '2026-02-05T09:00:00.000Z',
  },
  {
    id: 'rec-before-therapy',
    slug: 'before-therapy',
    labelId: 'label-talking-therapy',
    title: 'מה כדאי לדעת לפני שמתחילים טיפול',
    description: 'שיחה על גישות טיפוליות, ציפיות, ואיך בוחרים מטפל שמתאים לך.',
    mediaType: 'audio',
    mediaUrl: 'https://example.com/media/before-therapy.mp3',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_two_abstract_chairs_facing_eac_0_1785184760363.png',
    durationSec: 1980,
    domains: ['דיכאון ותחושת תקיעות', 'משפחה, זוגיות ויחסים'],
    viewCount: 980,
    publishedAt: '2026-01-30T09:00:00.000Z',
  },
];
