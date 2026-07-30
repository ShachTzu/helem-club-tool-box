import { v4 as uuidv4 } from 'uuid';
import { AppReview, type PlainAppReview } from './app-review.js';

/**
 * creates a mock AppReview, allowing partial
 * overrides of the default properties.
 */
export function mockAppReview(overrides: Partial<PlainAppReview> = {}): AppReview {
  return AppReview.from({
    id: uuidv4(),
    appId: 'ground-me',
    stars: 5,
    comment:
      'הכלי הזה ליווה אותי ברגעים הכי קשים. תרגיל 5-4-3-2-1 זמין מיד וזה עשה הבדל אמיתי בפלאשבקים.',
    displayName: 'אנונימי',
    helpfulCount: 47,
    createdAt: new Date('2024-01-15T09:30:00.000Z').toISOString(),
    ...overrides,
  });
}

/**
 * creates a list of mock AppReview entities, ordered by helpfulness.
 */
export function mockAppReviews(): AppReview[] {
  return [
    mockAppReview({
      id: uuidv4(),
      appId: 'ground-me',
      stars: 5,
      comment: 'הכלי הזה ליווה אותי ברגעים הכי קשים. תרגיל 5-4-3-2-1 זמין מיד וזה עשה הבדל אמיתי בפלאשבקים.',
      displayName: 'אנונימי',
      helpfulCount: 47,
      createdAt: new Date('2024-01-15T09:30:00.000Z').toISOString(),
    }),
    mockAppReview({
      id: uuidv4(),
      appId: 'ground-me',
      stars: 5,
      comment: 'עיצוב רגוע, בלי גירויים מיותרים. מרגיש שבנו את זה אנשים שמבינים מבפנים.',
      displayName: 'א.',
      helpfulCount: 31,
      createdAt: new Date('2024-01-20T14:10:00.000Z').toISOString(),
    }),
    mockAppReview({
      id: uuidv4(),
      appId: 'ground-me',
      stars: 4,
      comment: 'עוזר מאוד. הייתי שמח לעוד תרגילים בעברית, אבל גם ככה מצוין.',
      displayName: undefined,
      helpfulCount: 12,
      createdAt: new Date('2024-02-02T18:45:00.000Z').toISOString(),
    }),
  ];
}
