import React from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Card } from '@helemclub/design.content.card';
import { Image } from '@helemclub/design.content.image';
import { DomainBadge } from '@helemclub/knowledge-domains.ui.domain-badge';
import {
  MediaRecord,
  mockMediaRecord,
  type PlainMediaRecord,
} from '@helemclub/knowledge-base.entities.media-record';
import styles from './record-card.module.scss';

const DEFAULT_RECORD: PlainMediaRecord = mockMediaRecord().toObject();

export type RecordCardProps = {
  /**
   * the media record to display in the card.
   */
  record?: PlainMediaRecord;

  /**
   * the destination url of the record's page.
   * defaults to a route derived from the record slug.
   */
  href?: string;

  /**
   * base path used to build the link to a domain's lobby page.
   */
  domainLinkBase?: string;

  /**
   * class name to override the card root.
   */
  className?: string;

  /**
   * style to apply to the card root.
   */
  style?: React.CSSProperties;
};

/**
 * a card presenting a knowledge-base media record: thumbnail, title,
 * media-type badge, duration and domain badges. links to the record's page. RTL.
 */
export function RecordCard({
  record = DEFAULT_RECORD,
  href,
  domainLinkBase = `/domains`,
  className,
  style,
}: RecordCardProps) {
  const mediaRecord = MediaRecord.from(record);
  const { title, description, thumbnailUrl, domains, viewCount, slug } = record;
  const resolvedHref = href || `/knowledge/record/${slug}`;
  const domainItems = (domains || []).map((domain) => ({ id: domain, slug: domain, name: domain }));
  const duration = mediaRecord.formattedDuration;

  return (
    <Card padding="none" className={classNames(styles.card, className)} style={style}>
      <RouterLink to={resolvedHref} aria-label={title} className={styles.overlayLink} />
      <div className={styles.thumbnailWrapper}>
        <Image
          src={thumbnailUrl}
          alt={title}
          aspectRatio="16 / 9"
          rounded="none"
          className={styles.thumbnail}
        />
        <span className={styles.playOverlay}>
          {mediaRecord.isVideo ? (
            <svg viewBox="0 0 24 24" className={styles.playIcon} aria-hidden>
              <path d="M8 5v14l11-7Z" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" className={styles.playIcon} aria-hidden>
              <path
                d="M8 5.5v13a1 1 0 0 0 1.5.87l11-6.5a1 1 0 0 0 0-1.74l-11-6.5A1 1 0 0 0 8 5.5Z"
                fill="currentColor"
              />
            </svg>
          )}
        </span>
        {duration && <span className={styles.duration}>{duration}</span>}
      </div>
      <div className={styles.body}>
        <span
          className={classNames(
            styles.mediaTypeBadge,
            mediaRecord.isVideo ? styles.videoBadge : styles.audioBadge
          )}
        >
          {mediaRecord.isVideo ? `🎬 וידאו` : `🎧 אודיו`}
        </span>
        <h3 className={styles.title}>{title}</h3>
        {description && <p className={styles.description}>{description}</p>}
        {domainItems.length > 0 && (
          <DomainBadge domains={domainItems} domainLinkBase={domainLinkBase} className={styles.domains} />
        )}
        <span className={styles.views}>{`${(viewCount ?? 0).toLocaleString(`he-IL`)} צפיות`}</span>
      </div>
    </Card>
  );
}
