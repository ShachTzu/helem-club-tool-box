import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { AdminShell } from './admin-shell.js';
import type { AdminPanelItem } from './admin-panel-item-type.js';
import styles from './admin-shell.compositions.module.scss';

function GalleryPanel() {
  return (
    <div className={styles.customPanel}>
      <div className={styles.customPanelIcon}>🎨</div>
      <h2 className={styles.customPanelTitle}>ניהול גלריה</h2>
      <p className={styles.customPanelDescription}>אישור ופרסום יצירות מגלריית PTSDART.</p>
    </div>
  );
}

function EventsPanel() {
  return (
    <div className={styles.customPanel}>
      <div className={styles.customPanelIcon}>📅</div>
      <h2 className={styles.customPanelTitle}>ניהול אירועים</h2>
      <p className={styles.customPanelDescription}>יצירת אירועים, מעקב RSVP והעלאת הקלטות.</p>
    </div>
  );
}

const customPanels: AdminPanelItem[] = [
  { id: `events`, label: `ניהול אירועים`, path: `/admin/events`, component: EventsPanel },
  { id: `gallery`, label: `ניהול גלריה`, path: `/admin/gallery`, component: GalleryPanel },
];

export const AdminUserView = () => {
  const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });
  return (
    <MockProvider>
      <AdminShell mockUser={admin.toObject()} />
    </MockProvider>
  );
};

export const ModeratorWithCustomPanels = () => {
  const moderator = mockUser({ displayName: `דנה מודרטורית`, role: `moderator` });
  return (
    <MockProvider>
      <AdminShell mockUser={moderator.toObject()} panels={customPanels} />
    </MockProvider>
  );
};

export const WithPendingApprovalsBadge = () => {
  const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });
  const panelsWithQueue: AdminPanelItem[] = [
    { id: `users`, label: `אישור חברים`, path: `/admin/users`, component: EventsPanel, badgeCount: 7 },
    ...customPanels,
  ];
  return (
    <MockProvider>
      <AdminShell mockUser={admin.toObject()} panels={panelsWithQueue} />
    </MockProvider>
  );
};

export const RestrictedForMembers = () => {
  const member = mockUser({ displayName: `שם דו`, role: `member` });
  return (
    <MockProvider>
      <AdminShell mockUser={member.toObject()} />
    </MockProvider>
  );
};
