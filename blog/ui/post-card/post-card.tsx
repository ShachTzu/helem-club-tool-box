import React from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@helemclub/design.navigation.link';
import { Card } from '@helemclub/design.content.card';
import { Image } from '@helemclub/design.content.image';
import { mockPost } from '@helemclub/blog.entities.post';
import { LockIcon } from './lock-icon.js';
import type { PostCardDomain } from './post-card-domain-type.js';
import styles from './post-card.module.scss';

const DEFAULT_POST = mockPost();

const DEFAULT_DOMAINS: PostCardDomain[] = [
  { id: 'shame-guilt', slug: 'shame-guilt', name: `אשמה, בושה וביקורת עצמית` },
  { id: 'emotional-regulation', slug: 'emotional-regulation', name: `ויסות רגשי` },
];

export type PostCardProps = {
  /**
   * title of the post.
   */
  title?: string;

  /**
   * short excerpt / summary of the post.
   */
  excerpt?: string;

  /**
   * cover image url of the post.
   */
  coverImage?: string;

  /**
   * display name of the post's author.
   */
  authorName?: string;

  /**
   * formatted publish date label, for example "12 במאי 2026".
   */
  date?: string;

  /**
   * coping-domains the post is tagged with, rendered as chips.
   */
  domains?: PostCardDomain[];

  /**
   * marks the post as restricted to community members only.
   */
  membersOnly?: boolean;

  /**
   * url of the post's page. the entire card links to this destination.
   */
  href?: string;

  /**
   * class name for the card.
   */
  className?: string;

  /**
   * style for the card.
   */
  style?: React.CSSProperties;
};

/**
 * a blog post preview card: cover image, title, excerpt, author, coping-domains,
 * publish date and a members-only badge. the entire card links to the post's page.
 */
export function PostCard({
  title = DEFAULT_POST.title,
  excerpt = DEFAULT_POST.excerpt,
  coverImage = DEFAULT_POST.coverImage,
  authorName = DEFAULT_POST.authorName,
  date = `12 במאי 2026`,
  domains = DEFAULT_DOMAINS,
  membersOnly = false,
  href = `/blog/${DEFAULT_POST.slug}`,
  className,
  style,
}: PostCardProps) {
  return (
    <Link
      as={RouterLink}
      href={href}
      block
      className={classNames(styles.cardLink, className)}
      style={style}
    >
      <Card padding="none" clickable className={styles.card}>
        <div className={styles.coverWrap}>
          <Image src={coverImage} alt={title} aspectRatio="16 / 9" rounded="none" />
          {membersOnly && (
            <span className={styles.membersBadge}>
              <LockIcon className={styles.membersBadgeIcon} />
              לחברי קהילה
            </span>
          )}
        </div>
        <div className={styles.content}>
          {domains.length > 0 && (
            <div className={styles.domainsRow}>
              {domains.slice(0, 2).map((domain) => (
                <span key={domain.id} className={styles.domainChip}>
                  {domain.name}
                </span>
              ))}
            </div>
          )}
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.excerpt}>{excerpt}</p>
          <div className={styles.metaRow}>
            <span className={styles.author}>{authorName}</span>
            <span className={styles.date}>{date}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
