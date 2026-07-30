import React, { useMemo } from 'react';
import classNames from 'classnames';
import { SectionLayout } from '@helemclub/design.layouts.section-layout';
import { AppCard } from '@helemclub/toolbox.ui.app-card';
import { useApps, type UseAppsOptions } from '@helemclub/toolbox.hooks.use-apps';
import styles from './related-apps.module.scss';

const DEFAULT_DOMAINS = [`מיינדפולנס ונשימות`, `חרדה`];

export type RelatedAppsProps = {
  /**
   * coping-domains of the current post, used to find toolbox apps that share at least one domain.
   */
  domains?: string[];

  /**
   * title rendered above the apps grid.
   */
  title?: string;

  /**
   * maximum number of related apps to display.
   */
  maxApps?: number;

  /**
   * base path used to build the link to a domain's lobby page from an app card.
   */
  domainLinkBase?: string;

  /**
   * provide mock apps to skip the network request, useful for tests and previews.
   */
  mockApps?: UseAppsOptions['mockData'];

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
 * "אפליקציות שיכולות לעזור" section: lists toolbox apps that share a coping-domain
 * with the current post. hides itself when no related apps are found.
 */
export function RelatedApps({
  domains = DEFAULT_DOMAINS,
  title = `אפליקציות שיכולות לעזור`,
  maxApps = 3,
  domainLinkBase = `/domains`,
  mockApps,
  className,
  style,
}: RelatedAppsProps) {
  const { apps, loading, error } = useApps({ domainIds: domains, mockData: mockApps });

  const relatedApps = useMemo(() => {
    return apps.filter((app) => app.domains.some((domain) => domains.includes(domain))).slice(0, maxApps);
  }, [apps, domains, maxApps]);

  if (loading) {
    return (
      <SectionLayout title={title} spacing="compact" className={classNames(styles.relatedApps, className)} style={style}>
        <div className={styles.statusMessage}>טוען אפליקציות...</div>
      </SectionLayout>
    );
  }

  if (error) {
    return (
      <SectionLayout title={title} spacing="compact" className={classNames(styles.relatedApps, className)} style={style}>
        <div className={styles.statusMessage}>לא ניתן לטעון אפליקציות כרגע.</div>
      </SectionLayout>
    );
  }

  if (relatedApps.length === 0) {
    return null;
  }

  return (
    <SectionLayout title={title} spacing="compact" className={classNames(styles.relatedApps, className)} style={style}>
      <div className={styles.grid}>
        {relatedApps.map((app) => (
          <AppCard
            key={app.id}
            icon={app.icon}
            name={app.name}
            subtitle={app.subtitle}
            avgRating={app.avgRating}
            ratingCount={app.ratingCount}
            clickCount={app.clickCount}
            isFeatured={app.isFeatured}
            domains={app.domains.map((domain) => ({ id: domain, slug: domain, name: domain }))}
            domainLinkBase={domainLinkBase}
            href={`/toolbox/${app.slug}`}
          />
        ))}
      </div>
    </SectionLayout>
  );
}
