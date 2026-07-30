import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Tabs } from '@helemclub/design.navigation.tabs';
import type { TabItem } from '@helemclub/design.navigation.tabs';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { EventCard } from '@helemclub/events.ui.event-card';
import { Event, mockEvents, type PlainEvent } from '@helemclub/events.entities.event';
import styles from './event-schedule.module.scss';

const DEFAULT_EVENTS: PlainEvent[] = mockEvents().map((event) => event.toObject());

const TAB_ITEMS: TabItem[] = [
  { key: `upcoming`, label: `אירועים קרובים` },
  { key: `past`, label: `אירועים שהיו` },
];

export type EventScheduleTab = 'upcoming' | 'past';

export type EventScheduleProps = {
  /**
   * the events to split into upcoming and past tabs.
   */
  events?: PlainEvent[];

  /**
   * title rendered above the schedule.
   */
  title?: string;

  /**
   * description rendered below the title.
   */
  description?: string;

  /**
   * the initially active tab, for uncontrolled usage.
   */
  defaultTab?: EventScheduleTab;

  /**
   * title shown when the upcoming tab has no events.
   */
  emptyUpcomingTitle?: string;

  /**
   * description shown when the upcoming tab has no events.
   */
  emptyUpcomingDescription?: string;

  /**
   * title shown when the past tab has no events.
   */
  emptyPastTitle?: string;

  /**
   * description shown when the past tab has no events.
   */
  emptyPastDescription?: string;

  /**
   * class name to override the root element.
   */
  className?: string;

  /**
   * style to apply to the root element.
   */
  style?: React.CSSProperties;
};

/**
 * an upcoming/past events schedule with tabs and a responsive grid of event
 * cards. sorts upcoming events by soonest first and past events by most
 * recent first. RTL.
 */
export function EventSchedule({
  events = DEFAULT_EVENTS,
  title = `לוח אירועים`,
  description = `שולחנות עגולים, וובינרים ומפגשים קהילתיים — פיזיים ודיגיטליים, לאורך כל השנה.`,
  defaultTab = `upcoming`,
  emptyUpcomingTitle = `אין אירועים קרובים כרגע`,
  emptyUpcomingDescription = `ברגע שיתפרסמו אירועים חדשים בקהילה, הם יופיעו כאן.`,
  emptyPastTitle = `עדיין אין אירועים שהסתיימו`,
  emptyPastDescription = `אירועים שהסתיימו יופיעו כאן, כולל הקלטות אם פורסמו למאגר הידע.`,
  className,
  style,
}: EventScheduleProps) {
  const [activeTab, setActiveTab] = useState<EventScheduleTab>(defaultTab);

  const eventEntities = useMemo(() => events.map((event) => Event.from(event)), [events]);

  const upcomingEvents = useMemo(() => {
    return eventEntities
      .filter((event) => !event.isPast)
      .sort((a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime());
  }, [eventEntities]);

  const pastEvents = useMemo(() => {
    return eventEntities
      .filter((event) => event.isPast)
      .sort((a, b) => new Date(b.startAt).getTime() - new Date(a.startAt).getTime());
  }, [eventEntities]);

  const activeEvents = activeTab === `upcoming` ? upcomingEvents : pastEvents;

  const handleTabChange = (key: string) => {
    setActiveTab(key === `past` ? `past` : `upcoming`);
  };

  return (
    <div className={classNames(styles.eventSchedule, className)} style={style}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description && <p className={styles.description}>{description}</p>}
      </div>
      <div className={styles.tabsRow}>
        <Tabs items={TAB_ITEMS} activeKey={activeTab} onChange={(key) => handleTabChange(key)} />
      </div>
      {activeEvents.length > 0 ? (
        <div className={styles.grid}>
          {activeEvents.map((event) => (
            <EventCard key={event.id} event={event.toObject()} />
          ))}
        </div>
      ) : (
        <div className={styles.emptyWrapper}>
          <EmptyState
            title={activeTab === `upcoming` ? emptyUpcomingTitle : emptyPastTitle}
            description={activeTab === `upcoming` ? emptyUpcomingDescription : emptyPastDescription}
          />
        </div>
      )}
    </div>
  );
}
