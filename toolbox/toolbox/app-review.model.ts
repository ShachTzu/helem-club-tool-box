import { prop, index } from '@typegoose/typegoose';

/**
 * a typegoose model backing a single star rating / review left for a toolbox
 * app. mirrors the PlainAppReview shape consumed by the use-app-reviews hook.
 */
@index({ appId: 1 })
export class AppReviewModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public appId: string;

  @prop({ required: true, type: Number })
  public stars: number;

  @prop({ type: String, default: '' })
  public comment: string;

  @prop({ type: String, default: 'אנונימי' })
  public displayName: string;

  @prop({ type: Number, default: 0 })
  public helpfulCount: number;

  @prop({ type: String, default: '' })
  public userId: string;

  @prop({ type: Date, default: Date.now })
  public createdAt: Date;
}

/**
 * sample reviews for the app detail page, ordered by helpfulness, ported from
 * the Helam Club marketplace prototype.
 */
export const APP_REVIEW_MOCKS = [
  {
    id: 'r1',
    appId: 'ground-me',
    stars: 5,
    comment:
      'הכלי הזה ליווה אותי ברגעים הכי קשים. תרגיל 5-4-3-2-1 זמין מיד וזה עשה הבדל אמיתי בפלאשבקים.',
    displayName: 'אנונימי',
    helpfulCount: 47,
    userId: 'user-1',
    createdAt: new Date('2024-02-22T09:00:00.000Z'),
  },
  {
    id: 'r2',
    appId: 'ground-me',
    stars: 5,
    comment: 'עיצוב רגוע, בלי גירויים מיותרים. מרגיש שבנו את זה אנשים שמבינים מבפנים.',
    displayName: 'א.',
    helpfulCount: 31,
    userId: 'user-2',
    createdAt: new Date('2024-02-24T09:00:00.000Z'),
  },
  {
    id: 'r3',
    appId: 'ground-me',
    stars: 4,
    comment: 'עוזר מאוד. הייתי שמח לעוד תרגילים בעברית, אבל גם ככה מצוין.',
    displayName: 'אנונימי',
    helpfulCount: 12,
    userId: 'user-3',
    createdAt: new Date('2024-02-26T09:00:00.000Z'),
  },
];
