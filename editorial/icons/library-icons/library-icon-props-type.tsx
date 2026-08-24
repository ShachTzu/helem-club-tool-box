import type { CSSProperties } from 'react';

/**
 * shared icon size options across the library-icons set.
 */
export type LibraryIconSize = 'small' | 'medium' | 'large' | number;

/**
 * shared icon color options across the library-icons set,
 * mapped to the design system color tokens.
 */
export type LibraryIconColor =
  | 'current'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'inverse'
  | 'white'
  | 'black';

export type LibraryIconsBaseProps = {
  /**
   * icon size, either a themed keyword or an explicit pixel value.
   */
  size?: LibraryIconSize;

  /**
   * themed icon color, mapped to a design token.
   */
  color?: LibraryIconColor;

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
