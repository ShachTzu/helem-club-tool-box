import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export interface HeaderAction {
  /**
   * unique identifier for the header action.
   */
  id: string;

  /**
   * React component to render in the header action area.
   */
  component: ComponentType;
}

export type HeaderActionSlot = SlotRegistry<HeaderAction[]>;
