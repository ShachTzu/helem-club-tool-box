import { v4 as uuid } from 'uuid';
import { GalleryItem, type PlainGalleryItem } from './gallery-item.js';

/**
 * create a mock GalleryItem, supporting partial overrides
 * of any of its plain properties.
 */
export function mockGalleryItem(overrides: Partial<PlainGalleryItem> = {}): GalleryItem {
  const id = overrides.id ?? uuid();

  return GalleryItem.from({
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
    createdAt: '2026-01-12T09:00:00.000Z',
    ...overrides,
    id,
  });
}

/**
 * create a list of mock GalleryItems for development
 * and testing purposes.
 */
export function mockGalleryItems(): GalleryItem[] {
  return [
    mockGalleryItem(),
    mockGalleryItem({
      id: uuid(),
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
      createdAt: '2026-02-03T09:00:00.000Z',
    }),
    mockGalleryItem({
      id: uuid(),
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
      createdAt: '2026-03-01T09:00:00.000Z',
    }),
  ];
}
