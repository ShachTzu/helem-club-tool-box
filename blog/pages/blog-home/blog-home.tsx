import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { PageLayout } from '@helemclub/design.layouts.page-layout';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import { DomainFilter, type DomainFilterProps } from '@helemclub/knowledge-domains.ui.domain-filter';
import { PostCard } from '@helemclub/blog.ui.post-card';
import { usePosts, type UsePostsOptions } from '@helemclub/blog.hooks.use-posts';
import { DEFAULT_DOMAIN_NAMES } from './blog-home-domain-names.js';
import { formatPostDate } from './blog-home-format-date.js';
import styles from './blog-home.module.scss';

const SKELETON_COUNT = 6;

export type BlogHomeProps = {
  /**
   * small eyebrow label shown above the hero title.
   */
  heroEyebrow?: string;

  /**
   * main hero title of the blog home page.
   */
  heroTitle?: string;

  /**
   * hero subtitle describing the blog's purpose.
   */
  heroSubtitle?: string;

  /**
   * route navigated to when a visitor wants to submit a community article.
   */
  submitHref?: string;

  /**
   * maps domain ids (or names) tagged on posts to their Hebrew display name.
   */
  domainNames?: Record<string, string>;

  /**
   * provide mock posts data to bypass the GraphQL query, useful for tests and previews.
   */
  mockPosts?: UsePostsOptions['mockData'];

  /**
   * provide mock domains data to the domain filter, useful for tests and previews.
   */
  mockDomains?: DomainFilterProps['mockDomains'];

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
 * blog home page (/blog): a hero band followed by a filterable grid of published posts.
 * only domains tagged on a published post are shown in the filter. reading is free and
 * open to all visitors, no sign-in required. RTL, responsive.
 */
export function BlogHome({
  heroEyebrow = `Blog Club`,
  heroTitle = `הבלוג של הלם קלאב`,
  heroSubtitle = `ידע מקצועי, חוויות אישיות, והשראה לחיים לצד הפוסט-טראומה. קריאה חופשית — בלי הרשמה.`,
  submitHref = `/blog/submit`,
  domainNames = DEFAULT_DOMAIN_NAMES,
  mockPosts,
  mockDomains,
  className,
  style,
}: BlogHomeProps) {
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  const hasMockPosts = mockPosts !== undefined;
  const { posts, loading } = usePosts(hasMockPosts ? { mockData: mockPosts } : undefined);

  const selectedNames = useMemo(
    () => selectedDomains.map((domainId) => domainNames[domainId] || domainId),
    [selectedDomains, domainNames]
  );

  const filteredPosts = useMemo(() => {
    if (selectedDomains.length === 0) return posts;
    return posts.filter((post) =>
      post.domains.some((domain) => selectedDomains.includes(domain) || selectedNames.includes(domain))
    );
  }, [posts, selectedDomains, selectedNames]);

  return (
    <div className={classNames(styles.blogHome, className)} style={style}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          {heroEyebrow && <div className={styles.heroEyebrow}>{heroEyebrow}</div>}
          <h1 className={styles.heroTitle}>{heroTitle}</h1>
          {heroSubtitle && <p className={styles.heroSubtitle}>{heroSubtitle}</p>}
        </div>
      </section>

      <PageLayout>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>{`${filteredPosts.length} כתבות`}</h2>
          <Link to={submitHref} className={styles.submitButton}>
            ✍️ הגשת כתבה
          </Link>
        </div>

        <DomainFilter
          value={selectedDomains}
          onChange={(nextSelected) => setSelectedDomains(nextSelected)}
          onlyWithContent
          mockDomains={mockDomains}
          className={styles.domainFilter}
        />

        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: SKELETON_COUNT }).map((_, index) => (
              <div key={index} className={styles.skeletonCard} />
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <EmptyState
            title="לא נמצאו כתבות בתחומים שנבחרו"
            description="נסו לבחור תחומים אחרים, או לאפס את הסינון כדי לראות את כל הכתבות."
            actionLabel={selectedDomains.length > 0 ? `איפוס סינון` : undefined}
            onAction={selectedDomains.length > 0 ? () => setSelectedDomains([]) : undefined}
          />
        )}

        {!loading && filteredPosts.length > 0 && (
          <div className={styles.grid}>
            {filteredPosts.map((post) => (
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
        )}
      </PageLayout>
    </div>
  );
}
