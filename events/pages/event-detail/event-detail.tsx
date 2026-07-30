import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { Image } from '@helemclub/design.content.image';
import { Badge } from '@helemclub/design.content.badge';
import { TagChip } from '@helemclub/design.content.tag-chip';
import { RsvpButton } from '@helemclub/events.ui.rsvp-button';
import { useEvent, type UseEventOptions } from '@helemclub/events.hooks.use-events';
import { EngagementBar } from '@helemclub/engagement.ui.engagement-bar';
import { CommentThread } from '@helemclub/engagement.ui.comment-thread';
import styles from './event-detail.module.scss';

const EVENT_TYPE_LABELS: Record<string, string> = {
  round_table: 'שולחן עגול',
  webinar: 'וובינר',
  local: 'יוזמה מקומית',
  big: 'אירוע גדול',
};

export type EventDetailProps = {
  /**
   * explicit event slug. when omitted, the slug is read from the route params.
   */
  slug?: string;

  /**
   * provide mock event data to bypass the query, useful for tests and previews.
   * pass null to render the not-found state.
   */
  mockEvent?: UseEventOptions['mockData'];

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
 * event detail page (/events/:slug): cover, type badge, date/location, a
 * description, cross-cutting domain tags, an RSVP action (login-gated), plus
 * the shared engagement bar and comment thread. RTL, responsive.
 */
export function EventDetail({ slug, mockEvent, className, style }: EventDetailProps) {
  const params = useParams();
  const activeSlug = slug ?? params.slug ?? '';
  const commentsRef = useRef<HTMLDivElement>(null);

  const hasMock = mockEvent !== undefined;
  const { event, loading } = useEvent(activeSlug, hasMock ? { mockData: mockEvent } : undefined);

  if (!loading && !event) {
    return (
      <PageLayout>
        <EmptyState
          title="האירוע לא נמצא"
          description="ייתכן שהקישור השתנה או שהאירוע הוסר."
          actionLabel="חזרה לאירועים"
          actionHref="/events"
        />
      </PageLayout>
    );
  }

  if (!event) {
    return (
      <PageLayout>
        <div className={styles.loading}>טוען…</div>
      </PageLayout>
    );
  }

  const data = event.toObject();
  const dateLabel = new Date(data.startAt).toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={classNames(styles.eventDetail, className)} style={style}>
      <PageLayout>
        <nav className={styles.breadcrumbs}>
          <Link to="/events">אירועים</Link>
          <span aria-hidden> / </span>
          <span>{data.title}</span>
        </nav>

        {data.coverImage && (
          <Image src={data.coverImage} alt={data.title} className={styles.cover} />
        )}

        <header className={styles.header}>
          <div className={styles.badges}>
            <Badge>{EVENT_TYPE_LABELS[data.type] ?? data.type}</Badge>
            {event.isPast ? <Badge>אירוע שהיה</Badge> : <Badge>קרוב</Badge>}
            {data.isOnline && <Badge>אונליין</Badge>}
          </div>
          <h1 className={styles.title}>{data.title}</h1>
          <div className={styles.metaRow}>
            <span>🗓️ {dateLabel}</span>
            {data.location && <span>📍 {data.location}</span>}
            <span>👥 {data.rsvpCount} נרשמו</span>
          </div>
          <div className={styles.domains}>
            {(data.domains ?? []).map((domain) => (
              <Link key={domain} to={`/domains/${domain}`} className={styles.domainLink}>
                <TagChip label={domain} />
              </Link>
            ))}
          </div>
        </header>

        <div className={styles.body}>
          <article className={styles.description}>{data.description}</article>
          <aside className={styles.sidebar}>
            {!event.isPast && <RsvpButton eventId={data.id} />}
            {data.joinUrl && !event.isPast && (
              <a className={styles.joinLink} href={data.joinUrl} target="_blank" rel="noopener noreferrer">
                קישור להשתתפות ↗
              </a>
            )}
            {event.hasRecording && data.recordingRecordId && (
              <Link className={styles.recordingLink} to={`/knowledge/record/${data.recordingRecordId}`}>
                🎬 צפייה בהקלטה
              </Link>
            )}
          </aside>
        </div>

        <EngagementBar
          targetType="event"
          targetId={data.id}
          title={data.title}
          onCommentsClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className={styles.engagement}
        />

        <div ref={commentsRef}>
          <CommentThread targetType="event" targetId={data.id} parentLabel="האירוע" />
        </div>
      </PageLayout>
    </div>
  );
}
