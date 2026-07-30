import type { UseSavedOptions } from '@helemclub/engagement.hooks.use-saved';

/**
 * shape of a single mock saved item, matching the structure the useSaved
 * hook expects for its `mockSavedItems` option.
 */
export type MockSavedItem = NonNullable<UseSavedOptions['mockSavedItems']>[number];

/**
 * creates a single mock saved item, with optional overrides. useful for
 * compositions and tests that need to render the saved page with content.
 */
export function createMockSavedItem(overrides: Partial<Omit<MockSavedItem, 'toObject'>> = {}): MockSavedItem {
  const data = {
    id: `app:calm-space`,
    targetType: `app` as MockSavedItem['targetType'],
    targetId: `calm-space`,
    deviceId: `device-preview`,
    savedAt: new Date(`2024-05-01T09:00:00.000Z`).toISOString(),
    title: `Calm Space — כלי להרגעה מיידית`,
    url: `/toolbox/calm-space`,
    imageUrl: undefined as string | undefined,
    ...overrides,
  };

  return {
    ...data,
    toObject: () => ({ ...data }),
  };
}

/**
 * creates a small, realistic list of mock saved items spanning a few
 * content types (app, article, event), for rendering the saved page.
 */
export function mockSavedItems(): MockSavedItem[] {
  return [
    createMockSavedItem({
      id: `event:event-7`,
      targetType: `event`,
      targetId: `event-7`,
      title: `מפגש קהילתי חודשי — יולי`,
      url: `/events/event-7`,
      imageUrl: undefined,
      savedAt: new Date(`2024-05-10T18:00:00.000Z`).toISOString(),
    }),
    createMockSavedItem({
      id: `article:article-42`,
      targetType: `article`,
      targetId: `article-42`,
      title: `איך לזהות טריגרים לפני שהם משתלטים`,
      url: `/blog/article-42`,
      imageUrl: `https://images.helam.club/saved/article-42-cover.jpg`,
      savedAt: new Date(`2024-05-03T15:30:00.000Z`).toISOString(),
    }),
    createMockSavedItem({
      id: `app:calm-space`,
      title: `Calm Space — כלי להרגעה מיידית`,
      imageUrl: `https://images.helam.club/saved/calm-space-icon.jpg`,
      savedAt: new Date(`2024-05-01T09:00:00.000Z`).toISOString(),
    }),
  ];
}
