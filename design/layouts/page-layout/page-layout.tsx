import React, { type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import styles from './page-layout.module.scss';

export type PageLayoutSpacing = 'compact' | 'default' | 'relaxed';

export type PageLayoutProps = {
  /**
   * page content to render inside the layout container.
   */
  children?: ReactNode;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: CSSProperties;

  /**
   * controls the vertical rhythm — the spacing between child sections
   * and the top/bottom padding of the layout.
   */
  spacing?: PageLayoutSpacing;

  /**
   * the semantic element to render the layout as.
   */
  as?: keyof React.JSX.IntrinsicElements;
};

/**
 * page inner content layout. provides a centered max-width container,
 * responsive horizontal padding and vertical rhythm between sections.
 * does not render a header or footer — compose those around this layout.
 */
export function PageLayout({ children, className, style, spacing = `default`, as = `main` }: PageLayoutProps) {
  const Element = as;

  return (
    <Element className={classNames(styles.pageLayout, styles[spacing], className)} style={style}>
      {children}
    </Element>
  );
}
