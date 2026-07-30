/**
 * a media record shown in the knowledge base lobby's discovery feed,
 * structurally compatible with the knowledge-base media-record entity's
 * plain representation.
 */
export type KnowledgeLobbyRecord = {
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
  mediaType: 'video' | 'audio';

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
