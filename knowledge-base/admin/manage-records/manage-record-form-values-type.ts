import type { CreateRecordInput } from '@helemclub/knowledge-base.hooks.use-records';

/**
 * values managed by the create/edit media record form.
 */
export type ManageRecordFormValues = {
  /**
   * id of the label (project) the record belongs to.
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
  thumbnailUrl: string;

  /**
   * domains (topics) associated with the record.
   */
  domains: string[];
};
