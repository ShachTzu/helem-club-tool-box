import { prop, index } from '@typegoose/typegoose';

/**
 * typegoose model for a knowledge-base label — the KB's own projects /
 * collections used to group media records (distinct from coping domains).
 */
@index({ slug: 1 }, { unique: true })
export class LabelModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public slug: string;

  @prop({ required: true, type: String })
  public name: string;

  @prop({ type: String })
  public description?: string;

  @prop({ type: String })
  public coverImage?: string;
}

/**
 * the 5 seed labels ("projects") of the Helem Club knowledge base, mirroring
 * the label entity mocks.
 */
export const LABEL_MOCKS: LabelModel[] = [
  {
    id: 'label-first-aid',
    slug: 'first-aid',
    name: 'עזרה ראשונה',
    description: 'כלים מיידיים לרגעי הצפה, חרדה ומשבר — זמינים בכל רגע.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_a_calming_abstract_illustratio_0_1785184760332.png',
  },
  {
    id: 'label-after',
    slug: 'after',
    name: 'אפטר',
    description: 'סדרת שיחות על החיים שאחרי — התמודדות, צמיחה והחלמה.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_a_serene_sunrise_over_calm_wat_0_1785184760306.png',
  },
  {
    id: 'label-recognition',
    slug: 'recognition',
    name: 'הכרה',
    description: 'הבנה והכרה של תסמיני פוסט-טראומה — ידע מקצועי בגובה העיניים.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_an_abstract_illustration_of_a__0_1785184760710.png',
  },
  {
    id: 'label-talking-therapy',
    slug: 'talking-therapy',
    name: 'מדברים טיפול',
    description: 'סדרה על עולם הטיפול — גישות, כלים ומה שכדאי לדעת לפני שמתחילים.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_two_abstract_chairs_facing_eac_0_1785184760363.png',
  },
  {
    id: 'label-adequate-response',
    slug: 'adequate-response',
    name: 'מענה הולם',
    description: 'מיצוי זכויות, מול המערכת, ומענה מותאם למתמודדים ובני משפחה.',
    coverImage:
      'https://storage.googleapis.com/bit-generated-images/images/image_an_abstract_illustration_of_a__0_1785184760515.png',
  },
];
