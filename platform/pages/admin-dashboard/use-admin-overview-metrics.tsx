import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import type { AdminDashboardMetric } from './admin-dashboard-metric-type.js';

/**
 * pulls the overall engagement overview together from each feature aspect's
 * own admin dashboard summary endpoint — blog, toolbox and knowledge-base for
 * views, engagement for the platform-wide comment count — rather than any one
 * aspect reaching into another's data.
 */
const GET_ADMIN_OVERVIEW_STATS_QUERY = gql`
  query GetAdminOverviewStats {
    getBlogStats {
      totalViews
      registeredViews
    }
    getToolboxViewStats {
      totalViews
      registeredViews
    }
    getKnowledgeBaseViewStats {
      totalViews
      registeredViews
    }
    getCommentStats {
      total
      registered
    }
  }
`;

type ViewTotals = {
  totalViews: number;
  registeredViews: number;
};

type GetAdminOverviewStatsData = {
  getBlogStats: ViewTotals | null;
  getToolboxViewStats: ViewTotals | null;
  getKnowledgeBaseViewStats: ViewTotals | null;
  getCommentStats: { total: number; registered: number } | null;
};

const numberFormatter = new Intl.NumberFormat(`he-IL`);
function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export type UseAdminOverviewMetricsValue = {
  /**
   * the composed overview metrics, or undefined while loading or on error
   * (the caller falls back to its own default metrics in that case).
   */
  metrics?: AdminDashboardMetric[];

  /**
   * whether the underlying query is in flight.
   */
  loading: boolean;

  /**
   * error raised by the query, if any.
   */
  error?: Error;
};

/**
 * composes the overall admin-dashboard overview: total and registered-member
 * views summed across blog, toolbox and knowledge-base, plus total and
 * registered-member comments across the whole platform.
 */
export function useAdminOverviewMetrics(): UseAdminOverviewMetricsValue {
  const { data, loading, error } = useQuery<GetAdminOverviewStatsData>(GET_ADMIN_OVERVIEW_STATS_QUERY);

  const metrics = useMemo<AdminDashboardMetric[] | undefined>(() => {
    if (!data) return undefined;

    const totalViews =
      (data.getBlogStats?.totalViews || 0) +
      (data.getToolboxViewStats?.totalViews || 0) +
      (data.getKnowledgeBaseViewStats?.totalViews || 0);

    const registeredViews =
      (data.getBlogStats?.registeredViews || 0) +
      (data.getToolboxViewStats?.registeredViews || 0) +
      (data.getKnowledgeBaseViewStats?.registeredViews || 0);

    const totalComments = data.getCommentStats?.total || 0;
    const registeredComments = data.getCommentStats?.registered || 0;

    return [
      { id: `total-views`, label: `סה"כ צפיות בפלטפורמה`, value: formatNumber(totalViews) },
      { id: `registered-views`, label: `צפיות ע"י חברים רשומים`, value: formatNumber(registeredViews) },
      { id: `total-comments`, label: `סה"כ תגובות בפלטפורמה`, value: formatNumber(totalComments) },
      { id: `registered-comments`, label: `תגובות ע"י חברים רשומים`, value: formatNumber(registeredComments) },
    ];
  }, [data]);

  return { metrics, loading, error: error as Error | undefined };
}
