/**
 * The type of media a record points to.
 */
export type MediaType = 'video' | 'audio';

export type PlainMediaRecord = {
  /**
   * unique identifier of the record.
   */
  id: string;

  /**
   * url-friendly unique slug of the record.
   */
  slug: string;

  /**
   * id of the label (project) this record belongs to.
   */
  labelId: string;

  /**
   * title of the record.
   */
  title: string;

  /**
   * optional description of the record.
   */
  description?: string;

  /**
   * type of media (video or audio).
   */
  mediaType: MediaType;

  /**
   * external url of the media file.
   */
  mediaUrl: string;

  /**
   * optional url of the thumbnail image.
   */
  thumbnailUrl?: string;

  /**
   * optional duration of the media, in seconds.
   */
  durationSec?: number;

  /**
   * domains (topics) associated with the record.
   */
  domains?: string[];

  /**
   * number of times the record was viewed.
   */
  viewCount?: number;

  /**
   * ISO date string of when the record was published.
   */
  publishedAt: string;
};

/**
 * a media record entity, representing a single video or audio
 * item in the knowledge base.
 */
export class MediaRecord {
  constructor(
    /**
     * unique identifier of the record.
     */
    readonly id: string,

    /**
     * url-friendly unique slug of the record.
     */
    readonly slug: string,

    /**
     * id of the label (project) this record belongs to.
     */
    readonly labelId: string,

    /**
     * title of the record.
     */
    readonly title: string,

    /**
     * type of media (video or audio).
     */
    readonly mediaType: MediaType,

    /**
     * external url of the media file.
     */
    readonly mediaUrl: string,

    /**
     * domains (topics) associated with the record.
     */
    readonly domains: string[],

    /**
     * number of times the record was viewed.
     */
    readonly viewCount: number,

    /**
     * ISO date string of when the record was published.
     */
    readonly publishedAt: string,

    /**
     * optional description of the record.
     */
    readonly description?: string,

    /**
     * optional url of the thumbnail image.
     */
    readonly thumbnailUrl?: string,

    /**
     * optional duration of the media, in seconds.
     */
    readonly durationSec?: number
  ) {}

  /**
   * whether the record is a video.
   */
  get isVideo() {
    return this.mediaType === 'video';
  }

  /**
   * whether the record is an audio.
   */
  get isAudio() {
    return this.mediaType === 'audio';
  }

  /**
   * human readable duration, formatted as `mm:ss` or `h:mm:ss`.
   */
  get formattedDuration(): string | undefined {
    const { durationSec } = this;
    if (durationSec === undefined || Number.isNaN(durationSec)) return undefined;

    const totalSeconds = Math.max(0, Math.round(durationSec));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const paddedSeconds = String(seconds).padStart(2, '0');

    if (hours > 0) {
      const paddedMinutes = String(minutes).padStart(2, '0');
      return `${hours}:${paddedMinutes}:${paddedSeconds}`;
    }

    return `${minutes}:${paddedSeconds}`;
  }

  /**
   * serialize a MediaRecord into a plain object.
   */
  toObject(): PlainMediaRecord {
    return {
      id: this.id,
      slug: this.slug,
      labelId: this.labelId,
      title: this.title,
      description: this.description,
      mediaType: this.mediaType,
      mediaUrl: this.mediaUrl,
      thumbnailUrl: this.thumbnailUrl,
      durationSec: this.durationSec,
      domains: this.domains,
      viewCount: this.viewCount,
      publishedAt: this.publishedAt,
    };
  }

  /**
   * create a MediaRecord from a plain object.
   */
  static from(plainMediaRecord: PlainMediaRecord): MediaRecord {
    const {
      id,
      slug,
      labelId,
      title,
      mediaType,
      mediaUrl,
      domains = [],
      viewCount = 0,
      publishedAt,
      description,
      thumbnailUrl,
      durationSec,
    } = plainMediaRecord;

    return new MediaRecord(
      id,
      slug,
      labelId,
      title,
      mediaType,
      mediaUrl,
      domains,
      viewCount,
      publishedAt,
      description,
      thumbnailUrl,
      durationSec
    );
  }
}
