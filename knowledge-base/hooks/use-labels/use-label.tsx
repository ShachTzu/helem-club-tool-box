import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Label, type PlainLabel } from '@helemclub/knowledge-base.entities.label';

/**
 * GraphQL query fetching a single knowledge base label by its id or slug.
 */
export const GET_LABEL_QUERY = gql`
  query GetLabel($idOrSlug: String!) {
    getLabel(idOrSlug: $idOrSlug) {
      id
      slug
      name
      description
      coverImage
      recordCount
    }
  }
`;

export type UseLabelOptions = {
  /**
   * provide mock data to bypass the network request, useful for tests and compositions.
   */
  mockData?: PlainLabel;
};

export type UseLabelResult = {
  /**
   * the resolved label, or undefined when not found or still loading.
   */
  label?: Label;

  /**
   * whether the label is currently being fetched.
   */
  loading: boolean;

  /**
   * an error message, if the request failed.
   */
  error?: string;

  /**
   * re-fetches the label.
   */
  refetch: () => void;
};

/**
 * fetches a single knowledge base label ("project") by its id or slug.
 */
export function useLabel(idOrSlug: string, options?: UseLabelOptions): UseLabelResult {
  const skip = Boolean(options?.mockData) || !idOrSlug;

  const { data, loading, error, refetch } = useQuery<{ getLabel: PlainLabel | null }>(GET_LABEL_QUERY, {
    variables: { idOrSlug },
    skip,
  });

  const label = useMemo(() => {
    if (options?.mockData) return Label.from(options.mockData);
    return data?.getLabel ? Label.from(data.getLabel) : undefined;
  }, [data, options?.mockData]);

  return {
    label,
    loading: skip ? false : loading,
    error: error?.message,
    refetch: () => {
      refetch();
    },
  };
}
