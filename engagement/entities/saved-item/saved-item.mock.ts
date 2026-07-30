import { v4 as uuid } from 'uuid';
import { SavedItem, type PlainSavedItem } from './saved-item.js';

/**
 * create a single mock SavedItem, with optional overrides.
 */
export function mockSavedItem(overrides: Partial<PlainSavedItem> = {}): SavedItem {
  return SavedItem.from({
    id: uuid(),
    targetType: 'app',
    targetId: 'calm-space',
    deviceId: 'device-1234',
    savedAt: new Date('2024-05-01T09:00:00.000Z').toISOString(),
    title: 'Calm Space — כלי להרגעה מיידית',
    url: '/toolbox/calm-space',
    imageUrl: 'https://example.com/calm-space-icon.png',
    ...overrides,
  });
}

/**
 * create a list of mock SavedItem entities for rendering a saved list.
 */
export function mockSavedItems(): SavedItem[] {
  return [
    mockSavedItem(),
    mockSavedItem({
      id: uuid(),
      targetType: 'article',
      targetId: 'article-42',
      title: 'איך לזהות טריגרים לפני שהם משתלטים',
      url: '/blog/article-42',
      imageUrl: 'https://example.com/article-42-cover.png',
      savedAt: new Date('2024-05-03T15:30:00.000Z').toISOString(),
    }),
    mockSavedItem({
      id: uuid(),
      targetType: 'event',
      targetId: 'event-7',
      title: 'מפגש קהילתי חודשי — יולי',
      url: '/events/event-7',
      imageUrl: undefined,
      savedAt: new Date('2024-05-10T18:00:00.000Z').toISOString(),
    }),
  ];
}
