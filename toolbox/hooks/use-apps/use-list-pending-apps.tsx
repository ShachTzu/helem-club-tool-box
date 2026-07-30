import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';

/**
 * GraphQL query listing toolbox apps awaiting moderation review.
 */
export const LIST_PENDING_TOOLBOX_APPS_QUERY = gql`
  query ListPendingToolboxApps {
    listPendingToolboxApps {
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

export type UseListPendingAppsOptions = {
  /**
   * provide mock pending apps to skip the network request, useful for tests and previews.
   */
  mockData?: PlainApp[];
};

/**
 * lists toolbox apps that are awaiting moderation review, for use by
 * moderators and admins.
 */
export function useListPendingApps(options?: UseListPendingAppsOptions) {
  const results = useQuery<{ listPendingToolboxApps: PlainApp[] }>(LIST_PENDING_TOOLBOX_APPS_QUERY, {
    skip: !!options?.mockData,
  });

  const rawApps = options?.mockData ? options.mockData : results.data?.listPendingToolboxApps;

  const apps = useMemo(() => {
    return (rawApps || []).map((app) => App.from(app));
  }, [rawApps]);

  if (options?.mockData) {
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
