import { useState } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

const EDITORIAL_STATS_QUERY = gql`
  query GetEditorialStats($options: GetEditorialStatsOptions) {
    getEditorialStats(options: $options) {
      totalDrafts
      pendingReview
      approvedThisPeriod
      publishedThisPeriod
      rejectedThisPeriod
      avgHoursToApproval
      byContentType {
        contentType
        label
        count
      }
      byReviewer {
        actorId
        actorName
        approvals
        rejections
      }
    }
  }
`;

const DEFAULT_DAYS = 30;

export type EditorialStatsByContentType = {
  /**
   * key of the content type (e.g. 'post', 'media-record').
   */
  contentType: string;

  /**
   * human readable, Hebrew label of the content type.
   */
  label: string;

  /**
   * number of drafts of this content type within the measured period.
   */
  count: number;
};

export type EditorialStatsByReviewer = {
  /**
   * id of the reviewer (moderator/admin) who acted on drafts.
   */
  actorId: string;

  /**
   * display name of the reviewer.
   */
  actorName: string;

  /**
   * number of approvals issued by this reviewer within the measured period.
   */
  approvals: number;

  /**
   * number of rejections issued by this reviewer within the measured period.
   */
  rejections: number;
};

export type EditorialStats = {
  /**
   * total number of drafts in the editorial system, regardless of status.
   */
  totalDrafts: number;

  /**
   * number of drafts currently awaiting review.
   */
  pendingReview: number;

  /**
   * number of drafts approved within the measured period.
   */
  approvedThisPeriod: number;

  /**
   * number of drafts published within the measured period.
   */
  publishedThisPeriod: number;

  /**
   * number of drafts rejected within the measured period.
   */
  rejectedThisPeriod: number;

  /**
   * average number of hours between submission and approval.
   */
  avgHoursToApproval: number;

  /**
   * breakdown of drafts by content type.
   */
  byContentType: EditorialStatsByContentType[];

  /**
   * breakdown of review activity by reviewer.
   */
  byReviewer: EditorialStatsByReviewer[];
};

export type UseEditorialStatsOptions = {
  /**
   * provide mock editorial stats, bypassing the network request entirely. useful
   * for tests and compositions.
   */
  mockData?: EditorialStats;
};

export type UseEditorialStatsValue = {
  /**
   * the editorial stats for the currently selected period, once loaded.
   */
  stats?: EditorialStats;

  /**
   * whether the stats are currently loading.
   */
  loading: boolean;

  /**
   * error message, if the stats request failed.
   */
  error?: string;

  /**
   * updates the number of days the stats are measured over, triggering a
   * refetch of the underlying query.
   */
  setDays: (days: number) => void;
};

/**
 * editorial system metrics for the dashboard: totals across drafts, pending
 * reviews, approvals/publications/rejections within the measured period, the
 * average time to approval, and breakdowns by content type and by reviewer.
 */
export function useEditorialStats(days = DEFAULT_DAYS, options?: UseEditorialStatsOptions): UseEditorialStatsValue {
  const mockData = options?.mockData;
  const [periodDays, setPeriodDays] = useState(days);

  const queryResult = useQuery<{ getEditorialStats: EditorialStats }>(EDITORIAL_STATS_QUERY, {
    variables: { options: { days: periodDays } },
    skip: Boolean(mockData),
  });

  const stats = mockData || queryResult.data?.getEditorialStats;
  const loading = mockData ? false : queryResult.loading;
  const error = mockData ? undefined : queryResult.error?.message;

  return {
    stats,
    loading,
    error,
    setDays: (nextDays: number) => setPeriodDays(nextDays),
  };
}
