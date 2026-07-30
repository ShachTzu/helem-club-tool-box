import type { ComponentType } from 'react';

/**
 * platform user roles allowed to view an admin panel, ordered by
 * increasing privilege (mirrors the platform's role hierarchy).
 */
export type GalleryAdminPanelRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * shape of an admin panel entry, matching the platform admin-shell's
 * `AdminPanel` slot contract. declared locally since the admin-shell
 * package itself is not a direct dependency of this component.
 */
export type GalleryAdminPanelItem = {
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
  roles?: GalleryAdminPanelRole[];
};
