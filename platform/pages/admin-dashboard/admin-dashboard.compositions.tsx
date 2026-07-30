import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import type { AdminPanelItem } from '@helemclub/platform.ui.admin-shell';
import { AdminDashboard } from './admin-dashboard.js';
import styles from './admin-dashboard.compositions.module.scss';

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

function DomainsPanel() {
  return (
    <div className={styles.customPanel}>
      <div className={styles.customPanelIcon}>🧭</div>
      <h2 className={styles.customPanelTitle}>ניהול דומיינים</h2>
      <p className={styles.customPanelDescription}>עריכת 14 תחומי ההתמודדות והתוכן שלהם.</p>
    </div>
  );
}

const customPanels: AdminPanelItem[] = [
  { id: `events`, label: `ניהול אירועים`, path: `/admin/events`, component: EventsPanel },
  { id: `gallery`, label: `ניהול גלריה`, path: `/admin/gallery`, component: GalleryPanel },
  { id: `domains`, label: `ניהול דומיינים`, path: `/admin/domains`, component: DomainsPanel },
];

export const AdminUserView = () => {
  const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });
  return (
    <MockProvider>
      <AdminDashboard mockUser={admin.toObject()} panels={customPanels} />
    </MockProvider>
  );
};

export const ModeratorView = () => {
  const moderator = mockUser({ displayName: `דנה מודרטורית`, role: `moderator` });
  return (
    <MockProvider>
      <AdminDashboard mockUser={moderator.toObject()} />
    </MockProvider>
  );
};

export const RestrictedForMembers = () => {
  const member = mockUser({ displayName: `שם דו`, role: `member` });
  return (
    <MockProvider>
      <AdminDashboard mockUser={member.toObject()} />
    </MockProvider>
  );
};
