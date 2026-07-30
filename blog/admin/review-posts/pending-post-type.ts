import type { UseListPendingPostsOptions } from '@helemclub/blog.hooks.use-posts';

/**
 * a single pending post accepted as mock data for the review queue,
 * bypassing the GraphQL query used to list posts awaiting moderation.
 */
export type PendingPostMock = NonNullable<UseListPendingPostsOptions['mockData']>[number];
