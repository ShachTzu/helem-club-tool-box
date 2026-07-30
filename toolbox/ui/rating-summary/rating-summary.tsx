import React from 'react';
import classNames from 'classnames';
import { StarRating } from '@helemclub/design.content.star-rating';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import styles from './rating-summary.module.scss';

const DEFAULT_RATING_HISTOGRAM = [2, 3, 6, 20, 65];

export type RatingSummaryProps = {
  /**
   * the average rating value, from 0 to `maxStars`.
   */
  averageRating?: number;

  /**
   * total number of submitted ratings.
   */
  ratingCount?: number;

  /**
   * histogram of ratings. index 0 represents 1 star, index 4 represents 5 stars.
   */
  ratingHistogram?: number[];

  /**
   * total number of stars in the scale.
   */
  maxStars?: number;

  /**
   * class name to override root styles.
   */
  className?: string;

  /**
   * style object for spacing and positioning overrides.
   */
  style?: React.CSSProperties;
};

export function RatingSummary({
  averageRating = 4.7,
  ratingCount = 96,
  ratingHistogram = DEFAULT_RATING_HISTOGRAM,
  maxStars = 5,
  className,
  style,
}: RatingSummaryProps) {
  const maxHistogramValue = Math.max(...ratingHistogram, 1);
  const starLevels = Array.from({ length: maxStars }, (_unused, index) => maxStars - index);

  return (
    <div className={classNames(styles.ratingSummary, className)} style={style}>
      <div className={styles.averageBlock}>
        <div className={styles.averageValue}>{averageRating.toFixed(1)}</div>
        <StarRating value={averageRating} maxStars={maxStars} size={18} />
        <Paragraph size="sm" muted className={styles.countText}>
          {`${ratingCount.toLocaleString(`he-IL`)} מדרגים`}
        </Paragraph>
      </div>
      <div className={styles.histogram}>
        {starLevels.map((star) => {
          const count = ratingHistogram[star - 1] ?? 0;
          const percent = (count / maxHistogramValue) * 100;
          return (
            <div key={star} className={styles.histogramRow}>
              <span className={styles.histogramLabel}>{`${star} ★`}</span>
              <div className={styles.histogramTrack}>
                <div className={styles.histogramFill} style={{ width: `${percent}%` }} />
              </div>
              <span className={styles.histogramCount}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
