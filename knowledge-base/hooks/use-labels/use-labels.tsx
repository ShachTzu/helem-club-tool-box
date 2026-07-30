import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Label, type PlainLabel } from '@helemclub/knowledge-base.entities.label';

/**
 * GraphQL query fetching all knowledge base labels, including their record counts.
 */
export const LIST_LABELS_QUERY = gql`
  query ListLabels {
    listLabels {
      id
      slug
      name
      description
      coverImage
      recordCount
    }
  }
`;

export type UseLabelsOptions = {
  /**
   * provide mock data to bypass the network request, useful for tests and compositions.
   */
  mockData?: PlainLabel[];
};

export type UseLabelsResult = {
  /**
   * the list of labels, including their record counts.
   */
  labels: Label[];

  /**
   * whether the labels are currently being fetched.
   */
  loading: boolean;

  /**
   * an error message, if the request failed.
   */
  error?: string;

  /**
   * re-fetches the labels list.
   */
  refetch: () => void;
};

/**
 * fetches the full list of knowledge base labels ("projects"), including the
 * number of records associated with each one.
 */
export function useLabels(options?: UseLabelsOptions): UseLabelsResult {
  const skip = Boolean(options?.mockData);

  const { data, loading, error, refetch } = useQuery<{ listLabels: PlainLabel[] }>(LIST_LABELS_QUERY, {
    skip,
  });

  const labels = useMemo(() => {
    if (options?.mockData) return options.mockData.map(Label.from);
    return (data?.listLabels || []).map(Label.from);
  }, [data, options?.mockData]);

  return {
    labels,
    loading: skip ? false : loading,
    error: error?.message,
    refetch: () => {
      refetch();
    },
  };
}
