import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';

/**
 * GraphQL query listing the current member's own submissions across all
 * statuses. owner-scoped on the server.
 */
export const LIST_MY_TOOLBOX_SUBMISSIONS_QUERY = gql`
  query ListMyToolboxSubmissions {
    listMyToolboxSubmissions {
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

export type UseListMySubmissionsOptions = {
  /**
   * provide mock submissions to skip the network request, useful for tests and previews.
   */
  mockData?: PlainApp[];
};

/**
 * lists the current member's own submissions (drafts, pending, published,
 * etc.) for the "my submissions" page. the server returns only the caller's
 * own records.
 */
export function useListMySubmissions(options?: UseListMySubmissionsOptions) {
  const results = useQuery<{ listMyToolboxSubmissions: PlainApp[] }>(
    LIST_MY_TOOLBOX_SUBMISSIONS_QUERY,
    { skip: !!options?.mockData }
  );

  const rawApps = options?.mockData ? options.mockData : results.data?.listMyToolboxSubmissions;

  const apps = useMemo(() => (rawApps || []).map((app) => App.from(app)), [rawApps]);

  return {
    apps,
    loading: options?.mockData ? false : results.loading,
    error: options?.mockData ? undefined : results.error,
    refetch: results.refetch,
  };
}
