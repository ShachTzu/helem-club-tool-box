import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export interface Route {
  /**
   * route path URL pattern.
   */
  path: string;

  /**
   * React component to render for this route.
   */
  component: ComponentType;

  /**
   * optional flag indicating whether authentication is required.
   */
  requiresAuth?: boolean;
}

export type RouteSlot = SlotRegistry<Route[]>;
