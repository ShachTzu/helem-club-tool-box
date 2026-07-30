import React from 'react';
import classNames from 'classnames';
import { mockGalleryItem, type PlainGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { PlayIcon } from './play-icon.js';
import styles from './gallery-tile.module.scss';

const defaultItem: PlainGalleryItem = mockGalleryItem().toObject();

export type GalleryTileProps = {
  /**
   * the gallery item to render in the tile.
   */
  item?: PlainGalleryItem;

  /**
   * handler called when the tile is opened, receives the item slug.
   */
  onOpen?: (slug: string) => void;

  /**
   * class name for the tile.
   */
  className?: string;

  /**
   * style for the tile.
   */
  style?: React.CSSProperties;
};

/**
 * a gallery tile for the masonry grid — renders an image or video
 * thumbnail with a hover overlay showing the title and artist name.
 * clicking the tile opens the lightbox or detail view via `onOpen`.
 */
export function GalleryTile({ item = defaultItem, onOpen, className, style }: GalleryTileProps) {
  const isVideo = item.mediaType === `video`;
  const thumbnail = item.thumbnailUrl || item.mediaUrl;

  return (
    <button
      type="button"
      className={classNames(styles.tile, className)}
      style={style}
      onClick={() => onOpen?.(item.slug)}
    >
      <div className={styles.mediaWrapper}>
        <img className={styles.image} src={thumbnail} alt={item.title} loading="lazy" />
        {isVideo && (
          <div className={styles.playBadge}>
            <PlayIcon className={styles.playIcon} />
          </div>
        )}
        <div className={styles.overlay}>
          <p className={styles.title}>{item.title}</p>
          {item.artistName && <p className={styles.artist}>{item.artistName}</p>}
        </div>
      </div>
    </button>
  );
}
