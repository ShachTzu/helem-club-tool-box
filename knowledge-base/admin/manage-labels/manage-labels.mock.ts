import type { ManageLabelsLabel } from './manage-labels-label-type.js';

/**
 * mock labels used in compositions and tests for the manage-labels admin panel.
 */
export const mockManageLabelsLabels: ManageLabelsLabel[] = [
  {
    id: `label-first-aid`,
    slug: `first-aid`,
    name: `עזרה ראשונה`,
    description: `כלים מיידיים לרגעי הצפה, חרדה ומשבר — זמינים בכל רגע.`,
    coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_calming_abstract_illustratio_0_1785194345564.png`,
    recordCount: 12,
  },
  {
    id: `label-after`,
    slug: `after`,
    name: `אפטר`,
    description: `סדרת שיחות על החיים שאחרי — התמודדות, צמיחה והחלמה.`,
    coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_serene_sunrise_over_calm_sti_0_1785194341300.png`,
    recordCount: 18,
  },
  {
    id: `label-recognition`,
    slug: `recognition`,
    name: `הכרה`,
    description: `הבנה והכרה של תסמיני פוסט-טראומה — ידע מקצועי בגובה העיניים.`,
    recordCount: 9,
  },
];
