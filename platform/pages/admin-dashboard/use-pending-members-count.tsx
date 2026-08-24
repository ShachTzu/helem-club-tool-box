import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

/**
 * GraphQL query returning how many members are awaiting an approval decision.
 */
export const PENDING_MEMBERS_COUNT_QUERY = gql`
  query PendingMembersCount {
    pendingMembersCount
  }
`;

type PendingMembersCountData = {
  pendingMembersCount: number | null;
};

export type UsePendingMembersCountValue = {
  /**
   * number of members currently awaiting approval. zero while loading or when
   * the query fails, so the UI never renders a badge it cannot justify.
   */
  count: number;

  /**
   * whether the count is still loading.
   */
  loading: boolean;
};

/**
 * fetches the pending-members count for the admin navigation badge.
 *
 * the approval queue is invisible from the dashboard otherwise: a moderator
 * would have to open the members panel to discover anyone is waiting, and a
 * member who is never noticed sits on a waiting screen indefinitely. polling
 * keeps the badge fresh while the dashboard stays open, so a signup that
 * arrives mid-session still surfaces.
 *
 * a failure here must never break the dashboard — the badge simply does not
 * render, which is why the error is swallowed rather than thrown.
 *
 * @param pollIntervalMs how often to refetch, in milliseconds.
 * @returns the pending count and its loading state.
 */
export function usePendingMembersCount(pollIntervalMs = 60000): UsePendingMembersCountValue {
  const { data, loading } = useQuery<PendingMembersCountData>(PENDING_MEMBERS_COUNT_QUERY, {
    errorPolicy: 'all',
    pollInterval: pollIntervalMs,
  });

  return {
    count: data?.pendingMembersCount || 0,
    loading,
  };
}
