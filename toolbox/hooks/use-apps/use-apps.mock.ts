import { mockApps, mockApp } from '@helemclub/toolbox.entities.app';

/**
 * a list of plain toolbox apps, ported from the Helam Club marketplace
 * prototype seed catalog, useful for testing and previewing the useApps
 * hook without a live GraphQL server.
 */
export function mockAppsData() {
  return mockApps().map((app) => app.toObject());
}

/**
 * a list of plain pending toolbox apps awaiting moderation review, useful
 * for testing and previewing the moderation flows of the useApps hook.
 */
export function mockPendingAppsData() {
  return [
    mockApp({
      id: 'pending-app',
      slug: 'pending-app',
      name: 'כלי חדש בבדיקה',
      subtitle: 'אפליקציה שהוגשה ע״י חבר קהילה וממתינה לאישור',
      status: 'pending',
      isFeatured: false,
      clickCount: 0,
      helpfulYes: 0,
      helpfulNo: 0,
      avgRating: 0,
      ratingCount: 0,
      ratingHistogram: [0, 0, 0, 0, 0],
    }).toObject(),
  ];
}
