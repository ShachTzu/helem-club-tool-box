import type { CSSProperties } from 'react';
import type { IconSize, IconColor, IconVariant } from '@helemclub/design.content.icon';

/**
 * shared props for all icons in the events icon set.
 */
export type EventIconProps = {
  /**
   * icon size, either a themed keyword or an explicit pixel value.
   */
  size?: IconSize | number;

  /**
   * themed icon color, mapped to a design token.
   */
  color?: IconColor;

  /**
   * whether the icon is drawn as an outline (stroke) or a solid shape (fill).
   */
  variant?: IconVariant;

  /**
   * accessible label for the icon. when omitted the icon is treated as decorative.
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
