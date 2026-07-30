import { useCallback, useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { useDeviceId } from '@helemclub/platform.hooks.use-device-id';
import type { ReactionTargetType, ReactionType } from '@helemclub/engagement.entities.reaction';

/**
 * a single reaction type with its aggregated count (e.g. "like": 12).
 */
export type ReactionCount = {
  type: string;
  count: number;
};

/**
 * aggregated reaction counts for a target object, plus the reaction
 * (if any) the current device has made on it.
 */
export type ReactionSummary = {
  counts: ReactionCount[];
  myReaction?: string;
};

export type UseReactionsOptions = {
  /**
   * provide mock reaction data instead of fetching it. when set, the
   * underlying query is skipped entirely.
   */
  mockData?: ReactionSummary;

  /**
   * override the persisted device id used to scope the reaction.
   * useful for tests and previews.
   */
  mockDeviceId?: string;
};

export type UseReactionsResult = {
  /**
   * aggregated counts per reaction type.
   */
  counts: ReactionCount[];

  /**
   * sum of all reaction counts across types.
   */
  totalCount: number;

  /**
   * the reaction type the current device made on this target, if any.
   */
  myReaction?: string;

  /**
   * whether the reaction summary is being fetched.
   */
  loading: boolean;

  /**
   * whether a toggleReaction call is in flight.
   */
  toggling: boolean;

  /**
   * error message, if fetching the reaction summary failed.
   */
  error?: string;

  /**
   * toggles a reaction of the given type for the current device. calling
   * it again with the same type removes the reaction; calling it with a
   * different type replaces the existing one.
   */
  toggleReaction: (type: ReactionType) => Promise<void>;
};

const GET_REACTIONS = gql`
  query GetReactions($targetType: String!, $targetId: String!, $deviceId: String!) {
    getReactions(targetType: $targetType, targetId: $targetId, deviceId: $deviceId) {
      counts {
        type
        count
      }
      myReaction
    }
  }
`;

const TOGGLE_REACTION = gql`
  mutation ToggleReaction($targetType: String!, $targetId: String!, $type: String!, $deviceId: String!) {
    toggleReaction(options: { targetType: $targetType, targetId: $targetId, type: $type, deviceId: $deviceId }) {
      counts {
        type
        count
      }
      myReaction
    }
  }
`;

type GetReactionsData = {
  getReactions: ReactionSummary | null;
};

type ToggleReactionData = {
  toggleReaction: ReactionSummary | null;
};

const EMPTY_SUMMARY: ReactionSummary = { counts: [], myReaction: undefined };

/**
 * returns reaction counts and the current device's reaction for a target
 * object (e.g. a post, event or comment), along with a function to
 * toggle a reaction on or off. reactions are anonymous and scoped to a
 * device id persisted via useDeviceId, so no authentication is required.
 */
export function useReactions(
  targetType: ReactionTargetType,
  targetId: string,
  options?: UseReactionsOptions
): UseReactionsResult {
  const mockData = options?.mockData;
  const deviceId = useDeviceId({ mockDeviceId: options?.mockDeviceId });

  const { data, loading, error } = useQuery<GetReactionsData>(GET_REACTIONS, {
    variables: { targetType, targetId, deviceId },
    skip: Boolean(mockData),
  });

  const [summary, setSummary] = useState<ReactionSummary>(mockData || EMPTY_SUMMARY);

  useEffect(() => {
    if (mockData) return;
    if (data?.getReactions) {
      setSummary(data.getReactions);
    }
  }, [data, mockData]);

  const [toggleReactionMutation, { loading: toggling }] = useMutation<ToggleReactionData>(TOGGLE_REACTION);

  const toggleReaction = useCallback(
    async (type: ReactionType) => {
      const result = await toggleReactionMutation({
        variables: { targetType, targetId, type, deviceId },
      });

      if (result.data?.toggleReaction) {
        setSummary(result.data.toggleReaction);
      }
    },
    [toggleReactionMutation, targetType, targetId, deviceId]
  );

  const totalCount = useMemo(
    () => summary.counts.reduce((sum, current) => sum + (current.count || 0), 0),
    [summary.counts]
  );

  return {
    counts: summary.counts,
    totalCount,
    myReaction: summary.myReaction,
    loading: mockData ? false : loading,
    toggling,
    error: error?.message,
    toggleReaction,
  };
}
