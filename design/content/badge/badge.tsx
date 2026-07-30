import React, { type ReactNode } from 'react';
import classNames from 'classnames';
import type { BadgeVariant } from './badge-variant-type.js';
import styles from './badge.module.scss';

export type BadgeProps = {
  /**
   * content rendered inside the badge, e.g. a label or a count.
   */
  children?: ReactNode;

  /**
   * color variant of the badge.
   */
  variant?: BadgeVariant;

  /**
   * renders a small dot indicator before the content.
   */
  showDot?: boolean;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

const variantToClassName = {
  neutral: styles.neutral,
  accent: styles.accent,
  success: styles.success,
  warning: styles.warning,
  danger: styles.danger,
};

export function Badge({ children = `חדש`, variant = 'neutral', showDot = false, className, style }: BadgeProps) {
  return (
    <span className={classNames(styles.badge, variantToClassName[variant], className)} style={style}>
      {showDot && <span className={styles.dot} />}
      {children}
    </span>
  );
}
