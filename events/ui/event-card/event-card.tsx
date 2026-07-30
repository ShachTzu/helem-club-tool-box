import React from 'react';
import classNames from 'classnames';
import { useNavigate } from 'react-router-dom';
import { Card } from '@helemclub/design.content.card';
import { Image } from '@helemclub/design.content.image';
import { Badge } from '@helemclub/design.content.badge';
import { DomainBadge, type DomainBadgeItem } from '@helemclub/knowledge-domains.ui.domain-badge';
import { mockEvent, type PlainEvent, type EventType } from '@helemclub/events.entities.event';
import styles from './event-card.module.scss';

const DEFAULT_EVENT: PlainEvent = mockEvent().toObject();

const EVENT_TYPE_LABELS: Record<EventType, string> = {
  round_table: `שולחן עגול`,
  webinar: `וובינר`,
  local: `יוזמה מקומית`,
  big: `אירוע גדול`,
};

function formatEventDate(startAt: string): string {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return ``;
  return date.toLocaleDateString(`he-IL`, { day: `numeric`, month: `long`, year: `numeric` });
}

function formatEventTime(startAt: string): string {
  const date = new Date(startAt);
  if (Number.isNaN(date.getTime())) return ``;
  return date.toLocaleTimeString(`he-IL`, { hour: `2-digit`, minute: `2-digit` });
}

function toDomainItems(domains: string[]): DomainBadgeItem[] {
  return domains.map((name) => ({ id: name, slug: encodeURIComponent(name), name }));
}

export type EventCardProps = {
  /**
   * the event to display in the card.
   */
  event?: PlainEvent;

  /**
   * the destination url of the event's detail page.
   * defaults to a route derived from the event slug.
   */
  href?: string;

  /**
   * class name to override the card root.
   */
  className?: string;

  /**
   * style to apply to the card root.
   */
  style?: React.CSSProperties;
};

/**
 * a card presenting a community event: cover image, type badge, title,
 * date/time, online/location indicator and related domains. links to the
 * event's detail page. RTL, responsive.
 */
export function EventCard({ event = DEFAULT_EVENT, href, className, style }: EventCardProps) {
  const { title, description, type, coverImage, startAt, location, isOnline, domains, slug } = event;
  const resolvedHref = href || `/events/${slug}`;
  const navigate = useNavigate();

  // navigate programmatically (instead of an anchor wrapper) so the card can
  // contain nested links such as domain badges without invalid <a> nesting.
  const goToEvent = () => navigate(resolvedHref);
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      goToEvent();
    }
  };
  const typeLabel = EVENT_TYPE_LABELS[type] || type;
  const dateLabel = formatEventDate(startAt);
  const timeLabel = formatEventTime(startAt);
  const locationLabel = location || (isOnline ? `מקוון` : `מיקום יפורסם בקרוב`);
  const domainItems = toDomainItems(domains || []);

  return (
    <div
      role="link"
      tabIndex={0}
      aria-label={title}
      onClick={goToEvent}
      onKeyDown={onKeyDown}
      className={classNames(styles.cardLink, className)}
      style={style}
    >
      <Card padding="none" className={styles.card}>
        <div className={styles.coverWrapper}>
          <Image src={coverImage} alt={title} aspectRatio="16 / 9" rounded="none" className={styles.cover} />
          <Badge variant="accent" className={styles.typeBadge}>
            {typeLabel}
          </Badge>
        </div>
        <div className={styles.body}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.description}>{description}</p>
          <div className={styles.metaList}>
            <span className={styles.metaRow}>
              <span className={styles.metaIcon} aria-hidden>
                📅
              </span>
              <span>
                {dateLabel} · {timeLabel}
              </span>
            </span>
            <span className={styles.metaRow}>
              <span className={styles.metaIcon} aria-hidden>
                {isOnline ? `💻` : `📍`}
              </span>
              <span>{locationLabel}</span>
            </span>
          </div>
          {domainItems.length > 0 && <DomainBadge domains={domainItems} className={styles.domains} />}
        </div>
      </Card>
    </div>
  );
}
