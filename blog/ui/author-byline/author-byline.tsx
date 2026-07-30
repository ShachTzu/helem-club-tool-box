import React from 'react';
import classNames from 'classnames';
import { Avatar } from '@helemclub/design.content.avatar';
import { Paragraph } from '@helemclub/design.typography.paragraph';
import type { AuthorBylineSize } from './author-byline-size-type.js';
import styles from './author-byline.module.scss';

const AVATAR_SIZE_MAP: Record<AuthorBylineSize, 'small' | 'medium' | 'large'> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
};

export type AuthorBylineProps = {
  /**
   * display name of the author.
   */
  authorName?: string;

  /**
   * url of the author's profile photo.
   */
  authorPhoto?: string;

  /**
   * formatted publish date label, for example "12 במאי 2026".
   */
  date?: string;

  /**
   * optional read time label, for example "6 דק׳ קריאה".
   */
  readTime?: string;

  /**
   * optional short biography rendered below the name and date.
   */
  bio?: string;

  /**
   * renders the byline as anonymous, hiding the author's name and photo.
   */
  anonymous?: boolean;

  /**
   * controls the size of the avatar and text.
   */
  size?: AuthorBylineSize;

  /**
   * class name for the byline.
   */
  className?: string;

  /**
   * style for the byline.
   */
  style?: React.CSSProperties;
};

export function AuthorByline({
  authorName = `ד״ר מיכל ברק`,
  authorPhoto,
  date = `12 במאי 2026`,
  readTime,
  bio,
  anonymous = false,
  size = 'md',
  className,
  style,
}: AuthorBylineProps) {
  const avatarSize = AVATAR_SIZE_MAP[size];
  const displayName = anonymous ? `אנונימי/ת` : authorName;

  return (
    <div className={classNames(styles.byline, styles[size], className)} style={style}>
      <Avatar name={displayName} imageUrl={authorPhoto} size={avatarSize} anonymous={anonymous} />
      <div className={styles.info}>
        <div className={styles.headerRow}>
          <span className={styles.name}>{displayName}</span>
          <span className={styles.meta}>
            {date}
            {readTime ? ` · ${readTime}` : ''}
          </span>
        </div>
        {bio && (
          <Paragraph size="sm" muted className={styles.bio}>
            {bio}
          </Paragraph>
        )}
      </div>
    </div>
  );
}
