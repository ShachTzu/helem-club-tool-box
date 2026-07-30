import React, { type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import { Button, type ButtonSize } from '@helemclub/design.actions.button';
import styles from './cta-button.module.scss';

export type CtaButtonProps = {
  /**
   * the button label content.
   */
  children?: ReactNode;

  /**
   * renders the button as a link pointing to this destination.
   */
  href?: string;

  /**
   * marks the destination as external, opening in a new tab.
   */
  external?: boolean;

  /**
   * the size of the button.
   */
  size?: ButtonSize;

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
   * an icon rendered after the label (end side, RTL-aware).
   */
  icon?: ReactNode;

  /**
   * the native button type, used when the button is not rendered as a link.
   */
  type?: `button` | `submit` | `reset`;

  /**
   * handler called when the button is clicked.
   */
  onClick?: () => void;

  /**
   * class name for the button wrapper.
   */
  className?: string;

  /**
   * inline style for the button wrapper.
   */
  style?: CSSProperties;
};

/**
 * a large amber call-to-action button built on top of the base button,
 * with a subtle glow effect on hover. used to drive attention in hero
 * and section CTAs across the Helam Club ecosystem.
 */
export function CtaButton({
  children = `הצטרפו עכשיו`,
  href,
  external,
  size = `lg`,
  disabled = false,
  loading = false,
  fullWidth = false,
  icon,
  type = `button`,
  onClick,
  className,
  style,
}: CtaButtonProps) {
  return (
    <span
      className={classNames(styles.wrapper, fullWidth && styles.fullWidth, className)}
      style={style}
    >
      <span className={styles.content}>
        <Button
          variant="accent"
          size={size}
          href={href}
          external={external}
          disabled={disabled}
          loading={loading}
          fullWidth={fullWidth}
          trailingIcon={icon}
          type={type}
          onClick={() => onClick?.()}
        >
          {children}
        </Button>
      </span>
    </span>
  );
}
