import React from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { SectionLayout } from '@helemclub/design.layouts.section-layout';
import { Link } from '@helemclub/design.navigation.link';
import { PostCard } from '@helemclub/blog.ui.post-card';
import { usePosts, type UsePostsOptions } from '@helemclub/blog.hooks.use-posts';
import { DEFAULT_DOMAIN_NAMES } from './blog-preview-domain-names.js';
import { formatPostDate } from './blog-preview-format-date.js';
import styles from './blog-preview.module.scss';

export type BlogPreviewProps = {
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
   * maximum number of latest posts to show.
   */
  limit?: number;

  /**
   * maps domain ids to their Hebrew display name for the post chips.
   */
  domainNames?: Record<string, string>;

  /**
   * provide mock posts to bypass the GraphQL query, useful for tests and previews.
   */
  mockPosts?: UsePostsOptions['mockData'];

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
 * "מהבלוג" — a home-page preview of the latest published blog posts, shown as a
 * grid of post cards with a "see all" link to the full blog. registered into
 * the platform's HomeSection slot by the blog aspect. RTL, responsive.
 */
export function BlogPreview({
  eyebrow = `Blog Club`,
  title = `מהבלוג`,
  subtitle = `ידע מקצועי ושיתופים אישיים מהקהילה`,
  limit = 3,
  domainNames = DEFAULT_DOMAIN_NAMES,
  mockPosts,
  className,
  style,
}: BlogPreviewProps) {
  const hasMockPosts = mockPosts !== undefined;
  const { posts, loading } = usePosts(hasMockPosts ? { mockData: mockPosts } : undefined);

  const latest = posts.slice(0, limit);

  if (!loading && latest.length === 0) return null;

  return (
    <div className={classNames(styles.blogPreview, className)} style={style}>
      <div className={styles.inner}>
        <SectionLayout
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          action={
            <Link as={RouterLink} href="/blog" className={styles.seeAll}>
              לכל הכתבות ←
            </Link>
          }
        >
          <div className={styles.grid}>
            {latest.map((post) => (
              <PostCard
                key={post.id}
                title={post.title}
                excerpt={post.excerpt}
                coverImage={post.coverImage}
                authorName={post.authorName}
                date={formatPostDate(post.publishDate)}
                domains={post.domains.map((domain) => ({
                  id: domain,
                  slug: domain,
                  name: domainNames[domain] || domain,
                }))}
                membersOnly={post.isMembersOnly}
                href={`/blog/${post.slug}`}
              />
            ))}
          </div>
        </SectionLayout>
      </div>
    </div>
  );
}
