import type { ComponentType } from 'react';
import type { HelamIconProps } from '@helemclub/platform.icons.helam-icons';

/**
 * a single primary navigation item rendered in the mobile bottom nav,
 * typically collected from the platform's NavigationItem slot.
 */
export type MobileNavItem = {
  /**
   * label shown under the icon.
   */
  label: string;

  /**
   * path this navigation item links to.
   */
  path: string;

  /**
   * icon rendered above the label.
   */
  icon?: ComponentType<HelamIconProps>;

  /**
   * relative ordering among navigation items, lower values render first.
   */
  order?: number;
};
