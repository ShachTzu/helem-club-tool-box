import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './logo.module.scss';

export type LogoSize = `small` | `medium` | `large`;

export type LogoVariant = `light` | `dark`;

export type LogoProps = {
  /**
   * the destination the logo links to.
   */
  href?: string;

  /**
   * controls the wordmark size.
   */
  size?: LogoSize;

  /**
   * controls the color variant of the logo.
   * `dark` renders an inverse (light) wordmark for use on dark surfaces like the header and footer.
   * `light` renders the wordmark using the primary text color, for use on light surfaces.
   */
  variant?: LogoVariant;

  /**
   * class name for the logo.
   */
  className?: string;

  /**
   * inline style for the logo.
   */
  style?: React.CSSProperties;
};

const sizeClassMap: Record<LogoSize, string> = {
  small: styles.sizeSmall,
  medium: styles.sizeMedium,
  large: styles.sizeLarge,
};

const markSrcMap: Record<LogoVariant, string> = {
  dark: `/logo-horizontal-white.png`,
  light: `/logo-horizontal-dark.png`,
};

/**
 * the Helam Club wordmark logo, linking to the homepage.
 * supports light/dark color variants and multiple sizes for the header, footer and other surfaces.
 */
export function Logo({ href = `/`, size = `medium`, variant = `dark`, className, style }: LogoProps) {
  return (
    <RouterLink
      to={href}
      className={classNames(
        styles.logo,
        sizeClassMap[size],
        variant === `light` ? styles.light : styles.dark,
        className
      )}
      style={style}
      aria-label="הלם קלאב"
    >
      <img src={markSrcMap[variant]} alt="" className={styles.mark} />
    </RouterLink>
  );
}
