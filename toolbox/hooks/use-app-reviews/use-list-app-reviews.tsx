import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { AppReview, type PlainAppReview } from '@helemclub/toolbox.entities.app-review';

export const LIST_TOOLBOX_APP_REVIEWS_QUERY = gql`
  query ListToolboxAppReviews($appId: String!) {
    listToolboxAppReviews(appId: $appId) {
      id
      appId
      stars
      comment
      displayName
      helpfulCount
      createdAt
    }
  }
`;

export type UseListAppReviewsOptions = {
  /**
   * provide mock data to skip the network request, useful for tests and previews.
   */
  mockData?: PlainAppReview[];
};

/**
 * lists the reviews submitted for a given toolbox app, ordered as returned
 * by the server.
 */
export function useListAppReviews(appId: string, options?: UseListAppReviewsOptions) {
  const results = useQuery<{ listToolboxAppReviews: PlainAppReview[] }>(LIST_TOOLBOX_APP_REVIEWS_QUERY, {
    variables: { appId },
    skip: !!options?.mockData,
  });

  const rawReviews = options?.mockData ? options.mockData : results.data?.listToolboxAppReviews;

  const reviews = useMemo(() => {
    return (rawReviews || []).map((review) => AppReview.from(review));
  }, [rawReviews]);

  if (options?.mockData) {
    return {
      reviews,
      loading: false,
      error: undefined,
      refetch: results.refetch,
    };
  }

  return {
    reviews,
    loading: results.loading,
    error: results.error,
    refetch: results.refetch,
  };
}
