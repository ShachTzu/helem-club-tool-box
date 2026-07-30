import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { TagChip } from '@helemclub/design.content.tag-chip';
import type { DomainBadgeItem } from './domain-badge-item-type.js';
import styles from './domain-badge.module.scss';

const DEFAULT_DOMAINS: DomainBadgeItem[] = [
  { id: 'anxiety', slug: 'anxiety', name: `חרדה` },
  { id: 'sleep', slug: 'sleep', name: `שינה` },
  { id: 'loneliness-connection', slug: 'loneliness-connection', name: `בדידות וחיבור חברתי` },
];

export type DomainBadgeProps = {
  /**
   * the domain tags to render as read-only chips. renders one chip per domain.
   */
  domains?: DomainBadgeItem[];

  /**
   * base path used to build the link to a domain's lobby page, e.g. `${domainLinkBase}/${slug}`.
   */
  domainLinkBase?: string;

  /**
   * class name for overriding the container styles.
   */
  className?: string;

  /**
   * style for overriding the container styles.
   */
  style?: React.CSSProperties;
};

/**
 * renders one or many knowledge-domain tags as read-only chips, each linking
 * to that domain's lobby page. used across the Helam Club ecosystem to
 * surface the coping domains a piece of content is tagged with.
 */
export function DomainBadge({
  domains = DEFAULT_DOMAINS,
  domainLinkBase = `/domains`,
  className,
  style,
}: DomainBadgeProps) {
  if (domains.length === 0) return null;

  return (
    <div className={classNames(styles.domainBadge, className)} style={style}>
      {domains.map((domain) => (
        <Link key={domain.id} to={`${domainLinkBase}/${domain.slug}`} className={styles.chipLink}>
          <TagChip label={domain.name} />
        </Link>
      ))}
    </div>
  );
}
