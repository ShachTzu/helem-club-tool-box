import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';

/**
 * GraphQL query listing toolbox apps, optionally filtered by domain,
 * sorted, restricted to featured apps, or matched against a free-text query.
 */
export const LIST_TOOLBOX_APPS_QUERY = gql`
  query ListToolboxApps($options: ListToolboxAppsOptions) {
    listToolboxApps(options: $options) {
      id
      slug
      name
      subtitle
      fullDescription
      externalLink
      icon
      screenshots
      costType
      platform
      language
      requiresSignup
      clickCount
      helpfulYes
      helpfulNo
      isFeatured
      developerName
      originatorName
      domains
      avgRating
      ratingCount
      ratingHistogram
      status
    }
  }
`;

/**
 * supported sort keys for the toolbox apps catalog.
 */
export type AppSort = 'rating' | 'clicks' | 'newest';

export type UseListAppsOptions = {
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
};

/**
 * lists published toolbox apps, with optional filtering by coping domain,
 * sorting, featured status, and a free-text search query.
 */
export function useListApps(options?: UseListAppsOptions) {
  const { domainIds, sort, featured, query, mockData } = options || {};

  const results = useQuery<{ listToolboxApps: PlainApp[] }>(LIST_TOOLBOX_APPS_QUERY, {
    variables: { options: { domainIds, sort, featured, query } },
    skip: !!mockData,
  });

  const rawApps = mockData ? mockData : results.data?.listToolboxApps;

  const apps = useMemo(() => {
    return (rawApps || []).map((app) => App.from(app));
  }, [rawApps]);

  if (mockData) {
    return {
      apps,
      loading: false,
      error: undefined,
      refetch: results.refetch,
    };
  }

  return {
    apps,
    loading: results.loading,
    error: results.error,
    refetch: results.refetch,
  };
}
