import type { CSSProperties } from 'react';
import type { IconSize, IconColor, IconVariant } from '@helemclub/design.content.icon';

/**
 * shared props for the toolbox icon set.
 * mirrors the underlying `Icon` component API while fixing the path/shape
 * per icon.
 */
export type ToolboxIconProps = {
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
   * stroke width used when `variant` is `stroke`.
   */
  strokeWidth?: number;

  /**
   * accessible label. when omitted the icon is treated as decorative.
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
