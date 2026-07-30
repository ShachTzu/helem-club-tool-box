import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Comment, type PlainComment } from '@helemclub/engagement.entities.comment';

/**
 * GraphQL query fetching the moderation queue: comments that were hidden
 * or reported and are pending a moderator decision.
 */
export const LIST_MODERATION_QUEUE_QUERY = gql`
  query ListModerationQueue {
    listModerationQueue {
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

type ListModerationQueueData = {
  listModerationQueue: PlainComment[] | null;
};

export type UseModerationQueueOptions = {
  /**
   * provide mock data for the moderation queue to bypass the GraphQL query,
   * useful for tests and previews.
   */
  mockData?: PlainComment[];
};

export type UseModerationQueueValue = {
  /**
   * comments currently pending moderation (hidden and/or reported).
   */
  comments: Comment[];

  /**
   * whether the moderation queue is still being fetched.
   */
  loading: boolean;

  /**
   * error raised while fetching the moderation queue, if any.
   */
  error?: Error;

  /**
   * re-fetches the moderation queue from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * fetches the moderation queue: comments that were hidden or reported and
 * are awaiting a moderator or admin decision to restore or delete them.
 */
export function useModerationQueue(options?: UseModerationQueueOptions): UseModerationQueueValue {
  const hasMock = options?.mockData !== undefined;

  const { data, loading, error, refetch } = useQuery<ListModerationQueueData>(LIST_MODERATION_QUEUE_QUERY, {
    skip: hasMock,
  });

  const comments = useMemo(() => {
    if (hasMock) {
      return (options?.mockData || []).map(Comment.from);
    }
    return data?.listModerationQueue ? data.listModerationQueue.map(Comment.from) : [];
  }, [hasMock, options?.mockData, data]);

  return {
    comments,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
