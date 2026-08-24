import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Draft, type PlainDraft } from '@helemclub/editorial.entities.draft';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import type { ListDraftsOptions } from './draft-options.js';

export type { ListDraftsOptions } from './draft-options.js';

/**
 * GraphQL query listing drafts, optionally filtered by content type, status,
 * author, domains and free text search.
 */
export const LIST_DRAFTS_QUERY = gql`
  query ListDrafts($options: ListDraftsOptions) {
    listDrafts(options: $options) {
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

type ListDraftsData = {
  listDrafts: PlainDraft[] | null;
};

export type UseDraftsOptions = ListDraftsOptions & {
  /**
   * provide mock data to bypass the GraphQL query, useful for tests and
   * previews. pass an empty array to simulate an empty result.
   */
  mockData?: PlainDraft[];
};

export type UseDraftsValue = {
  /**
   * the drafts matching the requested filters.
   */
  drafts: Draft[];

  /**
   * whether the drafts query is in flight.
   */
  loading: boolean;

  /**
   * a Hebrew, user-facing error message, when the query failed.
   */
  error?: string;

  /**
   * re-fetches the drafts list from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * fetches the list of drafts matching the given filters: content type,
 * status, author id, domains and free text search.
 *
 * writers only ever manage their own drafts, so when the signed-in user
 * holds the writer role (and not a higher one), the results are
 * automatically scoped to their own authorId, regardless of the requested
 * filter.
 */
export function useDrafts(options?: UseDraftsOptions): UseDraftsValue {
  const { user, canWrite, isModerator } = useAuth();
  const hasMock = Boolean(options && Object.prototype.hasOwnProperty.call(options, 'mockData'));

  const isWriterOnly = canWrite && !isModerator;
  const authorId = isWriterOnly ? user?.id : options?.authorId;

  const variables = {
    options: {
      contentType: options?.contentType,
      status: options?.status,
      authorId,
      domains: options?.domains,
      search: options?.search,
      limit: options?.limit,
      offset: options?.offset,
    },
  };

  const { data, loading, error, refetch } = useQuery<ListDraftsData>(LIST_DRAFTS_QUERY, {
    variables,
    skip: hasMock,
    errorPolicy: 'all',
  });

  const rawDrafts = hasMock ? options?.mockData : data?.listDrafts;

  const drafts = useMemo(() => {
    return (rawDrafts || []).filter(Boolean).map((plainDraft) => Draft.from(plainDraft));
  }, [rawDrafts]);

  return {
    drafts,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error ? 'אירעה שגיאה בטעינת רשימת הטיוטות' : undefined,
    refetch,
  };
}
