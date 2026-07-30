import React, { useMemo } from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { SectionLayout } from '@helemclub/design.layouts.section-layout';
import { Link } from '@helemclub/design.navigation.link';
import { EventCard } from '@helemclub/events.ui.event-card';
import { useListEvents, type UseListEventsOptions } from '@helemclub/events.hooks.use-events';
import styles from './events-preview.module.scss';

export type EventsPreviewProps = {
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
   * maximum number of upcoming events to show.
   */
  limit?: number;

  /**
   * provide mock events to bypass the query, useful for tests and previews.
   */
  mockEvents?: UseListEventsOptions['mockData'];

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
 * "אירועים קרובים" — a home-page preview of upcoming community events, shown as
 * a grid of event cards with a "see all" link to the events page. registered
 * into the platform's HomeSection slot by the events aspect. RTL, responsive.
 */
export function EventsPreview({
  eyebrow = `📅 יומן הקהילה`,
  title = `אירועים קרובים`,
  subtitle = `שולחנות עגולים, וובינרים ומפגשים — פיזיים ודיגיטליים`,
  limit = 3,
  mockEvents,
  className,
  style,
}: EventsPreviewProps) {
  const hasMock = mockEvents !== undefined;
  const { events, loading } = useListEvents(hasMock ? { mockData: mockEvents } : { when: 'upcoming' });

  const upcoming = useMemo(() => {
    const now = Date.now();
    return events
      .map((event) => event.toObject())
      .filter((event) => new Date(event.startAt).getTime() >= now)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
      .slice(0, limit);
  }, [events, limit]);

  if (!loading && upcoming.length === 0) return null;

  return (
    <div className={classNames(styles.eventsPreview, className)} style={style}>
      <div className={styles.inner}>
        <SectionLayout
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          action={
            <Link as={RouterLink} href="/events" className={styles.seeAll}>
              לכל האירועים ←
            </Link>
          }
        >
          <div className={styles.grid}>
            {upcoming.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </SectionLayout>
      </div>
    </div>
  );
}
