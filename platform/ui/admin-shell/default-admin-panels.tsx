import React from 'react';
import type { AdminPanelItem } from './admin-panel-item-type.js';
import styles from './admin-shell.module.scss';

type PlaceholderPanelProps = {
  icon: string;
  title: string;
  description: string;
};

function PlaceholderPanel({ icon, title, description }: PlaceholderPanelProps) {
  return (
    <div className={styles.panelCard}>
      <div className={styles.panelIcon}>{icon}</div>
      <h2 className={styles.panelTitle}>{title}</h2>
      <p className={styles.panelDescription}>{description}</p>
    </div>
  );
}

function UsersPanel() {
  return (
    <PlaceholderPanel
      icon="👥"
      title="ניהול משתמשים"
      description="ניהול תפקידים: חבר, כותב, מודרטור ואדמין."
    />
  );
}

function ToolboxPanel() {
  return (
    <PlaceholderPanel
      icon="🧰"
      title="ניהול כלים"
      description="אישור הגשות, עריכה ותיוג של כלים בארגז הכלים."
    />
  );
}

function BlogPanel() {
  return (
    <PlaceholderPanel
      icon="📝"
      title="ניהול בלוג"
      description="אישור כתבות, ניהול כותבים ודשבורד תוכן."
    />
  );
}

function ModerationPanel() {
  return (
    <PlaceholderPanel
      icon="🛡️"
      title="מודרציה"
      description="תור תגובות שדווחו וטיפול בתוכן פוגעני."
    />
  );
}

/**
 * default set of admin panels shown when no panels are registered yet.
 * used only as fallback mock content — real panels are supplied by
 * feature aspects through the platform's AdminPanel slot.
 */
export const DEFAULT_ADMIN_PANELS: AdminPanelItem[] = [
  { id: `users`, label: `ניהול משתמשים`, path: `/admin/users`, component: UsersPanel },
  { id: `toolbox`, label: `ניהול כלים`, path: `/admin/toolbox`, component: ToolboxPanel },
  { id: `blog`, label: `ניהול בלוג`, path: `/admin/blog`, component: BlogPanel },
  {
    id: `moderation`,
    label: `מודרציה`,
    path: `/admin/moderation`,
    component: ModerationPanel,
    roles: [`moderator`, `admin`],
  },
];
