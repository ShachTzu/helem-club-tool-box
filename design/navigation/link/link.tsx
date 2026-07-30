import React, { type ElementType, type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import { ExternalLinkIcon } from './external-link-icon.js';
import styles from './link.module.scss';

export type LinkProps = {
  /**
   * the link content.
   */
  children?: ReactNode;

  /**
   * the destination url or path of the link.
   */
  href?: string;

  /**
   * the element or component used to render the link.
   * pass a react-router `Link` component for internal, client-side navigation.
   */
  as?: ElementType;

  /**
   * marks the link as the currently active navigation item.
   */
  active?: boolean;

  /**
   * marks the link as pointing to an external destination.
   * when not set, it is inferred from the `href` value.
   */
  external?: boolean;

  /**
   * renders the link using the inverse text color, for use on dark/primary backgrounds.
   */
  inverse?: boolean;

  /**
   * renders the link as a full-width block element instead of an inline link.
   * use this when the link wraps block content such as a whole card, so it
   * respects its container's width instead of shrinking to its content.
   */
  block?: boolean;

  /**
   * the target attribute of the link.
   */
  target?: string;

  /**
   * the rel attribute of the link.
   */
  rel?: string;

  /**
   * handler called when the link is clicked.
   */
  onClick?: () => void;

  /**
   * class name for the link.
   */
  className?: string;

  /**
   * inline style for the link.
   */
  style?: CSSProperties;
};

/**
 * a themed link supporting internal (react-router-friendly via the `as` prop) and
 * external destinations, active state, and RTL-aware underline/hover interactions.
 */
export function Link({
  children,
  href = `/`,
  as,
  active = false,
  external,
  inverse = false,
  block = false,
  target,
  rel,
  onClick,
  className,
  style,
}: LinkProps) {
  const Component = as || `a`;
  const isExternal = external ?? /^https?:\/\//.test(href);
  const resolvedTarget = target ?? (isExternal ? `_blank` : undefined);
  const resolvedRel = rel ?? (isExternal ? `noopener noreferrer` : undefined);

  const linkClassName = classNames(
    styles.link,
    active && styles.active,
    inverse && styles.inverse,
    block && styles.block,
    className
  );

  if (Component === `a`) {
    return (
      <a
        href={href}
        target={resolvedTarget}
        rel={resolvedRel}
        className={linkClassName}
        style={style}
        onClick={() => onClick?.()}
      >
        <span className={styles.label}>{children}</span>
        {isExternal && <ExternalLinkIcon className={styles.externalIcon} />}
      </a>
    );
  }

  const RouterComponent = Component;

  return (
    <RouterComponent
      to={href}
      target={resolvedTarget}
      rel={resolvedRel}
      className={linkClassName}
      style={style}
      onClick={() => onClick?.()}
    >
      <span className={styles.label}>{children}</span>
      {isExternal && <ExternalLinkIcon className={styles.externalIcon} />}
    </RouterComponent>
  );
}
