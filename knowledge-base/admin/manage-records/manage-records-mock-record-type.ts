import type { CreateRecordInput } from '@helemclub/knowledge-base.hooks.use-records';

/**
 * plain, serializable shape used to seed the records list with mock data,
 * bypassing the network request. useful for tests and compositions.
 */
export type ManageRecordsMockRecord = {
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
   * type of media (video or audio).
   */
  mediaType: CreateRecordInput['mediaType'];

  /**
   * external url of the media file.
   */
  mediaUrl: string;

  /**
   * optional url of the thumbnail image.
   */
  thumbnailUrl?: string;

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
