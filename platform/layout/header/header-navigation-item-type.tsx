import type { ComponentType } from 'react';

/**
 * a primary navigation entry rendered in the header, matching the platform's
 * `NavigationItem` slot signature so feature aspects can register items directly.
 */
export type HeaderNavigationItem = {
  /**
   * label shown for the navigation item.
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
   * controls the relative ordering of the item among other navigation items.
   */
  order?: number;
};
