import type { ComponentType } from 'react';
import type { UserRole } from '@helemclub/platform.entities.user';

/**
 * a single user menu entry registered by a feature aspect through the
 * platform's `UserMenuItem` slot, rendered inside the user bar dropdown
 * for authenticated users.
 */
export type UserBarUserMenuItem = {
  /**
   * label shown in the dropdown menu.
   */
  label: string;

  /**
   * path navigated to when the item is selected.
   */
  path: string;

  /**
   * optional icon component rendered next to the label.
   */
  icon?: ComponentType;

  /**
   * roles allowed to see this item. when omitted, any signed-in user may see it.
   */
  roles?: UserRole[];
};
