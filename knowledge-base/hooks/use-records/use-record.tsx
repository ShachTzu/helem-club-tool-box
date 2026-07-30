import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { MediaRecord, type PlainMediaRecord } from '@helemclub/knowledge-base.entities.media-record';

/**
 * options accepted by the useRecord hook.
 */
export type UseRecordOptions = {
  /**
   * provide mock data to skip the network request. useful for
   * tests and compositions.
   */
  mockData?: MediaRecord;
};

const GET_RECORD_QUERY = gql`
  query GetRecord($idOrSlug: String!) {
    getRecord(idOrSlug: $idOrSlug) {
      id
      slug
      labelId
      title
      description
      mediaType
      mediaUrl
      thumbnailUrl
      durationSec
      domains
      viewCount
      publishedAt
    }
  }
`;

/**
 * fetches a single media record by its id or slug.
 */
export function useRecord(idOrSlug?: string, options?: UseRecordOptions) {
  const { mockData } = options || {};

  const results = useQuery<{ getRecord: PlainMediaRecord | null }>(GET_RECORD_QUERY, {
    variables: { idOrSlug },
    skip: !!mockData || !idOrSlug,
  });

  const record = useMemo(() => {
    if (mockData) return mockData;
    return results.data?.getRecord ? MediaRecord.from(results.data.getRecord) : undefined;
  }, [mockData, results.data]);

  return {
    record,
    loading: mockData ? false : results.loading,
    error: mockData ? undefined : results.error,
    refetch: results.refetch,
  };
}
