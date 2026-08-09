import React from 'react';
import classNames from 'classnames';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Card } from '@helemclub/design.content.card';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import type { ToolboxDashboardStats, ToolboxRatingWeeklyTrendPoint } from './toolbox-dashboard-stats-type.js';
import type { ToolboxDashboardMockUser } from './toolbox-dashboard-mock-user-type.js';
import styles from './toolbox-dashboard.module.scss';

const GET_TOOLBOX_DASHBOARD_STATS_QUERY = gql`
  query GetToolboxDashboardStats {
    getToolboxViewStats {
      totalViews
      registeredViews
    }
    getToolboxRatingStats {
      reviewCount
      averageStars
      weeklyTrend {
        weekStart
        count
      }
    }
  }
`;

type ToolboxViewStatsData = {
  totalViews: number;
  registeredViews: number;
};

type ToolboxRatingStatsData = {
  reviewCount: number;
  averageStars: number;
  weeklyTrend: ToolboxRatingWeeklyTrendPoint[];
};

type GetToolboxDashboardStatsData = {
  getToolboxViewStats: ToolboxViewStatsData | null;
  getToolboxRatingStats: ToolboxRatingStatsData | null;
};

const DEFAULT_ALLOWED_ROLES: ('member' | 'writer' | 'moderator' | 'admin')[] = ['moderator', 'admin'];

const numberFormatter = new Intl.NumberFormat(`he-IL`);
function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatWeekLabel(weekStart: string) {
  const date = new Date(weekStart);
  if (Number.isNaN(date.getTime())) return weekStart;
  return date.toLocaleDateString(`he-IL`, { day: `2-digit`, month: `2-digit` });
}

export type ToolboxDashboardProps = {
  /**
   * roles allowed to access this admin panel.
   */
  allowedRoles?: ('member' | 'writer' | 'moderator' | 'admin')[];

  /**
   * provide a mock signed-in user to bypass the auth request. useful for
   * tests and compositions. pass null to simulate a signed-out state.
   */
  mockUser?: ToolboxDashboardMockUser | null;

  /**
   * provide mock stats data to bypass the GraphQL query, useful for tests
   * and previews.
   */
  mockStats?: ToolboxDashboardStats;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * toolbox admin engagement dashboard: total app-detail views (split between
 * signed-in members and anonymous visitors) and star-rating activity,
 * including an 8-week trend of new reviews. restricted to moderators and
 * admins. RTL.
 */
export function ToolboxDashboard({
  allowedRoles = DEFAULT_ALLOWED_ROLES,
  mockUser,
  mockStats,
  className,
  style,
}: ToolboxDashboardProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles} mockData={mockUser}>
      <ToolboxDashboardContent mockStats={mockStats} className={className} style={style} />
    </ProtectedRoute>
  );
}

type ToolboxDashboardContentProps = {
  mockStats?: ToolboxDashboardStats;
  className?: string;
  style?: React.CSSProperties;
};

function ToolboxDashboardContent({ mockStats, className, style }: ToolboxDashboardContentProps) {
  const hasMockStats = mockStats !== undefined;
  const { data, loading, error } = useQuery<GetToolboxDashboardStatsData>(GET_TOOLBOX_DASHBOARD_STATS_QUERY, {
    skip: hasMockStats,
  });

  const stats: ToolboxDashboardStats | undefined = hasMockStats
    ? mockStats
    : data?.getToolboxViewStats && data?.getToolboxRatingStats
      ? {
          totalViews: data.getToolboxViewStats.totalViews,
          registeredViews: data.getToolboxViewStats.registeredViews,
          reviewCount: data.getToolboxRatingStats.reviewCount,
          averageStars: data.getToolboxRatingStats.averageStars,
          weeklyTrend: data.getToolboxRatingStats.weeklyTrend,
        }
      : undefined;

  const totalViews = stats?.totalViews || 0;
  const registeredViews = stats?.registeredViews || 0;
  const anonymousViews = Math.max(0, totalViews - registeredViews);
  const weeklyTrend = stats?.weeklyTrend || [];
  const maxWeeklyCount = Math.max(1, ...weeklyTrend.map((point) => point.count));

  const isLoading = !hasMockStats && loading;
  const hasError = !hasMockStats && Boolean(error);

  return (
    <div className={classNames(styles.dashboard, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>ניהול תוכן</div>
        <h1 className={styles.title}>דשבורד ארגז הכלים</h1>
        <p className={styles.subtitle}>צפיות בעמודי האפליקציות ופעילות הדירוגים, מפולחות בין חברים רשומים למבקרים אנונימיים.</p>
      </div>

      {isLoading && <div className={styles.stateMessage}>טוען נתונים...</div>}
      {hasError && <div className={styles.stateMessage}>אירעה שגיאה בטעינת הנתונים.</div>}

      {!isLoading && !hasError && (
        <>
          <div className={styles.metricsGrid}>
            <Card className={styles.metricCard}>
              <span className={styles.metricValue}>{formatNumber(totalViews)}</span>
              <span className={styles.metricLabel}>סה&quot;כ צפיות</span>
            </Card>
            <Card className={styles.metricCard}>
              <span className={styles.metricValue}>{formatNumber(registeredViews)}</span>
              <span className={styles.metricLabel}>צפיות ע&quot;י חברים רשומים</span>
            </Card>
            <Card className={styles.metricCard}>
              <span className={styles.metricValue}>{formatNumber(anonymousViews)}</span>
              <span className={styles.metricLabel}>צפיות אנונימיות</span>
            </Card>
            <Card className={styles.metricCard}>
              <span className={styles.metricValue}>{(stats?.averageStars || 0).toFixed(1)} ★</span>
              <span className={styles.metricLabel}>דירוג ממוצע ({formatNumber(stats?.reviewCount || 0)} ביקורות)</span>
            </Card>
          </div>

          <Card className={styles.panelCard}>
            <h2 className={styles.panelTitle}>ביקורות חדשות — 8 שבועות אחרונים</h2>
            {weeklyTrend.every((point) => point.count === 0) ? (
              <p className={styles.emptyText}>אין עדיין ביקורות בטווח הזמן הזה.</p>
            ) : (
              <div className={styles.trendChart}>
                {weeklyTrend.map((point) => (
                  <div key={point.weekStart} className={styles.trendBarWrap}>
                    <div className={styles.trendBarTrack}>
                      <div
                        className={styles.trendBar}
                        style={{ height: `${Math.round((point.count / maxWeeklyCount) * 100)}%` }}
                        title={`${point.count} ביקורות`}
                      />
                    </div>
                    <span className={styles.trendBarValue}>{point.count}</span>
                    <span className={styles.trendBarLabel}>{formatWeekLabel(point.weekStart)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
