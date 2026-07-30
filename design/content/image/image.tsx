import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import styles from './image.module.scss';

export type ImageRounded = 'none' | 'small' | 'medium' | 'large' | 'pill';

export type ImageObjectFit = 'cover' | 'contain' | 'fill';

export type ImageProps = {
  /**
   * the image source url.
   */
  src?: string;

  /**
   * alternative text for the image.
   */
  alt?: string;

  /**
   * the aspect ratio of the image container, e.g. "16 / 9" or "1 / 1".
   */
  aspectRatio?: string;

  /**
   * the object-fit behavior of the image.
   */
  objectFit?: ImageObjectFit;

  /**
   * the border radius applied to the image.
   */
  rounded?: ImageRounded;

  /**
   * the native loading strategy for the image.
   */
  loading?: 'lazy' | 'eager';

  /**
   * handler called once the image finishes loading.
   */
  onLoad?: () => void;

  /**
   * handler called if the image fails to load.
   */
  onError?: () => void;

  /**
   * a class name to override root styles.
   */
  className?: string;

  /**
   * a style object to override root styles.
   */
  style?: React.CSSProperties;
};

const roundedClassMap: Record<ImageRounded, string> = {
  none: styles.roundedNone,
  small: styles.roundedSmall,
  medium: styles.roundedMedium,
  large: styles.roundedLarge,
  pill: styles.roundedPill,
};

export function Image({
  src = `https://storage.googleapis.com/bit-generated-images/images/image_a_serene_abstract_watercolor_p_0_1785186182329.png`,
  alt = `תמונה מקהילת הלם קלאב`,
  aspectRatio = `16 / 9`,
  objectFit = `cover`,
  rounded = `medium`,
  loading = `lazy`,
  onLoad,
  onError,
  className,
  style,
}: ImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // when the image is served from cache or already loaded during SSR/hydration,
  // the native `load` event may fire before React attaches `onLoad`. detect that
  // case on mount by reading the element's `complete` flag so the image doesn't
  // stay stuck at opacity 0.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [src]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
    onError?.();
  };

  return (
    <div
      className={classNames(styles.imageContainer, roundedClassMap[rounded], className)}
      style={{ ...style, aspectRatio }}
    >
      {!isLoaded && <div className={styles.skeleton} />}
      {!hasError && (
        <img
          ref={imgRef}
          className={classNames(styles.image, isLoaded ? styles.imageVisible : styles.imageHidden)}
          src={src}
          alt={alt}
          loading={loading}
          style={{ objectFit }}
          onLoad={() => handleLoad()}
          onError={() => handleError()}
        />
      )}
      {hasError && (
        <div className={styles.errorState}>
          <span className={styles.errorLabel}>לא ניתן לטעון את התמונה</span>
        </div>
      )}
    </div>
  );
}
