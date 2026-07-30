import { Label } from './label.js';
import type { PlainLabel } from './label.js';

/**
 * the 5 seed labels ("projects") of the Helem Club knowledge base.
 */
const SEED_LABELS: PlainLabel[] = [
  {
    id: 'label-first-aid',
    slug: 'first-aid',
    name: 'עזרה ראשונה',
    description: 'כלים מיידיים לרגעי הצפה, חרדה ומשבר — זמינים בכל רגע.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_a_calming_abstract_illustratio_0_1785184760332.png',
    recordCount: 12,
  },
  {
    id: 'label-after',
    slug: 'after',
    name: 'אפטר',
    description: 'סדרת שיחות על החיים שאחרי — התמודדות, צמיחה והחלמה.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_a_serene_sunrise_over_calm_wat_0_1785184760306.png',
    recordCount: 18,
  },
  {
    id: 'label-recognition',
    slug: 'recognition',
    name: 'הכרה',
    description: 'הבנה והכרה של תסמיני פוסט-טראומה — ידע מקצועי בגובה העיניים.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_an_abstract_illustration_of_a__0_1785184760710.png',
    recordCount: 9,
  },
  {
    id: 'label-talking-therapy',
    slug: 'talking-therapy',
    name: 'מדברים טיפול',
    description: 'סדרה על עולם הטיפול — גישות, כלים ומה שכדאי לדעת לפני שמתחילים.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_two_abstract_chairs_facing_eac_0_1785184760363.png',
    recordCount: 15,
  },
  {
    id: 'label-adequate-response',
    slug: 'adequate-response',
    name: 'מענה הולם',
    description: 'מיצוי זכויות, מול המערכת, ומענה מותאם למתמודדים ובני משפחה.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_an_abstract_illustration_of_a__0_1785184760515.png',
    recordCount: 11,
  },
];

/**
 * returns the 5 seed labels ("projects") used across the knowledge base,
 * supporting a partial override of properties for a specific label by slug/index.
 */
export function mockLabels(overrides: Partial<PlainLabel>[] = []): Label[] {
  return SEED_LABELS.map((seed, index) =>
    Label.from({
      ...seed,
      ...(overrides[index] || {}),
    })
  );
}

/**
 * returns a single mock Label, optionally overriding any of its properties.
 */
export function mockLabel(overrides: Partial<PlainLabel> = {}): Label {
  return Label.from({
    ...SEED_LABELS[0],
    ...overrides,
  });
}
