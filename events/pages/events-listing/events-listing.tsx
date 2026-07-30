import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { DomainFilter, type DomainFilterProps } from '@helemclub/knowledge-domains.ui.domain-filter';
import { EventSchedule } from '@helemclub/events.ui.event-schedule';
import { useListEvents, type UseListEventsOptions } from '@helemclub/events.hooks.use-events';
import styles from './events-listing.module.scss';

export type EventsListingProps = {
  /**
   * hero title.
   */
  heroTitle?: string;

  /**
   * hero subtitle.
   */
  heroSubtitle?: string;

  /**
   * provide mock events to bypass the query, useful for tests and previews.
   */
  mockEvents?: UseListEventsOptions['mockData'];

  /**
   * provide mock domains to the domain filter, useful for tests and previews.
   */
  mockDomains?: DomainFilterProps['mockDomains'];

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
 * events listing page (/events): a hero band, a coping-domain filter, and an
 * upcoming/past events schedule. free browsing; RSVP is login-gated. RTL,
 * responsive.
 */
export function EventsListing({
  heroTitle = `אירועי קהילה`,
  heroSubtitle = `שולחנות עגולים, וובינרים, יוזמות מקומיות ואירועים גדולים — מרחב לפגוש, ללמוד ולהתחזק יחד.`,
  mockEvents,
  mockDomains,
  className,
  style,
}: EventsListingProps) {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const hasMock = mockEvents !== undefined;
  const { events } = useListEvents(hasMock ? { mockData: mockEvents } : {});

  const visibleEvents = useMemo(() => {
    const plain = events.map((event) => event.toObject());
    if (selectedDomains.length === 0) return plain;
    return plain.filter((event) => event.domains?.some((domain) => selectedDomains.includes(domain)));
  }, [events, selectedDomains]);

  return (
    <div className={classNames(styles.eventsListing, className)} style={style}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroEyebrow}>📅 יומן הקהילה</div>
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          <p className={styles.heroSubtitle}>{heroSubtitle}</p>
        </div>
      </section>

      <PageLayout>
        <DomainFilter
          value={selectedDomains}
          onChange={(next) => setSelectedDomains(next)}
          onlyWithContent
          mockDomains={mockDomains}
          className={styles.domainFilter}
        />
        <EventSchedule events={visibleEvents} />
      </PageLayout>
    </div>
  );
}
