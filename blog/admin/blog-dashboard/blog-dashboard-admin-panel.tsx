import type { ComponentType } from 'react';
import { BlogDashboard } from './blog-dashboard.js';

/**
 * platform user roles, ordered by increasing privilege. declared locally
 * to avoid depending on the platform entities package directly.
 */
export type BlogDashboardAdminRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * shape expected by the platform's admin shell `AdminPanel` slot.
 */
export type BlogDashboardAdminPanelItem = {
  /**
   * unique identifier of the admin panel.
   */
  id: string;

  /**
   * label shown in the admin navigation.
   */
  label: string;

  /**
   * path used to select and deep-link to this panel.
   */
  path: string;

  /**
   * component rendered when the panel is active.
   */
  component: ComponentType;

  /**
   * roles allowed to view this panel.
   */
  roles?: BlogDashboardAdminRole[];
};

const BLOG_DASHBOARD_ADMIN_ROLES: BlogDashboardAdminRole[] = ['admin'];

/**
 * registers the blog dashboard as an admin panel entry, to be plugged into
 * the platform's admin shell `AdminPanel` slot. restricted to admins.
 */
export const blogDashboardAdminPanel: BlogDashboardAdminPanelItem = {
  id: `blog-dashboard`,
  label: `דשבורד בלוג`,
  path: `/admin/blog-dashboard`,
  component: BlogDashboard,
  roles: BLOG_DASHBOARD_ADMIN_ROLES,
};
