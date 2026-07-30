import { useCallback } from 'react';
import { Comment, type PlainComment } from '@helemclub/engagement.entities.comment';
import { useModerationQueue } from './use-moderation-queue.js';
import { useResolveReport } from './use-resolve-report.js';

export type UseModerationOptions = {
  /**
   * provide mock data for the moderation queue to bypass the GraphQL query,
   * useful for tests and previews.
   */
  mockData?: PlainComment[];
};

export type UseModerationValue = {
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

  /**
   * whether a resolve action (restore/delete) is in flight.
   */
  resolving: boolean;

  /**
   * error raised by the most recent resolve action, if any.
   */
  resolveError?: Error;

  /**
   * restores a hidden/reported comment back to public view. resolves with
   * whether the server confirmed the change.
   */
  restoreComment: (commentId: string) => Promise<boolean>;

  /**
   * permanently deletes a hidden/reported comment. resolves with whether
   * the server confirmed the change.
   */
  deleteComment: (commentId: string) => Promise<boolean>;
};

/**
 * manages the moderation queue: lists comments that were hidden or reported
 * and are pending a decision, and lets a moderator or admin resolve each
 * one by restoring it to public view or deleting it permanently. access to
 * these actions should be gated by the caller based on the current user's role.
 */
export function useModeration(options?: UseModerationOptions): UseModerationValue {
  const { comments, loading, error, refetch } = useModerationQueue(options);
  const { resolveReport, loading: resolving, error: resolveError } = useResolveReport();

  const resolve = useCallback(
    async (commentId: string, action: 'restore' | 'delete') => {
      const success = await resolveReport(commentId, action);
      if (success) {
        await refetch();
      }
      return success;
    },
    [resolveReport, refetch]
  );

  const restoreComment = useCallback((commentId: string) => resolve(commentId, 'restore'), [resolve]);
  const deleteComment = useCallback((commentId: string) => resolve(commentId, 'delete'), [resolve]);

  return {
    comments,
    loading,
    error,
    refetch,
    resolving,
    resolveError,
    restoreComment,
    deleteComment,
  };
}
