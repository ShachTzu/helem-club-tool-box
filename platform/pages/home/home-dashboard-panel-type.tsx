import type { ComponentType } from 'react';

/**
 * a single dashboard panel entry, registered by a feature aspect through the
 * platform's `DashboardPanel` slot and rendered above the marketing content
 * for signed-in members.
 */
export type HomeDashboardPanel = {
  /**
   * unique identifier of the dashboard panel.
   */
  id: string;

  /**
   * component rendered for this panel.
   */
  component: ComponentType;

  /**
   * relative order of the panel among the other registered panels, lower
   * values render first.
   */
  order?: number;
};
