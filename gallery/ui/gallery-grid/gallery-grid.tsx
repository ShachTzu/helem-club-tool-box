import React from 'react';
import classNames from 'classnames';
import { mockGalleryItems, type PlainGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { GalleryTile } from '@helemclub/gallery.ui.gallery-tile';
import { EmptyState } from '@helemclub/design.feedback.empty-state';
import styles from './gallery-grid.module.scss';

const defaultItems: PlainGalleryItem[] = mockGalleryItems().map((item) => item.toObject());

export type GalleryGridProps = {
  /**
   * gallery items to render in the masonry grid.
   */
  items?: PlainGalleryItem[];

  /**
   * handler called when a tile is opened, receives the item slug.
   */
  onOpenItem?: (slug: string) => void;

  /**
   * title shown in the empty state when there are no items.
   */
  emptyTitle?: string;

  /**
   * description shown in the empty state when there are no items.
   */
  emptyDescription?: string;

  /**
   * class name for the grid container.
   */
  className?: string;

  /**
   * style for the grid container.
   */
  style?: React.CSSProperties;
};

/**
 * a responsive masonry grid of gallery tiles, showing images and
 * videos from the community gallery. renders a friendly empty state
 * when there are no items to display.
 */
export function GalleryGrid({
  items = defaultItems,
  onOpenItem,
  emptyTitle = `עדיין אין יצירות בגלריה`,
  emptyDescription = `ברגע שיצירות חדשות יתווספו לגלריה, הן יופיעו כאן.`,
  className,
  style,
}: GalleryGridProps) {
  if (items.length === 0) {
    return (
      <div className={classNames(styles.emptyWrapper, className)} style={style}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div className={classNames(styles.grid, className)} style={style}>
      {items.map((item) => (
        <div key={item.slug} className={styles.tileWrapper}>
          <GalleryTile item={item} onOpen={(slug) => onOpenItem?.(slug)} />
        </div>
      ))}
    </div>
  );
}
