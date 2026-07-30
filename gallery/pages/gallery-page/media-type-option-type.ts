import type { GalleryMediaType } from '@helemclub/gallery.entities.gallery-item';

/**
 * a single media-type filter option shown above the gallery grid.
 */
export type MediaTypeOption = {
  /**
   * the media type value used to filter items, or `undefined` for "all".
   */
  value?: GalleryMediaType;

  /**
   * the Hebrew label shown on the filter button.
   */
  label: string;
};
