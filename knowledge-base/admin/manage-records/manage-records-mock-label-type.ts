/**
 * plain, serializable shape used to seed the label dropdown with mock data,
 * bypassing the network request. useful for tests and compositions.
 */
export type ManageRecordsMockLabel = {
  /**
   * unique identifier of the label.
   */
  id: string;

  /**
   * url-friendly slug of the label.
   */
  slug: string;

  /**
   * display name of the label, in Hebrew.
   */
  name: string;

  /**
   * optional description of the label.
   */
  description?: string;

  /**
   * optional cover image url of the label.
   */
  coverImage?: string;

  /**
   * number of records associated with the label.
   */
  recordCount: number;
};
