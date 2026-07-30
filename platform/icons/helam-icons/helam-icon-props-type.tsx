import type { CSSProperties } from 'react';

/**
 * shared icon size options across the helam-icons set.
 */
export type HelamIconSize = 'small' | 'medium' | 'large' | number;

/**
 * shared icon color options across the helam-icons set,
 * mapped to the design system color tokens.
 */
export type HelamIconColor =
  | 'current'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'inverse'
  | 'white'
  | 'black';

export type HelamIconProps = {
  /**
   * icon size, either a themed keyword or an explicit pixel value.
   */
  size?: HelamIconSize;

  /**
   * themed icon color, mapped to a design token.
   */
  color?: HelamIconColor;

  /**
   * class name for the icon root svg element.
   */
  className?: string;

  /**
   * style for the icon root svg element.
   */
  style?: CSSProperties;

  /**
   * accessible label. when omitted the icon is treated as decorative.
   */
  title?: string;
};
