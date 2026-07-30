import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import type { HomeDashboardPanel } from './home-dashboard-panel-type.js';
import { Home } from './home.js';
import styles from './home.compositions.module.scss';

function MyToolboxPanel() {
  return (
    <div className={styles.panelCard}>
      <div className={styles.panelIcon}>🧰</div>
      <h3 className={styles.panelTitle}>ארגז הכלים שלי</h3>
      <p className={styles.panelDescription}>3 אפליקציות שסימנתם לאחרונה, מוכנות בלחיצה אחת.</p>
    </div>
  );
}

function UpcomingEventsPanel() {
  return (
    <div className={styles.panelCard}>
      <div className={styles.panelIcon}>📅</div>
      <h3 className={styles.panelTitle}>האירועים הקרובים שלך</h3>
      <p className={styles.panelDescription}>שולחן עגול בנושא חרדה — יום שלישי, 20:00.</p>
    </div>
  );
}

const mockPanels: HomeDashboardPanel[] = [
  { id: `toolbox`, component: MyToolboxPanel, order: 1 },
  { id: `events`, component: UpcomingEventsPanel, order: 2 },
];

export const BasicHome = () => {
  return (
    <MockProvider>
      <Home mockUser={null} />
    </MockProvider>
  );
};

export const AuthenticatedHomeWithDashboardPanels = () => {
  const member = mockUser({ displayName: `נועה לוי`, role: `member` });
  return (
    <MockProvider>
      <Home mockUser={member.toObject()} dashboardPanels={mockPanels} />
    </MockProvider>
  );
};

export const AuthenticatedHomeWithoutPanels = () => {
  const member = mockUser({ displayName: `דני כהן`, role: `writer` });
  return (
    <MockProvider>
      <Home mockUser={member.toObject()} />
    </MockProvider>
  );
};
