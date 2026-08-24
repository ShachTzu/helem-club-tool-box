import type { ComponentType } from 'react';
import { EditorialDashboard } from './editorial-dashboard.js';

/**
 * platform user roles, ordered by increasing privilege. declared locally
 * to avoid depending on the platform entities package directly.
 */
export type EditorialDashboardAdminRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * shape expected by the platform's admin shell `AdminPanel` slot.
 */
export type EditorialDashboardAdminPanelItem = {
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
  roles?: EditorialDashboardAdminRole[];
};

const EDITORIAL_DASHBOARD_ADMIN_ROLES: EditorialDashboardAdminRole[] = ['admin'];

/**
 * registers the editorial dashboard as an admin panel entry, to be plugged
 * into the platform's admin shell `AdminPanel` slot via `registerAdminRoute`.
 * restricted to admins.
 */
export const editorialDashboardAdminPanel: EditorialDashboardAdminPanelItem = {
  id: `editorial-dashboard`,
  label: `לוח עריכה`,
  path: `/admin/editorial-dashboard`,
  component: EditorialDashboard,
  roles: EDITORIAL_DASHBOARD_ADMIN_ROLES,
};
