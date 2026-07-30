import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import classNames from 'classnames';
import { SectionLayout } from '@helemclub/design.layouts.section-layout';
import { Card } from '@helemclub/design.content.card';
import { Heading } from '@helemclub/design.typography.heading';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import { Link } from '@helemclub/design.navigation.link';
import { EcosystemPillar } from './ecosystem-pillar-type.js';
import { DEFAULT_PILLARS } from './ecosystem-overview.mock.js';
import styles from './ecosystem-overview.module.scss';

export type EcosystemOverviewProps = {
  /**
   * the ecosystem pillars rendered as cards, each linking to its lobby page.
   */
  pillars?: EcosystemPillar[];

  /**
   * the section eyebrow label.
   */
  eyebrow?: string;

  /**
   * the section title.
   */
  title?: string;

  /**
   * the section subtitle, rendered below the title.
   */
  subtitle?: string;

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
 * a home section presenting the ecosystem pillars as cards, each linking to
 * its lobby, along with an explainer of how passive and active participation
 * combine into rehabilitation.
 */
export function EcosystemOverview({
  pillars = DEFAULT_PILLARS,
  eyebrow = `האקוסיסטם הדיגיטלי של הלם קלאב`,
  title = `האקוסיסטם`,
  subtitle = `חמישה רכיבים שנבנים על בסיס ידע מרכזי אחד`,
  className,
  style,
}: EcosystemOverviewProps) {
  return (
    <SectionLayout
      eyebrow={eyebrow}
      title={title}
      subtitle={subtitle}
      className={classNames(styles.ecosystemOverview, className)}
      style={style}
    >
      <div className={styles.grid}>
        {pillars.map((pillar) => (
          <Card key={pillar.slug} padding="medium" className={styles.pillarCard}>
            <Link as={RouterLink} href={pillar.href} block className={styles.pillarLink}>
              <span className={styles.pillarIcon}>{pillar.icon}</span>
              <Heading level={3} className={styles.pillarTitle}>
                {pillar.title}
              </Heading>
              <Paragraph size="sm" muted className={styles.pillarDescription}>
                {pillar.description}
              </Paragraph>
              <span className={styles.pillarCta}>למעבר ללובי ←</span>
            </Link>
          </Card>
        ))}
      </div>
    </SectionLayout>
  );
}
