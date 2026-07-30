import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { StarRating } from '@helemclub/design.content.star-rating';
import { Image } from '@helemclub/design.content.image';
import { DomainBadge } from '@helemclub/knowledge-domains.ui.domain-badge';
import type { AppCardDomain } from './app-card-domain-type.js';
import { DEFAULT_APP_CARD_DOMAINS } from './app-card.mock.js';
import styles from './app-card.module.scss';

const IMAGE_URL_PATTERN = /^https?:\/\//;

export type AppCardProps = {
  /**
   * icon representing the app: an emoji character, or an image url.
   */
  icon?: string;

  /**
   * display name of the app.
   */
  name?: string;

  /**
   * short one-line subtitle describing the app.
   */
  subtitle?: string;

  /**
   * average rating of the app, from 0 to 5.
   */
  avgRating?: number;

  /**
   * total number of ratings submitted for the app.
   */
  ratingCount?: number;

  /**
   * number of times the app link was clicked.
   */
  clickCount?: number;

  /**
   * marks the app as featured/recommended by the community, rendering a ribbon.
   */
  isFeatured?: boolean;

  /**
   * coping domains the app is tagged with, rendered as badges linking to the domain lobby.
   */
  domains?: AppCardDomain[];

  /**
   * base path used to build the link to a domain's lobby page.
   */
  domainLinkBase?: string;

  /**
   * destination path the card links to, typically the app's detail page.
   */
  href?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

export function AppCard({
  icon = `🫧`,
  name = `נשימה רגועה`,
  subtitle = `תרגילי נשימה מודרכים להרגעה מיידית`,
  avgRating = 4.7,
  ratingCount = 96,
  clickCount = 1240,
  isFeatured = true,
  domains = DEFAULT_APP_CARD_DOMAINS,
  domainLinkBase = `/domains`,
  href = `/toolbox/breathe-calm`,
  className,
  style,
}: AppCardProps) {
  const isIconImage = IMAGE_URL_PATTERN.test(icon);

  return (
    <div className={classNames(styles.appCard, className)} style={style}>
      <Link to={href} className={styles.cardLink} aria-label={name} />

      <div className={styles.header}>
        <div className={styles.iconWrap}>
          {isIconImage ? (
            <Image className={styles.iconImage} src={icon} alt={name} aspectRatio="1 / 1" rounded="none" />
          ) : (
            <span>{icon}</span>
          )}
        </div>
        <div className={styles.body}>
          <div className={styles.titleRow}>
            <h3 className={styles.name}>{name}</h3>
            {isFeatured && <span className={styles.featuredBadge}>מומלץ ע&quot;י הקהילה</span>}
          </div>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </div>

      {domains.length > 0 && (
        <div className={styles.domainsRow}>
          <DomainBadge domains={domains} domainLinkBase={domainLinkBase} />
        </div>
      )}

      <div className={styles.footer}>
        <div className={styles.ratingRow}>
          {ratingCount > 0 ? (
            <StarRating value={avgRating} ratingCount={ratingCount} showValue size={16} />
          ) : (
            <span className={styles.noRating}>אין עדיין ביקורות — היו הראשונים</span>
          )}
        </div>
        <span className={styles.clickCount}>👆 {clickCount.toLocaleString(`he-IL`)}</span>
      </div>
    </div>
  );
}
