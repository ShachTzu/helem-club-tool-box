import type { ComponentType } from 'react';
import type { SlotRegistry } from '@bitdev/harmony.harmony';

export interface HomeSection {
  /**
   * unique identifier of the home section.
   */
  id: string;

  /**
   * component rendered for this home section (e.g. a feature preview or the
   * community-wisdom hub). rendered full-width in the home page flow.
   */
  component: ComponentType;

  /**
   * relative order of the section among the other registered home sections,
   * lower values render first.
   */
  order?: number;
}

export type HomeSectionSlot = SlotRegistry<HomeSection[]>;
