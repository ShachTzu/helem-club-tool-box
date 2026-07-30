import React from 'react';
import classNames from 'classnames';
import { Card } from '@helemclub/design.content.card';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { AdminShell, DEFAULT_ADMIN_PANELS, type AdminPanelItem, type AdminShellProps } from '@helemclub/platform.ui.admin-shell';
import type { AdminDashboardMetric } from './admin-dashboard-metric-type.js';
import { DEFAULT_ADMIN_DASHBOARD_METRICS } from './admin-dashboard.mock.js';
import styles from './admin-dashboard.module.scss';

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
  className,
  style,
}: AdminDashboardProps) {
  const hasMockUser = mockUser !== undefined;

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
          <AdminShell panels={panels} mockUser={hasMockUser ? mockUser : undefined} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
