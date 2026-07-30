import React, { type ReactNode, type KeyboardEvent } from 'react';
import classNames from 'classnames';
import styles from './card.module.scss';

export type CardPadding = 'none' | 'small' | 'medium' | 'large';

export type CardProps = {
  /**
   * content to render inside the card.
   */
  children?: ReactNode;

  /**
   * class name to override the card container.
   */
  className?: string;

  /**
   * style to apply to the card container.
   */
  style?: React.CSSProperties;

  /**
   * padding size applied inside the card.
   */
  padding?: CardPadding;

  /**
   * renders the card as an interactive, clickable surface.
   */
  clickable?: boolean;

  /**
   * handler invoked when the card is clicked (relevant when clickable is set).
   */
  onClick?: () => void;
};

const paddingClassMap: Record<CardPadding, string> = {
  none: styles.paddingNone,
  small: styles.paddingSmall,
  medium: styles.paddingMedium,
  large: styles.paddingLarge,
};

export function Card({ children, className, style, padding = `medium`, clickable = false, onClick }: CardProps) {
  const handleClick = () => {
    if (!clickable) return;
    if (onClick) onClick();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!clickable || !onClick) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={classNames(styles.card, paddingClassMap[padding], clickable && styles.clickable, className)}
      style={style}
      onClick={clickable ? () => handleClick() : undefined}
      onKeyDown={clickable ? handleKeyDown : undefined}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
    >
      {children}
    </div>
  );
}
