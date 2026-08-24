import type { UseDraftsOptions } from '@helemclub/editorial.hooks.use-drafts';

/**
 * shape of a single mock draft accepted by the `useDrafts` hook, reused here
 * so the dashboard can inject mock "pending review" drafts for tests and
 * previews without depending on the drafts entity package directly.
 */
export type EditorialDashboardMockDraft = NonNullable<UseDraftsOptions['mockData']>[number];
