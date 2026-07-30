import React, { type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import { LoadingSpinnerIcon } from './loading-spinner-icon.js';
import styles from './button.module.scss';

export type ButtonVariant = `primary` | `accent` | `secondary` | `ghost` | `danger`;

export type ButtonSize = `sm` | `md` | `lg`;

export type ButtonProps = {
  /**
   * the button content.
   */
  children?: ReactNode;

  /**
   * the visual style of the button.
   */
  variant?: ButtonVariant;

  /**
   * the size of the button.
   */
  size?: ButtonSize;

  /**
   * renders the button as a link pointing to this destination.
   */
  href?: string;

  /**
   * marks the destination as external, opening in a new tab.
   */
  external?: boolean;

  /**
   * disables the button, preventing interaction.
   */
  disabled?: boolean;

  /**
   * shows a loading indicator and disables interaction.
   */
  loading?: boolean;

  /**
   * stretches the button to the full width of its container.
   */
  fullWidth?: boolean;

  /**
   * an icon rendered before the label (start side, RTL-aware).
   */
  leadingIcon?: ReactNode;

  /**
   * an icon rendered after the label (end side, RTL-aware).
   */
  trailingIcon?: ReactNode;

  /**
   * the native button type, used when the button is not rendered as a link.
   */
  type?: `button` | `submit` | `reset`;

  /**
   * handler called when the button is clicked.
   */
  onClick?: () => void;

  /**
   * class name for the button.
   */
  className?: string;

  /**
   * inline style for the button.
   */
  style?: CSSProperties;
};

/**
 * a themed, RTL-friendly button supporting five variants, three sizes,
 * loading/disabled states, leading/trailing icons and link rendering.
 */
export function Button({
  children,
  variant = `primary`,
  size = `md`,
  href,
  external,
  disabled = false,
  loading = false,
  fullWidth = false,
  leadingIcon,
  trailingIcon,
  type = `button`,
  onClick,
  className,
  style,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const buttonClassName = classNames(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    isDisabled && styles.disabled,
    loading && styles.loading,
    className
  );

  const content = (
    <>
      {loading && (
        <span className={styles.spinner}>
          <LoadingSpinnerIcon />
        </span>
      )}
      <span className={classNames(styles.label, loading && styles.labelHidden)}>
        {leadingIcon && <span className={styles.icon}>{leadingIcon}</span>}
        {children}
        {trailingIcon && <span className={styles.icon}>{trailingIcon}</span>}
      </span>
    </>
  );

  if (href && !isDisabled) {
    const isExternal = external ?? /^https?:\/\//.test(href);
    const target = isExternal ? `_blank` : undefined;
    const rel = isExternal ? `noopener noreferrer` : undefined;

    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={buttonClassName}
        style={style}
        onClick={() => onClick?.()}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={buttonClassName}
      style={style}
      aria-busy={loading}
      onClick={() => onClick?.()}
    >
      {content}
    </button>
  );
}
