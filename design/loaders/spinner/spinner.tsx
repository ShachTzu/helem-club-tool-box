import React from 'react';
import classNames from 'classnames';
import styles from './spinner.module.scss';

export type SpinnerSize = 'small' | 'medium' | 'large' | 'xLarge';

export type SpinnerProps = {
  /**
   * size variant of the spinner.
   */
  size?: SpinnerSize;

  /**
   * accessible label announced to screen readers while loading.
   */
  label?: string;

  /**
   * optional text rendered below the spinner.
   */
  message?: string;

  /**
   * class name to override or extend the spinner styles.
   */
  className?: string;

  /**
   * style to override or extend the spinner styles.
   */
  style?: React.CSSProperties;
};

export function Spinner({
  size = 'medium',
  label = `טוען...`,
  message,
  className,
  style,
}: SpinnerProps) {
  return (
    <div className={classNames(styles.spinnerContainer, className)} style={style}>
      <span
        className={classNames(styles.spinner, styles[size])}
        role="status"
        aria-label={label}
      >
        <span className={styles.track} />
        <span className={styles.arc} />
      </span>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
}
