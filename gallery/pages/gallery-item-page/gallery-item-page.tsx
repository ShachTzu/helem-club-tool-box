import React, { useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { TagChip } from '@helemclub/design.content.tag-chip';
import { useGalleryItems, type UseGalleryItemsOptions } from '@helemclub/gallery.hooks.use-gallery';
import { EngagementBar } from '@helemclub/engagement.ui.engagement-bar';
import { CommentThread } from '@helemclub/engagement.ui.comment-thread';
import styles from './gallery-item-page.module.scss';

export type GalleryItemPageProps = {
  /**
   * explicit item slug. when omitted, the slug is read from the route params.
   */
  slug?: string;

  /**
   * provide mock items to bypass the query, useful for tests and previews.
   */
  mockItems?: UseGalleryItemsOptions['mockData'];

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
 * gallery item detail page (/gallery/:slug): a large media view (image or
 * embedded video), title, artist, description, cross-cutting domain tags, plus
 * the shared engagement bar and comment thread. RTL, responsive.
 */
export function GalleryItemPage({ slug, mockItems, className, style }: GalleryItemPageProps) {
  const params = useParams();
  const activeSlug = slug ?? params.slug ?? '';
  const commentsRef = useRef<HTMLDivElement>(null);

  const hasMock = mockItems !== undefined;
  const { items, loading } = useGalleryItems(undefined, hasMock ? { mockData: mockItems } : undefined);

  const item = useMemo(() => {
    const plain = items.map((entry) => entry.toObject());
    return plain.find((entry) => entry.slug === activeSlug || entry.id === activeSlug);
  }, [items, activeSlug]);

  if (!loading && !item) {
    return (
      <PageLayout>
        <EmptyState
          title="היצירה לא נמצאה"
          description="ייתכן שהקישור השתנה או שהיצירה הוסרה מהגלריה."
          actionLabel="חזרה לגלריה"
          actionHref="/gallery"
        />
      </PageLayout>
    );
  }

  if (!item) {
    return (
      <PageLayout>
        <div className={styles.loading}>טוען…</div>
      </PageLayout>
    );
  }

  return (
    <div className={classNames(styles.galleryItemPage, className)} style={style}>
      <PageLayout>
        <nav className={styles.breadcrumbs}>
          <Link to="/gallery">גלריית PTSDART</Link>
          <span aria-hidden> / </span>
          <span>{item.title}</span>
        </nav>

        <div className={styles.media}>
          {item.mediaType === 'video' ? (
            <video src={item.mediaUrl} poster={item.thumbnailUrl} controls className={styles.mediaEl} />
          ) : (
            <img src={item.mediaUrl} alt={item.title} className={styles.mediaEl} />
          )}
        </div>

        <header className={styles.header}>
          <h1 className={styles.title}>{item.title}</h1>
          {item.artistName && <div className={styles.artist}>מאת {item.artistName}</div>}
          {item.description && <p className={styles.description}>{item.description}</p>}
          <div className={styles.domains}>
            {(item.domains ?? []).map((domain) => (
              <Link key={domain} to={`/domains/${domain}`} className={styles.domainLink}>
                <TagChip label={domain} />
              </Link>
            ))}
          </div>
        </header>

        <EngagementBar
          targetType="gallery"
          targetId={item.id}
          title={item.title}
          imageUrl={item.thumbnailUrl ?? item.mediaUrl}
          onCommentsClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
          className={styles.engagement}
        />

        <div ref={commentsRef}>
          <CommentThread targetType="gallery" targetId={item.id} parentLabel="היצירה" />
        </div>
      </PageLayout>
    </div>
  );
}
