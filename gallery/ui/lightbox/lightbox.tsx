import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Modal } from '@helemclub/design.overlays.modal';
import type { PlainGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { ChevronLeftIcon } from './chevron-left-icon.js';
import { ChevronRightIcon } from './chevron-right-icon.js';
import styles from './lightbox.module.scss';

const defaultItem: PlainGalleryItem = {
  id: `1`,
  slug: `quiet-after-the-storm`,
  title: `שקט אחרי הסערה`,
  description: `יצירה שמבטאת את הרוגע שמגיע אחרי גל של הצפה רגשית.`,
  mediaType: `image`,
  mediaUrl: `https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_art_piece_symbol_0_1785184760565.png`,
  thumbnailUrl: `https://storage.googleapis.com/bit-generated-images/images/image_calm_abstract_art_piece_symbol_0_1785184760565.png`,
  artistName: `נועה ל.`,
  domains: [`ויסות רגשי`],
  createdAt: `2026-01-12T09:00:00.000Z`,
};

export type LightboxProps = {
  /**
   * controls whether the lightbox is rendered.
   */
  open: boolean;

  /**
   * called when the lightbox requests to be closed.
   */
  onClose: () => void;

  /**
   * the gallery item to display full-size.
   */
  item?: PlainGalleryItem;

  /**
   * called when the user requests the previous item.
   */
  onPrev?: () => void;

  /**
   * called when the user requests the next item.
   */
  onNext?: () => void;

  /**
   * whether a previous item is available.
   */
  hasPrev?: boolean;

  /**
   * whether a next item is available.
   */
  hasNext?: boolean;

  /**
   * current item position, 1-based, used for the counter label.
   */
  currentIndex?: number;

  /**
   * total number of items in the current collection.
   */
  totalCount?: number;

  /**
   * a class name to override root styles.
   */
  className?: string;

  /**
   * a style object to override root styles.
   */
  style?: React.CSSProperties;
};

export function Lightbox({
  open,
  onClose,
  item = defaultItem,
  onPrev,
  onNext,
  hasPrev = false,
  hasNext = false,
  currentIndex,
  totalCount,
  className,
  style,
}: LightboxProps) {
  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === `ArrowLeft` && hasNext) {
        onNext?.();
        return;
      }
      if (event.key === `ArrowRight` && hasPrev) {
        onPrev?.();
      }
    };

    document.addEventListener(`keydown`, handleKeyDown);
    return () => {
      document.removeEventListener(`keydown`, handleKeyDown);
    };
  }, [open, hasPrev, hasNext, onPrev, onNext]);

  const showCounter = typeof currentIndex === `number` && typeof totalCount === `number`;

  return (
    <Modal
      open={open}
      onClose={() => onClose()}
      title={item.title}
      size="large"
      dialogClassName={classNames(styles.dialog, className)}
      style={style}
    >
      <div className={styles.body}>
        <div className={styles.mediaWrapper}>
          {item.mediaType === `video` ? (
            <video className={styles.media} src={item.mediaUrl} controls poster={item.thumbnailUrl} />
          ) : (
            <img className={styles.media} src={item.mediaUrl} alt={item.title} />
          )}
          {hasPrev && (
            <button
              type="button"
              className={classNames(styles.navButton, styles.navEnd)}
              onClick={() => onPrev?.()}
              aria-label="היצירה הקודמת"
            >
              <ChevronRightIcon />
            </button>
          )}
          {hasNext && (
            <button
              type="button"
              className={classNames(styles.navButton, styles.navStart)}
              onClick={() => onNext?.()}
              aria-label="היצירה הבאה"
            >
              <ChevronLeftIcon />
            </button>
          )}
        </div>
        <div className={styles.meta}>
          {item.artistName && <p className={styles.artist}>{item.artistName}</p>}
          {item.description && <p className={styles.description}>{item.description}</p>}
          {item.domains.length > 0 && (
            <ul className={styles.domains}>
              {item.domains.map((domain) => (
                <li key={domain} className={styles.domainBadge}>
                  {domain}
                </li>
              ))}
            </ul>
          )}
          {showCounter && (
            <span className={styles.counter}>{`${currentIndex} מתוך ${totalCount}`}</span>
          )}
        </div>
      </div>
    </Modal>
  );
}
