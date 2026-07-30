import type { SlotRegistry } from '@bitdev/harmony.harmony';

export interface NavigationItem {
  /**
   * display label for the navigation item.
   */
  label: string;

  /**
   * target URL path for the link.
   */
  href: string;

  /**
   * optional sort order for item placement.
   */
  order?: number;
}

export type NavigationItemSlot = SlotRegistry<NavigationItem[]>;