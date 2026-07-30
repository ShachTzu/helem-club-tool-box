import { prop, index } from '@typegoose/typegoose';

@index({ title: 'text', description: 'text' })
export class GalleryItemModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ unique: true, required: true, type: String })
  public slug: string;

  @prop({ required: true, type: String })
  public title: string;

  @prop({ type: String })
  public description?: string;

  @prop({ type: String })
  public mediaType?: string;

  @prop({ required: true, type: String })
  public mediaUrl: string;

  @prop({ type: String })
  public thumbnailUrl?: string;

  @prop({ type: String })
  public artistName?: string;

  @prop({ type: [String], default: [] })
  public domains?: string[];

  @prop({ type: Date, default: Date.now })
  public createdAt?: Date;
}

export const GALLERY_ITEM_MOCKS = [
  {
    id: '1',
    slug: 'quiet-after-the-storm',
    title: 'שקט אחרי הסערה',
    description: 'יצירה שמבטאת את הרוגע שמגיע אחרי גל של הצפה רגשית.',
    mediaType: 'image',
    mediaUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_art_piece_symbol_0_1785184760565.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_art_piece_symbol_0_1785184760565.png',
    artistName: 'נועה ל.',
    domains: ['ויסות רגשי'],
    createdAt: new Date('2026-01-12T09:00:00.000Z'),
  },
  {
    id: '2',
    slug: 'light-at-the-edge',
    title: 'אור בקצה',
    description: 'ציור המבטא תקווה והחלמה מתוך תקופה חשוכה.',
    mediaType: 'image',
    mediaUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_serene_illustration_of_light_b_0_1785184760843.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_serene_illustration_of_light_b_0_1785184760843.png',
    artistName: 'אנונימי',
    domains: ['דיכאון ותחושת תקיעות'],
    createdAt: new Date('2026-02-03T09:00:00.000Z'),
  },
  {
    id: '3',
    slug: 'breathe-and-begin',
    title: 'נשימה והתחלה',
    description: 'סרטון קצר של תרגיל נשימה מודרך בזריחה.',
    mediaType: 'video',
    mediaUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_thumbnail_frame_for_a_short_mi_0_1785184760493.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_thumbnail_frame_for_a_short_mi_0_1785184760493.png',
    artistName: 'דנה כ.',
    domains: ['מיינדפולנס ונשימות', 'חרדה'],
    createdAt: new Date('2026-03-01T09:00:00.000Z'),
  },
];
