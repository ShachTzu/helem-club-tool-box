/**
 * Media type of a gallery item — a still image or a video clip.
 */
export type GalleryMediaType = 'image' | 'video';

/**
 * Plain, serializable representation of a GalleryItem.
 */
export type PlainGalleryItem = {
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
  mediaType: GalleryMediaType;

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

/**
 * GalleryItem entity, represents a single piece of community
 * artwork (image or video) shown in the PTSDART gallery.
 */
export class GalleryItem {
  constructor(
    /**
     * unique identifier of the gallery item.
     */
    readonly id: string,

    /**
     * URL-friendly unique identifier of the gallery item.
     */
    readonly slug: string,

    /**
     * title of the artwork.
     */
    readonly title: string,

    /**
     * type of media (image or video).
     */
    readonly mediaType: GalleryMediaType,

    /**
     * URL of the full media asset.
     */
    readonly mediaUrl: string,

    /**
     * coping-domains this artwork is tagged with.
     */
    readonly domains: string[],

    /**
     * ISO date string of when the item was created.
     */
    readonly createdAt: string,

    /**
     * optional description of the artwork.
     */
    readonly description?: string,

    /**
     * optional URL of a thumbnail/preview image.
     */
    readonly thumbnailUrl?: string,

    /**
     * optional name of the contributing artist.
     */
    readonly artistName?: string
  ) {}

  /**
   * serialize a GalleryItem into a plain object.
   */
  toObject(): PlainGalleryItem {
    return {
      id: this.id,
      slug: this.slug,
      title: this.title,
      description: this.description,
      mediaType: this.mediaType,
      mediaUrl: this.mediaUrl,
      thumbnailUrl: this.thumbnailUrl,
      artistName: this.artistName,
      domains: this.domains,
      createdAt: this.createdAt,
    };
  }

  /**
   * create a GalleryItem instance from a plain object.
   */
  static from(plainGalleryItem: PlainGalleryItem): GalleryItem {
    const {
      id,
      slug,
      title,
      description,
      mediaType,
      mediaUrl,
      thumbnailUrl,
      artistName,
      domains = [],
      createdAt,
    } = plainGalleryItem || ({} as PlainGalleryItem);

    return new GalleryItem(
      id,
      slug,
      title,
      mediaType,
      mediaUrl,
      domains,
      createdAt,
      description,
      thumbnailUrl,
      artistName
    );
  }
}
