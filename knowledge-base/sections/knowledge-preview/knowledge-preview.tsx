import React from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { SectionLayout } from '@helemclub/design.layouts.section-layout';
import { Link } from '@helemclub/design.navigation.link';
import { LabelCard } from '@helemclub/knowledge-base.ui.label-card';
import { useLabels, type UseLabelsOptions } from '@helemclub/knowledge-base.hooks.use-labels';
import styles from './knowledge-preview.module.scss';

export type KnowledgePreviewProps = {
  /**
   * eyebrow label shown above the section title.
   */
  eyebrow?: string;

  /**
   * section title.
   */
  title?: string;

  /**
   * supporting subtitle rendered below the title.
   */
  subtitle?: string;

  /**
   * maximum number of project labels to show.
   */
  limit?: number;

  /**
   * base path used to build the link to each label's lobby page.
   */
  labelLinkBase?: string;

  /**
   * provide mock labels to bypass the query, useful for tests and previews.
   */
  mockLabels?: UseLabelsOptions['mockData'];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * "ספריית הידע" — a home-page preview of the knowledge base's project labels,
 * shown as a grid of label cards with a "see all" link to the full knowledge
 * base. registered into the platform's HomeSection slot by the knowledge-base
 * aspect. RTL, responsive.
 */
export function KnowledgePreview({
  eyebrow = `ה-Mother Ship`,
  title = `ספריית הידע`,
  subtitle = `סדרות וידאו, הקלטות והרצאות — מאורגנות בפרויקטים לפי נושא`,
  limit = 5,
  labelLinkBase = `/knowledge`,
  mockLabels,
  className,
  style,
}: KnowledgePreviewProps) {
  const { labels, loading } = useLabels({ mockData: mockLabels });

  const visible = labels.slice(0, limit);

  if (!loading && visible.length === 0) return null;

  return (
    <div className={classNames(styles.knowledgePreview, className)} style={style}>
      <div className={styles.inner}>
        <SectionLayout
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          action={
            <Link as={RouterLink} href="/knowledge" className={styles.seeAll}>
              לכל הספרייה ←
            </Link>
          }
        >
          <div className={styles.grid}>
            {visible.map((label) => (
              <LabelCard
                key={label.id}
                label={label.toObject()}
                href={`${labelLinkBase}/${label.slug}`}
              />
            ))}
          </div>
        </SectionLayout>
      </div>
    </div>
  );
}
