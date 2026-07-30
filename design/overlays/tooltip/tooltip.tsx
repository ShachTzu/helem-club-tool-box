import React, { useId, useState, type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './tooltip.module.scss';

export type TooltipPlacement = 'top' | 'bottom' | 'start' | 'end';

export type TooltipProps = {
  /**
   * the trigger element the tooltip is attached to (icon button, link, etc.).
   */
  children?: ReactNode;

  /**
   * the content rendered inside the tooltip bubble.
   */
  content?: ReactNode;

  /**
   * placement of the tooltip relative to the trigger. `start`/`end` are
   * logical and flip automatically for RTL layouts.
   */
  placement?: TooltipPlacement;

  /**
   * disables the tooltip so it never appears.
   */
  disabled?: boolean;

  /**
   * delay in milliseconds before the tooltip fades in.
   */
  openDelay?: number;

  /**
   * class name for the root wrapper element.
   */
  className?: string;

  /**
   * class name for the tooltip bubble element.
   */
  contentClassName?: string;

  /**
   * style for the root wrapper element.
   */
  style?: CSSProperties;
};

export function Tooltip({
  children,
  content = `מידע נוסף`,
  placement = `top`,
  disabled = false,
  openDelay = 120,
  className,
  contentClassName,
  style,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = useId();

  const showTooltip = () => {
    if (disabled) return;
    setIsVisible(true);
  };

  const hideTooltip = () => {
    setIsVisible(false);
  };

  const isOpen = isVisible && !disabled;

  return (
    <span
      className={classNames(styles.wrapper, className)}
      style={style}
      onMouseEnter={() => showTooltip()}
      onMouseLeave={() => hideTooltip()}
      onFocus={() => showTooltip()}
      onBlur={() => hideTooltip()}
    >
      <span aria-describedby={tooltipId} className={styles.trigger}>
        {children}
      </span>
      <span
        role="tooltip"
        id={tooltipId}
        aria-hidden={!isOpen}
        className={classNames(
          styles.tooltip,
          styles[placement],
          { [styles.visible]: isOpen },
          contentClassName
        )}
        style={{ '--tooltip-delay': `${openDelay}ms` } as CSSProperties}
      >
        {content}
        <span className={classNames(styles.arrow, styles[`arrow-${placement}`])} />
      </span>
    </span>
  );
}
