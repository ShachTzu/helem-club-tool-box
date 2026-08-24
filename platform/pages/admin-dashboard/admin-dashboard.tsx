import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Card } from '@helemclub/design.content.card';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { AdminShell, DEFAULT_ADMIN_PANELS, type AdminPanelItem, type AdminShellProps } from '@helemclub/platform.ui.admin-shell';
import type { AdminDashboardMetric } from './admin-dashboard-metric-type.js';
import { DEFAULT_ADMIN_DASHBOARD_METRICS } from './admin-dashboard.mock.js';
import { usePendingMembersCount } from './use-pending-members-count.js';
import styles from './admin-dashboard.module.scss';

/**
 * panel ids that represent the membership approval queue. the browser runtime
 * registers this panel under the `users` path, and the shell's fallback panels
 * use the same id.
 */
const MEMBERSHIP_PANEL_IDS = [`users`, `אישור חברים`];

export type AdminDashboardProps = {
  /**
   * admin panels registered by feature aspects through the platform's
   * AdminPanel slot. rendered inside the admin-shell navigation.
   */
  panels?: AdminPanelItem[];

  /**
   * summary metrics shown in the overview section at the top of the page.
   */
  metrics?: AdminDashboardMetric[];

  /**
   * mock data for the current user, bypasses the auth query. useful for
   * tests and previews. pass null to simulate a signed-out state.
   */
  mockUser?: AdminShellProps['mockUser'];

  /**
   * overrides the pending-members count, bypassing the GraphQL query. useful
   * for tests and previews that need a predictable badge.
   */
  mockPendingCount?: number;

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
 * admin dashboard page, mounted at /admin and protected for moderators and
 * admins. shows a summary overview of key platform metrics followed by the
 * admin-shell listing every registered admin panel.
 */
export function AdminDashboard({
  panels = DEFAULT_ADMIN_PANELS,
  metrics = DEFAULT_ADMIN_DASHBOARD_METRICS,
  mockUser,
  mockPendingCount,
  className,
  style,
}: AdminDashboardProps) {
  const hasMockUser = mockUser !== undefined;
  const hasMockPendingCount = mockPendingCount !== undefined;

  // the query is always mounted (hooks cannot be conditional); the mock value
  // simply wins when supplied.
  const { count: queriedPendingCount } = usePendingMembersCount();
  const pendingCount = hasMockPendingCount ? mockPendingCount : queriedPendingCount;

  // surface the approval queue on the membership panel's nav entry, so a
  // moderator sees there is something waiting without opening the panel.
  const panelsWithBadges = useMemo(
    () =>
      panels.map((panel) =>
        MEMBERSHIP_PANEL_IDS.includes(panel.id) ? { ...panel, badgeCount: pendingCount } : panel
      ),
    [panels, pendingCount]
  );

  return (
    <ProtectedRoute
      redirectTo="/login"
      allowedRoles={['moderator', 'admin']}
      mockData={hasMockUser ? mockUser : undefined}
    >
      <div className={classNames(styles.page, className)} style={style}>
        <section className={styles.overview}>
          <div className={styles.eyebrow}>סקירה כללית</div>
          <h2 className={styles.overviewTitle}>מדדים מרכזיים</h2>
          <div className={styles.metricsGrid}>
            {metrics.map((metric) => (
              <Card key={metric.id} padding="medium" className={styles.metricCard}>
                <div className={styles.metricValue}>{metric.value}</div>
                <div className={styles.metricLabel}>{metric.label}</div>
              </Card>
            ))}
          </div>
        </section>

        <div className={styles.shell}>
          <AdminShell panels={panelsWithBadges} mockUser={hasMockUser ? mockUser : undefined} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
