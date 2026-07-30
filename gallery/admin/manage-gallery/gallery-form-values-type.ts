/**
 * media kind supported by a gallery item.
 */
export type GalleryFormMediaType = 'image' | 'video';

/**
 * controlled form values used by the create/edit gallery item form.
 */
export type GalleryFormValues = {
  /**
   * title of the artwork.
   */
  title: string;

  /**
   * optional description of the artwork.
   */
  description: string;

  /**
   * type of media (image or video).
   */
  mediaType: GalleryFormMediaType;

  /**
   * URL of the full media asset.
   */
  mediaUrl: string;

  /**
   * optional URL of a thumbnail/preview image.
   */
  thumbnailUrl: string;

  /**
   * optional name of the contributing artist.
   */
  artistName: string;

  /**
   * coping-domain ids this artwork is tagged with.
   */
  domains: string[];
};
