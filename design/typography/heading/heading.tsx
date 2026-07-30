import React from 'react';
import classNames from 'classnames';
import styles from './heading.module.scss';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export type HeadingColor = `primary` | `secondary` | `accent` | `default` | `muted` | `inverse`;

export type HeadingAlign = `right` | `left` | `center`;

const levelClassMap: Record<HeadingLevel, string> = {
  1: styles.level1,
  2: styles.level2,
  3: styles.level3,
  4: styles.level4,
  5: styles.level5,
  6: styles.level6,
};

const colorClassMap: Record<HeadingColor, string> = {
  primary: styles.colorPrimary,
  secondary: styles.colorSecondary,
  accent: styles.colorAccent,
  default: styles.colorDefault,
  muted: styles.colorMuted,
  inverse: styles.colorInverse,
};

const alignClassMap: Record<HeadingAlign, string> = {
  right: styles.right,
  left: styles.left,
  center: styles.center,
};

export type HeadingProps = {
  /**
   * heading level, mapped to the theme type scale (h1-h6).
   */
  level?: HeadingLevel;

  /**
   * override the rendered html element, decoupled from the visual `level`.
   */
  as?: keyof React.JSX.IntrinsicElements;

  /**
   * text color, mapped to theme color tokens.
   */
  color?: HeadingColor;

  /**
   * text alignment. defaults to `right` for RTL content.
   */
  align?: HeadingAlign;

  /**
   * heading content.
   */
  children?: React.ReactNode;

  /**
   * class name to override the heading style.
   */
  className?: string;

  /**
   * inline style for positioning and spacing overrides.
   */
  style?: React.CSSProperties;
};

/**
 * an RTL-friendly heading component. levels 1-6 are mapped to the theme type
 * scale, weight and color tokens, with a Hebrew-friendly line height.
 */
export function Heading({
  level = 1,
  as,
  color = `default`,
  align = `right`,
  children = `כותרת לדוגמה`,
  className,
  style,
}: HeadingProps) {
  const Element = (as || `h${level}`) as keyof React.JSX.IntrinsicElements;

  return (
    <Element
      className={classNames(
        styles.heading,
        levelClassMap[level],
        colorClassMap[color],
        alignClassMap[align],
        className
      )}
      style={style}
    >
      {children}
    </Element>
  );
}
