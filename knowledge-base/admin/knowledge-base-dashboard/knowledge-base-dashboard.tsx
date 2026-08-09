import React from 'react';
import classNames from 'classnames';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Card } from '@helemclub/design.content.card';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import type { KnowledgeBaseDashboardStats } from './knowledge-base-dashboard-stats-type.js';
import type { KnowledgeBaseDashboardMockUser } from './knowledge-base-dashboard-mock-user-type.js';
import styles from './knowledge-base-dashboard.module.scss';

const GET_VIEW_STATS_QUERY = gql`
  query GetKnowledgeBaseViewStats {
    getKnowledgeBaseViewStats {
      totalViews
      registeredViews
    }
  }
`;

type GetViewStatsData = {
  getKnowledgeBaseViewStats: KnowledgeBaseDashboardStats | null;
};

const DEFAULT_ALLOWED_ROLES: ('member' | 'writer' | 'moderator' | 'admin')[] = ['moderator', 'admin'];

const numberFormatter = new Intl.NumberFormat(`he-IL`);
function formatNumber(value: number) {
  return numberFormatter.format(value);
}

export type KnowledgeBaseDashboardProps = {
  /**
   * roles allowed to access this admin panel.
   */
  allowedRoles?: ('member' | 'writer' | 'moderator' | 'admin')[];

  /**
   * provide a mock signed-in user to bypass the auth request. useful for
   * tests and compositions. pass null to simulate a signed-out state.
   */
  mockUser?: KnowledgeBaseDashboardMockUser | null;

  /**
   * provide mock stats data to bypass the GraphQL query, useful for tests
   * and previews.
   */
  mockStats?: KnowledgeBaseDashboardStats;

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
 * knowledge-base admin engagement dashboard: total views across every media
 * record, split between signed-in members and anonymous visitors. restricted
 * to moderators and admins. RTL.
 */
export function KnowledgeBaseDashboard({
  allowedRoles = DEFAULT_ALLOWED_ROLES,
  mockUser,
  mockStats,
  className,
  style,
}: KnowledgeBaseDashboardProps) {
  return (
    <ProtectedRoute allowedRoles={allowedRoles} mockData={mockUser}>
      <KnowledgeBaseDashboardContent mockStats={mockStats} className={className} style={style} />
    </ProtectedRoute>
  );
}

type KnowledgeBaseDashboardContentProps = {
  mockStats?: KnowledgeBaseDashboardStats;
  className?: string;
  style?: React.CSSProperties;
};

function KnowledgeBaseDashboardContent({ mockStats, className, style }: KnowledgeBaseDashboardContentProps) {
  const hasMockStats = mockStats !== undefined;
  const { data, loading, error } = useQuery<GetViewStatsData>(GET_VIEW_STATS_QUERY, { skip: hasMockStats });

  const stats = hasMockStats ? mockStats : data?.getKnowledgeBaseViewStats ?? undefined;
  const totalViews = stats?.totalViews || 0;
  const registeredViews = stats?.registeredViews || 0;
  const anonymousViews = Math.max(0, totalViews - registeredViews);

  const isLoading = !hasMockStats && loading;
  const hasError = !hasMockStats && Boolean(error);

  return (
    <div className={classNames(styles.dashboard, className)} style={style}>
      <div className={styles.header}>
        <div className={styles.eyebrow}>ניהול תוכן</div>
        <h1 className={styles.title}>דשבורד מאגר הידע</h1>
        <p className={styles.subtitle}>
          סך הצפיות במאגר הידע, מפולח בין חברי קהילה מחוברים למבקרים אנונימיים.
        </p>
      </div>

      {isLoading && <div className={styles.stateMessage}>טוען נתונים...</div>}
      {hasError && <div className={styles.stateMessage}>אירעה שגיאה בטעינת הנתונים.</div>}

      {!isLoading && !hasError && (
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
        </div>
      )}
    </div>
  );
}
