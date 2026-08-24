import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Revision } from '@helemclub/editorial.entities.revision';

export type UseRevisionsOptions = {
  /**
   * provide mock revisions instead of querying the server. useful for tests
   * and compositions.
   */
  mockData?: Revision[];
};

export type UseRevisionsResult = {
  /**
   * revisions of the draft, as returned by the server.
   */
  revisions: Revision[];

  /**
   * whether the revisions are currently being fetched.
   */
  loading: boolean;

  /**
   * error message, if the query failed.
   */
  error?: string;
};

type ListRevisionsQueryResult = {
  listRevisions: Array<{
    id: string;
    draftId: string;
    versionNumber: number;
    payload: string;
    domains: string[];
    authorId: string;
    authorName: string;
    changeSummary: string;
    createdAt: string;
  } | null> | null;
};

const LIST_REVISIONS_QUERY = gql`
  query ListRevisions($draftId: ID) {
    listRevisions(draftId: $draftId) {
      id
      draftId
      versionNumber
      payload
      domains
      authorId
      authorName
      changeSummary
      createdAt
    }
  }
`;

/**
 * parses a serialized JSON payload string, falling back to an empty object
 * when the payload is missing or malformed.
 */
function parsePayload(payload?: string | null): Record<string, any> {
  if (!payload) return {};

  try {
    return JSON.parse(payload);
  } catch {
    return {};
  }
}

/**
 * fetches the revision history of a draft, in the order returned by the
 * server. accepts an optional mockData option that, when provided, skips the
 * network request entirely and returns the given revisions instead — useful
 * for tests and compositions.
 */
export function useRevisions(draftId: string, options?: UseRevisionsOptions): UseRevisionsResult {
  const { mockData } = options || {};

  const { data, loading, error } = useQuery<ListRevisionsQueryResult>(LIST_REVISIONS_QUERY, {
    variables: { draftId },
    skip: !!mockData || !draftId,
  });

  const revisions = useMemo(() => {
    if (mockData) return mockData;

    return (data?.listRevisions || [])
      .filter((revision): revision is NonNullable<typeof revision> => Boolean(revision))
      .map((revision) =>
        Revision.from({
          id: revision.id,
          draftId: revision.draftId,
          versionNumber: revision.versionNumber,
          payload: parsePayload(revision.payload),
          domains: revision.domains || [],
          authorId: revision.authorId,
          authorName: revision.authorName,
          changeSummary: revision.changeSummary,
          createdAt: revision.createdAt,
        })
      );
  }, [data, mockData]);

  return {
    revisions,
    loading,
    error: error?.message,
  };
}
