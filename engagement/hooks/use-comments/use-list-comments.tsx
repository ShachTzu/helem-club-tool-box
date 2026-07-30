import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Comment, type PlainComment } from '@helemclub/engagement.entities.comment';

/**
 * GraphQL query listing all comments posted against a given target
 * (e.g. an app, blog post or domain). visibility filtering (members-only,
 * hidden) is handled by consumers of this hook, not by the query itself.
 */
export const LIST_COMMENTS_QUERY = gql`
  query ListComments($targetType: String!, $targetId: String!) {
    listComments(targetType: $targetType, targetId: $targetId) {
      id
      targetType
      targetId
      text
      displayName
      isAnonymous
      membersOnly
      deviceId
      userId
      reportCount
      hidden
      createdAt
    }
  }
`;

type ListCommentsData = {
  listComments: PlainComment[] | null;
};

export type UseListCommentsOptions = {
  /**
   * provide mock data to bypass the GraphQL query, useful for tests and previews.
   */
  mockData?: PlainComment[];
};

export type UseListCommentsValue = {
  /**
   * all comments posted against the target, unfiltered by visibility rules.
   */
  comments: Comment[];

  /**
   * whether the comments query is in flight.
   */
  loading: boolean;

  /**
   * error raised by the comments query, if any.
   */
  error?: Error;

  /**
   * re-fetches the comments from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * fetches all comments posted against a given target type and id. accepts
 * optional mock data to skip the network request, used for tests and previews.
 */
export function useListComments(
  targetType: string,
  targetId: string,
  options?: UseListCommentsOptions
): UseListCommentsValue {
  const hasMock = Boolean(options?.mockData);

  const { data, loading, error, refetch } = useQuery<ListCommentsData>(LIST_COMMENTS_QUERY, {
    variables: { targetType, targetId },
    skip: hasMock,
  });

  const comments = useMemo(() => {
    if (hasMock) return (options?.mockData || []).map(Comment.from);
    return (data?.listComments || []).map(Comment.from);
  }, [hasMock, options?.mockData, data]);

  return {
    comments,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
