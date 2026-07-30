import React from 'react';
import classNames from 'classnames';
import { AvatarIcon } from './avatar-icon.js';
import type { AvatarSize } from './avatar-size-type.js';
import styles from './avatar.module.scss';

const SIZE_CLASSNAMES: Record<AvatarSize, string> = {
  small: styles.small,
  medium: styles.medium,
  large: styles.large,
  'x-large': styles.xLarge,
};

export type AvatarProps = {
  /**
   * the display name of the user, used to derive initials
   * and as the image alt text.
   */
  name?: string;

  /**
   * url of the avatar image. when not provided (or fails to load)
   * the component falls back to initials or an anonymous placeholder.
   */
  imageUrl?: string;

  /**
   * the size of the avatar.
   */
  size?: AvatarSize;

  /**
   * renders a highlighted ring around the avatar.
   */
  ring?: boolean;

  /**
   * marks the avatar as an anonymous user, rendering
   * a generic placeholder icon instead of initials.
   */
  anonymous?: boolean;

  /**
   * class name for the avatar.
   */
  className?: string;

  /**
   * style for the avatar.
   */
  style?: React.CSSProperties;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return `${parts[0].charAt(0)}${parts[parts.length - 1].charAt(0)}`.toUpperCase();
}

/**
 * displays a user avatar image, falling back to initials
 * derived from the user's name, or a generic placeholder
 * icon for anonymous users.
 */
export function Avatar({
  name = `אורח/ת`,
  imageUrl,
  size = 'medium',
  ring = false,
  anonymous = false,
  className,
  style,
}: AvatarProps) {
  const [imageFailed, setImageFailed] = React.useState(false);

  const showImage = Boolean(imageUrl) && !anonymous && !imageFailed;
  const initials = getInitials(name);
  const showInitials = !showImage && !anonymous && Boolean(initials);

  return (
    <div
      className={classNames(styles.avatar, SIZE_CLASSNAMES[size], ring && styles.ring, className)}
      style={style}
      title={anonymous ? `אורח/ת` : name}
    >
      {showImage && (
        <img
          className={styles.image}
          src={imageUrl}
          alt={name}
          onError={() => setImageFailed(true)}
        />
      )}
      {!showImage && showInitials && <span className={styles.initials}>{initials}</span>}
      {!showImage && !showInitials && (
        <span className={styles.anonymous}>
          <AvatarIcon />
        </span>
      )}
    </div>
  );
}
