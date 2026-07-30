import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export interface AdminRoute {
  /**
   * sub-path for the admin section route.
   */
  path: string;

  /**
   * display label for admin section link.
   */
  label: string;

  /**
   * React component to render in the admin panel.
   */
  component: ComponentType;
}

export type AdminRouteSlot = SlotRegistry<AdminRoute[]>;
