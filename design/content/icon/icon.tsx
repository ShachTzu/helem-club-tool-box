import React, { type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './icon.module.scss';

export type IconSize = 'small' | 'medium' | 'large';

export type IconColor =
  | 'current'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'inverse'
  | 'white'
  | 'black';

export type IconVariant = 'stroke' | 'fill';

const SIZE_MAP: Record<IconSize, number> = {
  small: 16,
  medium: 24,
  large: 32,
};

export type IconProps = {
  /**
   * SVG path data (the `d` attribute) rendered as a single path.
   * Use `children` instead when the icon requires multiple shapes.
   */
  path?: string;

  /**
   * custom SVG content (path/circle/line elements) for icons
   * that cannot be expressed as a single path.
   */
  children?: ReactNode;

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
   * svg viewBox, defaults to a 24x24 grid.
   */
  viewBox?: string;

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

/**
 * Base icon component that renders an SVG path (or custom children) at a
 * themed size and color. Serves as the foundation for all per-scope icon sets.
 */
export function Icon({
  path,
  children,
  size = `medium`,
  color = `current`,
  variant = `stroke`,
  strokeWidth = 2,
  viewBox = `0 0 24 24`,
  title,
  className,
  style,
}: IconProps) {
  const pixelSize = typeof size === `number` ? size : SIZE_MAP[size];
  const isFill = variant === `fill`;

  const accessibilityProps = title
    ? { role: `img` as const, 'aria-label': title }
    : { 'aria-hidden': true as const };

  return (
    <svg
      {...accessibilityProps}
      className={classNames(styles.icon, styles[`color-${color}`], className)}
      style={{ width: pixelSize, height: pixelSize, ...style }}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {path ? (
        <path
          d={path}
          fill={isFill ? `currentColor` : `none`}
          stroke={isFill ? `none` : `currentColor`}
          strokeWidth={isFill ? undefined : strokeWidth}
          strokeLinecap={isFill ? undefined : `round`}
          strokeLinejoin={isFill ? undefined : `round`}
        />
      ) : (
        children
      )}
    </svg>
  );
}
