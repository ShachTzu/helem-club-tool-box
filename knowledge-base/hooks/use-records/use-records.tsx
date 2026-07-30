import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { MediaRecord, type PlainMediaRecord } from '@helemclub/knowledge-base.entities.media-record';

/**
 * options accepted by the useRecords hook, used to filter the
 * list of media records by label, domains and a free text query.
 */
export type UseRecordsOptions = {
  /**
   * filter records belonging to a specific label (project).
   */
  labelId?: string;

  /**
   * filter records tagged with any of the given domains.
   */
  domainIds?: string[];

  /**
   * free text search query, matched against title/description.
   */
  query?: string;

  /**
   * maximum number of records to return.
   */
  limit?: number;

  /**
   * provide mock data to skip the network request. useful for
   * tests and compositions.
   */
  mockData?: MediaRecord[];
};

const LIST_RECORDS_QUERY = gql`
  query ListRecords($labelId: String, $domainIds: [String!], $query: String, $limit: Int) {
    listRecords(options: { labelId: $labelId, domainIds: $domainIds, query: $query, limit: $limit }) {
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
 * lists and filters media records in the knowledge base, by label,
 * domains and a free text query.
 */
export function useRecords(options?: UseRecordsOptions) {
  const { labelId, domainIds, query, limit, mockData } = options || {};

  const results = useQuery<{ listRecords: PlainMediaRecord[] }>(LIST_RECORDS_QUERY, {
    variables: { labelId, domainIds, query, limit },
    skip: !!mockData,
  });

  const records = useMemo(() => {
    if (mockData) return mockData;
    return results.data?.listRecords.map((record) => MediaRecord.from(record)) || [];
  }, [mockData, results.data]);

  return {
    records,
    loading: mockData ? false : results.loading,
    error: mockData ? undefined : results.error,
    refetch: results.refetch,
  };
}
