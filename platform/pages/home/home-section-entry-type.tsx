import type { ComponentType } from 'react';

/**
 * a single home-page section entry, registered by a feature aspect through the
 * platform's `HomeSection` slot and rendered full-width in the home page flow
 * below the ecosystem overview (e.g. the community-wisdom hub and feature
 * previews).
 */
export type HomeSectionEntry = {
  /**
   * unique identifier of the home section.
   */
  id: string;

  /**
   * component rendered for this section.
   */
  component: ComponentType;

  /**
   * relative order of the section among the other registered sections, lower
   * values render first.
   */
  order?: number;
};
