import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { TagChip } from '@helemclub/design.content.tag-chip';
import { MediaPlayer } from '@helemclub/knowledge-base.ui.media-player';
import { useRecord, type UseRecordOptions } from '@helemclub/knowledge-base.hooks.use-records';
import { EngagementBar } from '@helemclub/engagement.ui.engagement-bar';
import { CommentThread } from '@helemclub/engagement.ui.comment-thread';
import styles from './record-page.module.scss';

export type RecordPageProps = {
  /**
   * explicit record slug. when omitted, the slug is read from the route params.
   */
  slug?: string;

  /**
   * provide a mock record to bypass the query, useful for tests and previews.
   */
  mockRecord?: UseRecordOptions['mockData'];

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
 * knowledge-base record detail page (/knowledge/record/:slug): an embedded
 * external media player (video/audio), title, description, cross-cutting
 * domain tags, view count, plus the shared engagement bar and comment thread.
 * free to watch; posting is login-gated. RTL, responsive.
 */
export function RecordPage({ slug, mockRecord, className, style }: RecordPageProps) {
  const params = useParams();
  const activeSlug = slug ?? params.slug ?? '';
  const commentsRef = useRef<HTMLDivElement>(null);

  const hasMock = mockRecord !== undefined;
  const { record, loading } = useRecord(activeSlug, hasMock ? { mockData: mockRecord } : undefined);

  if (!loading && !record) {
    return (
      <PageLayout>
        <EmptyState
          title="הרשומה לא נמצאה"
          description="ייתכן שהקישור השתנה או שהתוכן הוסר מהמאגר."
          actionLabel="חזרה למאגר הידע"
          actionHref="/knowledge"
        />
      </PageLayout>
    );
  }

  if (!record) {
    return (
      <PageLayout>
        <div className={styles.loading}>טוען…</div>
      </PageLayout>
    );
  }

  const data = record.toObject();

  return (
    <div className={classNames(styles.recordPage, className)} style={style}>
      <PageLayout>
        <nav className={styles.breadcrumbs}>
          <Link to="/knowledge">מאגר ידע</Link>
          <span aria-hidden> / </span>
          <span>{data.title}</span>
        </nav>

        <MediaPlayer
          mediaUrl={data.mediaUrl}
          mediaType={data.mediaType}
          title={data.title}
          posterUrl={data.thumbnailUrl}
          className={styles.player}
        />

        <header className={styles.header}>
          <h1 className={styles.title}>{data.title}</h1>
          <div className={styles.metaRow}>
            <span>{data.mediaType === 'video' ? '🎬 וידאו' : '🎧 אודיו'}</span>
            <span>👁️ {(data.viewCount ?? 0).toLocaleString('he-IL')} צפיות</span>
          </div>
          {data.description && <p className={styles.description}>{data.description}</p>}
          <div className={styles.domains}>
            {(data.domains ?? []).map((domain) => (
              <Link key={domain} to={`/domains/${domain}`} className={styles.domainLink}>
                <TagChip label={domain} />
              </Link>
            ))}
          </div>
        </header>

        <EngagementBar
          targetType="record"
          targetId={data.id}
          title={data.title}
          onCommentsClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className={styles.engagement}
        />

        <div ref={commentsRef}>
          <CommentThread targetType="record" targetId={data.id} parentLabel="הרשומה" />
        </div>
      </PageLayout>
    </div>
  );
}
