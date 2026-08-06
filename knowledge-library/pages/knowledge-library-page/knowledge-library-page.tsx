import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card } from '@helemclub/design.content.card';
import { TagChip } from '@helemclub/design.content.tag-chip';
import { Avatar } from '@helemclub/design.content.avatar';
import { MediaPlayer } from '@helemclub/knowledge-base.ui.media-player';
import { useKnowledgePage, useKnowledgePages } from '@helemclub/knowledge-library.hooks.use-knowledge-pages';
import { HELEM_CLUB_AVATAR_URL } from '@helemclub/knowledge-library.entities.knowledge-page';
import type { PlainKnowledgePage } from '@helemclub/knowledge-library.entities.knowledge-page';
import styles from './knowledge-library-page.module.scss';

export type KnowledgeLibraryPageProps = {
  /**
   * provide the resolved page to bypass the getKnowledgePage query. pass
   * null to simulate a not-found page. useful for tests and compositions.
   */
  mockPage?: PlainKnowledgePage | null;

  /**
   * provide the full page list (for breadcrumb/siblings/children) to bypass
   * the listKnowledgePages query. useful for tests and compositions.
   */
  mockPages?: PlainKnowledgePage[];

  className?: string;
  style?: React.CSSProperties;
};

/**
 * generic knowledge-library page view, at any depth. a page IS both content
 * and (when it has children) an index of its children — this single
 * component covers the root's sub-topics, a series landing page, and a
 * chapter's leaf view, rather than one component per hierarchy level, since
 * nesting is unlimited and not tied to a fixed depth. route:
 * /knowledge-library/:slug
 *
 * ponytail: breadcrumb/siblings/children are derived client-side from the
 * full page list (useKnowledgePages with no filter) rather than a dedicated
 * ancestors/children query — fine at the admin-authored scale this feature
 * targets today; upgrade to a server-side query if the library grows into
 * the thousands of pages.
 */
export function KnowledgeLibraryPage({ mockPage, mockPages, className, style }: KnowledgeLibraryPageProps) {
  const { slug } = useParams<{ slug: string }>();
  const hasMockPage = mockPage !== undefined;
  const { page, loading } = useKnowledgePage(slug || '', hasMockPage ? { mockData: mockPage } : undefined);
  const { pages: allPages } = useKnowledgePages(mockPages ? { mockData: mockPages } : undefined);

  const pageById = useMemo(() => {
    const map: Record<string, PlainKnowledgePage> = {};
    allPages.forEach((item) => {
      map[item.id] = item;
    });
    return map;
  }, [allPages]);

  const children = useMemo(
    () => (page ? allPages.filter((item) => item.parentId === page.id && item.isPublished) : []),
    [allPages, page]
  );

  const siblings = useMemo(
    () => (page ? allPages.filter((item) => item.parentId === page.parentId && item.isPublished) : []),
    [allPages, page]
  );

  if (loading) {
    return <div className={styles.loadingState}>טוען...</div>;
  }

  if (!page || !page.isPublished) {
    return <div className={styles.notFound}>העמוד לא נמצא.</div>;
  }

  const currentSiblingIndex = siblings.findIndex((item) => item.id === page.id);
  const previousChapter = currentSiblingIndex > 0 ? siblings[currentSiblingIndex - 1] : undefined;
  const nextChapter =
    currentSiblingIndex >= 0 && currentSiblingIndex < siblings.length - 1 ? siblings[currentSiblingIndex + 1] : undefined;

  return (
    <div className={className} style={style}>
      <nav className={styles.breadcrumb} aria-label="ניווט היררכי">
        <Link to="/knowledge-library">ספריית הידע</Link>
        {page.ancestorIds.map((ancestorId) => {
          const ancestor = pageById[ancestorId];
          if (!ancestor) return null;
          return (
            <React.Fragment key={ancestorId}>
              <span className={styles.breadcrumbSeparator}>›</span>
              <Link to={`/knowledge-library/${ancestor.slug}`}>{ancestor.title}</Link>
            </React.Fragment>
          );
        })}
        <span className={styles.breadcrumbSeparator}>›</span>
        <span aria-current="page">{page.title}</span>
      </nav>

      <h1 className={styles.title}>{page.title}</h1>
      <div className={styles.byline}>
        <Avatar name={page.authorName} imageUrl={HELEM_CLUB_AVATAR_URL} size="small" />
        <span>{page.authorName}</span>
        <span className={styles.bylineSeparator}>·</span>
        <time dateTime={page.publishDate}>{new Date(page.publishDate).toLocaleDateString('he-IL')}</time>
      </div>

      {page.domains.length > 0 && (
        <div className={styles.domainRow}>
          {page.domains.map((domain) => (
            <TagChip key={domain} label={domain} />
          ))}
        </div>
      )}

      {page.image && <img className={styles.image} src={page.image} alt={page.title} />}

      {page.videoUrl && <MediaPlayer mediaUrl={page.videoUrl} mediaType="video" title={page.title} />}

      {/* safe: videoEmbedHtml only ever holds a value that already passed the
          server-side embed-allowlist (a single YouTube/Spotify iframe) — see
          knowledge-library/embed-allowlist.ts. never arbitrary user HTML. */}
      {page.videoEmbedHtml && (
        <div className={styles.embedWrapper} dangerouslySetInnerHTML={{ __html: page.videoEmbedHtml }} />
      )}

      {page.body && <p className={styles.body}>{page.body}</p>}

      {children.length > 0 && (
        <div className={styles.childrenGrid}>
          {children.map((child) => (
            <Link key={child.id} to={`/knowledge-library/${child.slug}`} className={styles.tileLink}>
              <Card clickable padding="medium" className={styles.tile}>
                <h2 className={styles.tileTitle}>{child.title}</h2>
              </Card>
            </Link>
          ))}
        </div>
      )}

      {children.length === 0 && (previousChapter || nextChapter) && (
        <nav className={styles.chapterNav} aria-label="ניווט בין פרקים">
          {previousChapter ? (
            <Link to={`/knowledge-library/${previousChapter.slug}`}>← {previousChapter.title}</Link>
          ) : (
            <span />
          )}
          {nextChapter && <Link to={`/knowledge-library/${nextChapter.slug}`}>{nextChapter.title} →</Link>}
        </nav>
      )}
    </div>
  );
}

export default KnowledgeLibraryPage;
