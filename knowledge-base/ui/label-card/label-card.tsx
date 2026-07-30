import React from 'react';
import classNames from 'classnames';
import { Link as RouterLink } from 'react-router-dom';
import { Link } from '@helemclub/design.navigation.link';
import { Card } from '@helemclub/design.content.card';
import { Image } from '@helemclub/design.content.image';
import { Heading } from '@helemclub/design.typography.heading';
import { mockLabel, type PlainLabel } from '@helemclub/knowledge-base.entities.label';
import styles from './label-card.module.scss';

const DEFAULT_LABEL: PlainLabel = mockLabel();

export type LabelCardProps = {
  /**
   * the label (project) to display in the card.
   */
  label?: PlainLabel;

  /**
   * the destination url of the label's lobby page.
   * defaults to a route derived from the label slug.
   */
  href?: string;

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
 * a card presenting a knowledge-base label (project): cover image, name,
 * description and record count. links to the label's lobby page. RTL.
 */
export function LabelCard({ label = DEFAULT_LABEL, href, className, style }: LabelCardProps) {
  const { name, description, coverImage, recordCount, slug } = label;
  const resolvedHref = href || `/knowledge/${slug}`;

  return (
    <Link
      as={RouterLink}
      href={resolvedHref}
      block
      className={classNames(styles.cardLink, className)}
      style={style}
    >
      <Card padding="none" className={styles.card}>
        <div className={styles.coverWrapper}>
          <Image
            src={coverImage}
            alt={name}
            aspectRatio="16 / 10"
            rounded="none"
            className={styles.cover}
          />
          <div className={styles.overlay} />
          <div className={styles.overlayContent}>
            <Heading level={4} as="h3" color="inverse" className={styles.name}>
              {name}
            </Heading>
          </div>
        </div>
        <div className={styles.body}>
          {description && <p className={styles.description}>{description}</p>}
          <span className={styles.count}>{`${recordCount} תכנים ←`}</span>
        </div>
      </Card>
    </Link>
  );
}
