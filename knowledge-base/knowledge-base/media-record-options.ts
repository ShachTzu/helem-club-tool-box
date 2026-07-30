import type { MediaType } from '@helemclub/knowledge-base.entities.media-record';

/**
 * options accepted when listing / filtering media records.
 */
export type ListRecordsOptions = {
  /**
   * filter records belonging to a specific label (project).
   */
  labelId?: string;

  /**
   * filter records tagged with any of the given coping domains.
   */
  domainIds?: string[];

  /**
   * free text search query, matched against title and description.
   */
  query?: string;

  /**
   * maximum number of records to return.
   */
  limit?: number;
};

/**
 * input required to create a new media record.
 */
export type CreateRecordOptions = {
  labelId: string;
  title: string;
  description?: string;
  mediaType?: MediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  durationSec?: number;
  domains?: string[];
  /**
   * optional slug. when omitted, a slug is derived from the title.
   */
  slug?: string;
  /**
   * optional ISO publish date. defaults to now.
   */
  publishedAt?: string;
};

/**
 * input accepted to update an existing media record. all fields are optional.
 */
export type UpdateRecordOptions = {
  labelId?: string;
  title?: string;
  description?: string;
  mediaType?: MediaType;
  mediaUrl?: string;
  thumbnailUrl?: string;
  durationSec?: number;
  domains?: string[];
};

/**
 * input accepted to create or update a label by its slug.
 */
export type UpsertLabelOptions = {
  slug: string;
  name: string;
  description?: string;
  coverImage?: string;
};
