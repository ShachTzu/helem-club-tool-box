import type { CSSProperties } from 'react';

/**
 * Shared prop shape for every icon exported from the blog icon set.
 */
export type BlogIconProps = {
  /**
   * icon size, either a themed keyword or an explicit pixel value.
   */
  size?: 'small' | 'medium' | 'large' | number;

  /**
   * themed icon color, mapped to a design token.
   */
  color?: 'current' | 'primary' | 'secondary' | 'accent' | 'muted' | 'inverse' | 'white' | 'black';

  /**
   * whether the icon is drawn as an outline (stroke) or a solid shape (fill).
   */
  variant?: 'stroke' | 'fill';

  /**
   * accessible label for the icon.
   */
  title?: string;

  /**
   * class name for the icon root svg element.
   */
  className?: string;

  /**
   * style for the icon root svg element.
   */
  style?: CSSProperties;
};
