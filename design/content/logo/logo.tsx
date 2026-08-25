import React, { useEffect, useRef, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import styles from './logo.module.scss';
import { resolveAssetSrc, alternateAssetSrc } from './resolve-asset-src.js';
import darkSurfaceMark from './assets/logo-horizontal-white.png';
import lightSurfaceMark from './assets/logo-horizontal-dark.png';

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

/**
 * maps each color variant to the artwork that reads correctly on that surface.
 * the `dark` variant sits on dark surfaces, so it uses the white mark, and vice versa.
 */
const markSrcMap: Record<LogoVariant, string> = {
  dark: resolveAssetSrc(darkSurfaceMark),
  light: resolveAssetSrc(lightSurfaceMark),
};

/**
 * the Helam Club wordmark logo, linking to the homepage.
 * supports light/dark color variants and multiple sizes for the header, footer and other surfaces.
 */
export function Logo({ href = `/`, size = `medium`, variant = `dark`, className, style }: LogoProps) {
  const primarySrc = markSrcMap[variant];
  const [src, setSrc] = useState(primarySrc);
  const imgRef = useRef<HTMLImageElement>(null);
  const triedFallback = useRef(false);

  // reset when the variant switches, so a previous fallback isn't carried over.
  useEffect(() => {
    triedFallback.current = false;
    setSrc(primarySrc);
  }, [primarySrc]);

  /**
   * the dev server and the deployed container mount bundled assets under
   * different static roots, so the url baked in at build time 404s in one of
   * them. retries at most once against the counterpart root rather than
   * leaving a broken image in the header, or bouncing forever if both roots
   * happen to be unavailable.
   */
  const fallbackToAlternate = () => {
    if (triedFallback.current) return;
    const fallback = alternateAssetSrc(src);
    if (!fallback || fallback === src) return;
    triedFallback.current = true;
    setSrc(fallback);
  };

  // the image is server-rendered with `primarySrc` before React hydrates, so a
  // load failure can happen before the `onError` handler below is even
  // attached — the browser never re-fires the event once a listener shows up
  // late, which is what left the logo permanently broken in production.
  // checking the already-settled `<img>` state right after mount catches that
  // missed failure and swaps to the working static root.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth === 0) fallbackToAlternate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);

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
      <img ref={imgRef} src={src} alt="" className={styles.mark} onError={fallbackToAlternate} />
    </RouterLink>
  );
}
