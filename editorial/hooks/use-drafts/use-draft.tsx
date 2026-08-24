import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Draft, type PlainDraft } from '@helemclub/editorial.entities.draft';

/**
 * GraphQL query fetching a single draft by id.
 */
export const GET_DRAFT_QUERY = gql`
  query GetDraft($id: ID) {
    getDraft(id: $id) {
      id
      contentType
      contentRef
      title
      payload
      domains
      status
      authorId
      authorName
      currentVersion
      createdAt
      updatedAt
      submittedAt
      publishedAt
      lastReviewerId
      lastReviewNote
    }
  }
`;

type GetDraftData = {
  getDraft: PlainDraft | null;
};

export type UseDraftOptions = {
  /**
   * provide mock data for the draft to bypass the GraphQL query, useful for
   * tests and previews. pass null to simulate a draft that was not found.
   */
  mockData?: PlainDraft | null;
};

export type UseDraftValue = {
  /**
   * the requested draft, or undefined when it was not found or is still
   * loading.
   */
  draft?: Draft;

  /**
   * whether the draft query is in flight.
   */
  loading: boolean;

  /**
   * a Hebrew, user-facing error message, when the query failed.
   */
  error?: string;

  /**
   * re-fetches the draft from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * fetches a single draft by its id.
 */
export function useDraft(id: string, options?: UseDraftOptions): UseDraftValue {
  const hasMock = Boolean(options && Object.prototype.hasOwnProperty.call(options, 'mockData'));

  const { data, loading, error, refetch } = useQuery<GetDraftData>(GET_DRAFT_QUERY, {
    variables: { id },
    skip: hasMock || !id,
    errorPolicy: 'all',
  });

  const rawDraft = hasMock ? options?.mockData : data?.getDraft;

  const draft = useMemo(() => {
    return rawDraft ? Draft.from(rawDraft) : undefined;
  }, [rawDraft]);

  return {
    draft,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error ? 'אירעה שגיאה בטעינת הטיוטה' : undefined,
    refetch,
  };
}
