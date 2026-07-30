/**
 * values managed by the create/edit label form.
 */
export type ManageLabelsFormValues = {
  /**
   * URL-friendly slug of the label, e.g. `first-aid`.
   */
  slug: string;

  /**
   * display name of the label, in Hebrew.
   */
  name: string;

  /**
   * description of the label, in Hebrew.
   */
  description: string;

  /**
   * cover image URL for the label.
   */
  coverImage: string;
};
