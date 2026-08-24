import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@helemclub/design.content.card';
import { useKnowledgePages } from '@helemclub/knowledge-library.hooks.use-knowledge-pages';
import type { PlainKnowledgePage } from '@helemclub/knowledge-library.entities.knowledge-page';
import styles from './knowledge-library-lobby.module.scss';

export type KnowledgeLibraryLobbyProps = {
  /**
   * provide top-level pages to bypass the listKnowledgePages query. useful
   * for tests and compositions.
   */
  mockPages?: PlainKnowledgePage[];

  className?: string;
  style?: React.CSSProperties;
};

/**
 * root landing page of the knowledge library — lists every top-level page
 * (e.g. "עזרה ראשונה"). route: /knowledge-library
 */
export function KnowledgeLibraryLobby({ mockPages, className, style }: KnowledgeLibraryLobbyProps) {
  const { pages: rawPages, loading } = useKnowledgePages(
    mockPages ? { mockData: mockPages } : { parentId: null }
  );
  const pages = rawPages.filter((page) => page.parentId === null);

  return (
    <div className={className} style={style}>
      <h1 className={styles.title}>ספריית הידע</h1>
      <p className={styles.subtitle}>תוכן, סדרות והדרכות מבית הלם קלאב.</p>

      {loading ? (
        <div className={styles.loadingState}>טוען...</div>
      ) : pages.length === 0 ? (
        <p className={styles.subtitle}>עדיין אין תוכן בספריית הידע.</p>
      ) : (
        <div className={styles.grid}>
          {pages
            .filter((page) => page.isPublished)
            .map((page) => (
              <Link key={page.id} to={`/knowledge-library/${page.slug}`} className={styles.tileLink}>
                <Card clickable padding="medium" className={styles.tile}>
                  <h2 className={styles.tileTitle}>{page.title}</h2>
                </Card>
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}

export default KnowledgeLibraryLobby;
