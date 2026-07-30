import type { UseLabelsOptions } from '@helemclub/knowledge-base.hooks.use-labels';

/**
 * a single plain label ("project"), matching the mock data shape accepted
 * by the `useLabels` hook. used to seed the labels list with mock data in
 * tests and previews, bypassing the network request.
 */
export type ManageLabelsLabel = NonNullable<UseLabelsOptions['mockData']>[number];
