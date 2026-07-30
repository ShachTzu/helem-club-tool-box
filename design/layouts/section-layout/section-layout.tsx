import React, { type ReactNode, type CSSProperties } from 'react';
import classNames from 'classnames';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import styles from './section-layout.module.scss';

export type SectionLayoutSpacing = 'compact' | 'default' | 'relaxed';

export type SectionLayoutProps = {
  /**
   * small label rendered above the title, useful for context or category.
   */
  eyebrow?: string;

  /**
   * the section title.
   */
  title?: string;

  /**
   * a supporting line rendered below the title.
   */
  subtitle?: string;

  /**
   * an action element rendered next to the title, for example a "see all" link.
   */
  action?: ReactNode;

  /**
   * the section content, rendered below the heading area.
   */
  children?: ReactNode;

  /**
   * controls the vertical padding of the section.
   */
  spacing?: SectionLayoutSpacing;

  /**
   * the semantic element to render the section as.
   */
  as?: keyof React.JSX.IntrinsicElements;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: CSSProperties;
};

/**
 * a section wrapper with an optional eyebrow, title, subtitle and action slot,
 * followed by a content area. used to compose home and lobby pages with
 * consistent, responsive spacing between sections.
 */
export function SectionLayout({
  eyebrow,
  title,
  subtitle,
  action,
  children,
  spacing = `default`,
  as = `section`,
  className,
  style,
}: SectionLayoutProps) {
  const Element = as;
  const hasHeader = Boolean(eyebrow || title || subtitle || action);

  return (
    <Element className={classNames(styles.sectionLayout, styles[spacing], className)} style={style}>
      {hasHeader && (
        <div className={styles.header}>
          <div className={styles.headings}>
            {eyebrow && <span className={styles.eyebrow}>{eyebrow}</span>}
            {title && (
              <Heading level={2} className={styles.title}>
                {title}
              </Heading>
            )}
            {subtitle && (
              <Paragraph size="md" muted className={styles.subtitle}>
                {subtitle}
              </Paragraph>
            )}
          </div>
          {action && <div className={styles.action}>{action}</div>}
        </div>
      )}
      {children && <div className={styles.content}>{children}</div>}
    </Element>
  );
}
