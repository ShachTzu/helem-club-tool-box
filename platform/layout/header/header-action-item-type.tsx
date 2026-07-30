import type { ComponentType } from 'react';

/**
 * a header action entry rendered next to the search and user bar, matching
 * the platform's `HeaderAction` slot signature so feature aspects can
 * register actions directly.
 */
export type HeaderActionItem = {
  /**
   * unique identifier of the header action.
   */
  id: string;

  /**
   * the component rendered for this header action.
   */
  component: ComponentType;
};
