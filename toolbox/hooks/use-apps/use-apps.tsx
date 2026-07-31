import type { PlainApp } from '@helemclub/toolbox.entities.app';
import { useListApps, type AppSort, type UseListAppsOptions } from './use-list-apps.js';
import { useGetApp } from './use-get-app.js';
import { useListPendingApps } from './use-list-pending-apps.js';
import { useSubmitApp, type SubmitAppOptions } from './use-submit-app.js';
import { useReviewApp, type ReviewAppOptions } from './use-review-app.js';
import { useIncrementAppClick, type IncrementAppClickOptions } from './use-increment-app-click.js';

export type { AppSort } from './use-list-apps.js';
export type { SubmitAppOptions } from './use-submit-app.js';
export type { ReviewAppOptions } from './use-review-app.js';
export type { IncrementAppClickOptions } from './use-increment-app-click.js';

export type UseAppsOptions = {
  /**
   * restrict the results to apps tagged with any of the given coping domains.
   */
  domainIds?: string[];

  /**
   * sort key applied to the returned apps.
   */
  sort?: AppSort;

  /**
   * restrict the results to featured apps only.
   */
  featured?: boolean;

  /**
   * free-text search query matched against the app name and description.
   */
  query?: string;

  /**
   * provide mock apps to skip the network request, useful for tests and previews.
   */
  mockData?: PlainApp[];

  /**
   * provide mock pending apps to skip the network request, useful for tests and previews.
   */
  mockPendingData?: PlainApp[];
};

/**
 * manages the Helam Club toolbox apps catalog. lists published apps with
 * optional filtering by coping domain, sorting, featured status and a
 * free-text search query, and exposes actions for fetching a single app,
 * submitting a new app, reviewing a pending app, listing pending apps, and
 * recording a click-through on an app's external link.
 */
export function useApps(options?: UseAppsOptions) {
  const listOptions: UseListAppsOptions = {
    domainIds: options?.domainIds,
    sort: options?.sort,
    featured: options?.featured,
    query: options?.query,
    mockData: options?.mockData,
  };

  const { apps, loading, error, refetch } = useListApps(listOptions);
  const { getApp, app, loading: appLoading, error: appError } = useGetApp();
  const {
    apps: pendingApps,
    moderatorMeta: pendingModeratorMeta,
    loading: pendingLoading,
    error: pendingError,
    refetch: refetchPending,
  } = useListPendingApps({ mockData: options?.mockPendingData });
  const { submitApp, loading: submitting, error: submitError } = useSubmitApp();
  const { reviewApp: reviewAppMutation, loading: reviewing, error: reviewError } = useReviewApp();
  const { incrementClick, loading: incrementing, error: incrementError } = useIncrementAppClick();

  const reviewApp = async (reviewOptions: ReviewAppOptions) => {
    // in mock mode (tests/previews) no Apollo mutation is wired, so resolve
    // locally instead of hitting the (unmocked) network.
    if (options?.mockPendingData) {
      return undefined;
    }

    const reviewedApp = await reviewAppMutation(reviewOptions);
    await refetchPending?.();

    return reviewedApp;
  };

  const submit = async (submitOptions: SubmitAppOptions, draftId?: string) => {
    const submittedApp = await submitApp(submitOptions, draftId);

    if (!options?.mockData) {
      await refetch?.();
    }

    return submittedApp;
  };

  return {
    apps,
    loading,
    error,
    refetch,
    getApp,
    app,
    appLoading,
    appError,
    submitApp: submit,
    submitting,
    submitError,
    reviewApp,
    reviewing,
    reviewError,
    pendingApps,
    pendingModeratorMeta,
    pendingLoading,
    pendingError,
    refetchPending,
    incrementClick,
    incrementing,
    incrementError,
  };
}
