import type { ComponentType } from 'react';

/**
 * platform user roles, ordered by increasing privilege. mirrors the
 * platform's role hierarchy (member < writer < moderator < admin).
 */
export type AdminShellUserRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * a single admin panel entry, registered by a feature aspect through the
 * platform's `AdminPanel` slot.
 */
export type AdminPanelItem = {
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
   * roles allowed to view this panel. when omitted, any moderator/admin
   * user that can access the admin shell may view it.
   */
  roles?: AdminShellUserRole[];

  /**
   * number of open items awaiting attention in this panel, surfaced as a
   * count badge on the navigation entry. this exists so a moderator sees
   * there is a queue without opening every panel — a pending member who is
   * never noticed is a member stuck on a waiting screen.
   *
   * zero or undefined renders no badge, so a panel with nothing outstanding
   * stays visually quiet.
   */
  badgeCount?: number;
};
