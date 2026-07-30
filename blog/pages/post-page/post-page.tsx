import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { Image } from '@helemclub/design.content.image';
import { TagChip } from '@helemclub/design.content.tag-chip';
import { AuthorByline } from '@helemclub/blog.ui.author-byline';
import { PostBody } from '@helemclub/blog.ui.post-body';
import { RelatedApps } from '@helemclub/blog.ui.related-apps';
import { MembersOnlyGate } from '@helemclub/blog.ui.members-only-gate';
import { useGetPost, type UseGetPostOptions } from '@helemclub/blog.hooks.use-posts';
import { EngagementBar } from '@helemclub/engagement.ui.engagement-bar';
import { CommentThread } from '@helemclub/engagement.ui.comment-thread';
import styles from './post-page.module.scss';

export type PostPageProps = {
  /**
   * explicit post slug. when omitted, the slug is read from the route params.
   */
  slug?: string;

  /**
   * provide mock post data to bypass the query, useful for tests and previews.
   * pass null to render the not-found state.
   */
  mockPost?: UseGetPostOptions['mockData'];

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
 * blog post detail page (/blog/:slug): cover, author byline, rich post body
 * with inline app/image embeds, cross-cutting domain tags, members-only
 * gating, related "apps that can help", plus the shared engagement bar and
 * comment thread. free to read; posting is login-gated. RTL, responsive.
 */
export function PostPage({ slug, mockPost, className, style }: PostPageProps) {
  const params = useParams();
  const activeSlug = slug ?? params.slug ?? '';
  const commentsRef = useRef<HTMLDivElement>(null);

  const hasMock = mockPost !== undefined;
  const { post, loading } = useGetPost(activeSlug, hasMock ? { mockData: mockPost } : undefined);

  if (!loading && !post) {
    return (
      <PageLayout>
        <EmptyState
          title="הכתבה לא נמצאה"
          description="ייתכן שהקישור השתנה או שהכתבה הוסרה."
          actionLabel="חזרה לבלוג"
          actionHref="/blog"
        />
      </PageLayout>
    );
  }

  if (!post) {
    return (
      <PageLayout>
        <div className={styles.loading}>טוען…</div>
      </PageLayout>
    );
  }

  const data = post.toObject();

  return (
    <div className={classNames(styles.postPage, className)} style={style}>
      <PageLayout>
        <nav className={styles.breadcrumbs}>
          <Link to="/blog">בלוג</Link>
          <span aria-hidden> / </span>
          <span>{data.title}</span>
        </nav>

        <article className={styles.article}>
          <header className={styles.header}>
            <div className={styles.domains}>
              {(data.domains ?? []).map((domain) => (
                <Link key={domain} to={`/domains/${domain}`} className={styles.domainLink}>
                  <TagChip label={domain} />
                </Link>
              ))}
            </div>
            <h1 className={styles.title}>{data.title}</h1>
            <p className={styles.excerpt}>{data.excerpt}</p>
            <AuthorByline authorName={data.authorName} date={data.publishDate} size="lg" />
          </header>

          {data.coverImage && (
            <Image src={data.coverImage} alt={data.title} className={styles.cover} />
          )}

          {post.isMembersOnly ? (
            <MembersOnlyGate>
              <PostBody body={data.body} embeddedApps={data.embeddedApps} />
            </MembersOnlyGate>
          ) : (
            <PostBody body={data.body} embeddedApps={data.embeddedApps} />
          )}

          <EngagementBar
            targetType="post"
            targetId={data.id}
            title={data.title}
            onCommentsClick={() => commentsRef.current?.scrollIntoView({ behavior: 'smooth' })}
            className={styles.engagement}
          />
        </article>

        <RelatedApps domains={data.domains} />

        <div ref={commentsRef}>
          <CommentThread targetType="post" targetId={data.id} parentLabel="הכתבה" />
        </div>
      </PageLayout>
    </div>
  );
}
