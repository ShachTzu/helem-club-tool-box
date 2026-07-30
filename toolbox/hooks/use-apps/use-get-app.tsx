import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { useLazyQuery } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';

/**
 * GraphQL query fetching a single toolbox app by its id or slug.
 */
export const GET_TOOLBOX_APP_QUERY = gql`
  query GetToolboxApp($idOrSlug: String!) {
    getToolboxApp(idOrSlug: $idOrSlug) {
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

export type UseGetAppOptions = {
  /**
   * provide a mock app to skip the network request, useful for tests and previews.
   */
  mockData?: PlainApp;
};

/**
 * fetches a single toolbox app on demand by its id or slug. exposes a
 * getApp function that resolves the app entity once loaded from the server,
 * or immediately from the provided mock data.
 */
export function useGetApp(options?: UseGetAppOptions) {
  const [fetchApp, { data, loading, error }] = useLazyQuery<
    { getToolboxApp: PlainApp | null },
    { idOrSlug: string }
  >(GET_TOOLBOX_APP_QUERY);

  const getApp = useCallback(
    async (idOrSlug: string) => {
      if (options?.mockData) {
        return App.from(options.mockData);
      }

      const result = await fetchApp({ variables: { idOrSlug } });
      const plainApp = result.data?.getToolboxApp;
      return plainApp ? App.from(plainApp) : undefined;
    },
    [fetchApp, options?.mockData]
  );

  const app = options?.mockData
    ? App.from(options.mockData)
    : data?.getToolboxApp
      ? App.from(data.getToolboxApp)
      : undefined;

  return {
    getApp,
    app,
    loading: options?.mockData ? false : loading,
    error: options?.mockData ? undefined : error,
  };
}
