/**
 * plain, serializable gallery item record used to seed the admin table with
 * mock data, forwarded as-is to the useGallery hook.
 */
export type GalleryItemRecord = {
  /**
   * unique identifier of the gallery item.
   */
  id: string;

  /**
   * URL-friendly unique identifier of the gallery item.
   */
  slug: string;

  /**
   * title of the artwork.
   */
  title: string;

  /**
   * optional description of the artwork.
   */
  description?: string;

  /**
   * type of media (image or video).
   */
  mediaType: 'image' | 'video';

  /**
   * URL of the full media asset.
   */
  mediaUrl: string;

  /**
   * optional URL of a thumbnail/preview image.
   */
  thumbnailUrl?: string;

  /**
   * optional name of the contributing artist.
   */
  artistName?: string;

  /**
   * coping-domains this artwork is tagged with.
   */
  domains: string[];

  /**
   * ISO date string of when the item was created.
   */
  createdAt: string;
};
