import React from 'react';
import classNames from 'classnames';
import { CommunityWisdom, type CommunityWisdomProps } from '@helemclub/knowledge-domains.ui.community-wisdom';
import styles from './wisdom-page.module.scss';

export type WisdomPageProps = {
  /**
   * provide mock domains to the hub's domain filter, useful for tests/previews.
   */
  mockDomains?: CommunityWisdomProps['mockDomains'];

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
 * full 'חוכמת הקהילה' page (/wisdom): a hero band followed by the unified
 * community-wisdom hub in full mode — the ecosystem's central discovery
 * surface where all knowledge from every channel lives in one filterable
 * place. RTL, responsive.
 */
export function WisdomPage({ mockDomains, className, style }: WisdomPageProps) {
  return (
    <div className={classNames(styles.wisdomPage, className)} style={style}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>המרכז של הלם קלאב</div>
          <h1 className={styles.heroTitle}>חוכמת הקהילה</h1>
          <p className={styles.heroSubtitle}>
            כל הידע מכל הענפים במקום אחד — סננו לפי סוג תוכן, תחום התמודדות או חיפוש חופשי, וגלו בדיוק את מה שרלוונטי לכם עכשיו.
          </p>
        </div>
      </section>
      <CommunityWisdom mockDomains={mockDomains} />
    </div>
  );
}
