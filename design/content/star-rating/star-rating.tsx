import React, { useState } from 'react';
import classNames from 'classnames';
import styles from './star-rating.module.scss';

const FULL_STAR = `★`;

export type StarRatingProps = {
  /**
   * the rating value to display, from 0 to `maxStars`. supports decimal values
   * (e.g. 3.5) to render partially filled stars in read-only mode.
   */
  value?: number;

  /**
   * total number of stars in the scale.
   */
  maxStars?: number;

  /**
   * total number of submitted ratings. when provided, it is rendered next to
   * the average value in read-only mode (e.g. "(128)").
   */
  ratingCount?: number;

  /**
   * star size, in pixels.
   */
  size?: number;

  /**
   * renders the numeric average value next to the stars.
   */
  showValue?: boolean;

  /**
   * enables interactive input mode, letting the user pick and submit a
   * rating by clicking a star. renders a read-only display by default.
   */
  interactive?: boolean;

  /**
   * called with the newly selected rating when the user clicks a star in
   * interactive mode.
   */
  onChange?: (value: number) => void;

  /**
   * disables interaction while `interactive` is true, e.g. while a rating is being submitted.
   */
  disabled?: boolean;

  /**
   * accessible label used to describe the rating control.
   */
  label?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

export function StarRating({
  value = 0,
  maxStars = 5,
  ratingCount,
  size = 18,
  showValue = false,
  interactive = false,
  onChange,
  disabled = false,
  label = `דירוג`,
  className,
  style,
}: StarRatingProps) {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const stars = Array.from({ length: maxStars }, (_unused, index) => index + 1);
  const activeValue = interactive ? hoverValue ?? value : value;
  const clampedValue = Math.max(0, Math.min(maxStars, activeValue));

  const handleSelect = (starValue: number) => {
    if (disabled) return;
    onChange?.(starValue);
  };

  if (interactive) {
    return (
      <span
        className={classNames(styles.starRating, disabled && styles.disabled, className)}
        style={style}
      >
        <span
          className={styles.interactiveStars}
          style={{ fontSize: size }}
          role="radiogroup"
          aria-label={label}
        >
          {stars.map((starValue) => {
            const isFilled = starValue <= clampedValue;
            return (
              <button
                key={starValue}
                type="button"
                className={classNames(styles.starButton, isFilled && styles.starButtonFilled)}
                disabled={disabled}
                role="radio"
                aria-checked={starValue === Math.round(value)}
                aria-label={`${label} ${starValue} מתוך ${maxStars}`}
                onMouseEnter={() => setHoverValue(starValue)}
                onMouseLeave={() => setHoverValue(null)}
                onFocus={() => setHoverValue(starValue)}
                onBlur={() => setHoverValue(null)}
                onClick={() => handleSelect(starValue)}
              >
                {FULL_STAR}
              </button>
            );
          })}
        </span>
        {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
      </span>
    );
  }

  const percentFilled = (clampedValue / maxStars) * 100;

  return (
    <span className={classNames(styles.starRating, className)} style={style}>
      <span
        className={styles.starsWrapper}
        style={{ fontSize: size }}
        aria-label={`${label}: ${value.toFixed(1)} מתוך ${maxStars}`}
      >
        <span className={styles.starsBase}>{FULL_STAR.repeat(maxStars)}</span>
        <span className={styles.starsFilled} style={{ width: `${percentFilled}%` }}>
          {FULL_STAR.repeat(maxStars)}
        </span>
      </span>
      {showValue && <span className={styles.value}>{value.toFixed(1)}</span>}
      {typeof ratingCount === 'number' && (
        <span className={styles.count}>({ratingCount.toLocaleString(`he-IL`)})</span>
      )}
    </span>
  );
}
