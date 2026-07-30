/**
 * a project label shown in the knowledge base lobby, structurally
 * compatible with the knowledge-base label entity's plain representation.
 */
export type KnowledgeLobbyLabel = {
  /**
   * unique identifier of the label.
   */
  id: string;

  /**
   * URL-friendly slug of the label, e.g. 'first-aid'.
   */
  slug: string;

  /**
   * display name of the label, in Hebrew.
   */
  name: string;

  /**
   * optional description of the label, in Hebrew.
   */
  description?: string;

  /**
   * optional cover image URL for the label.
   */
  coverImage?: string;

  /**
   * number of records associated with this label.
   */
  recordCount: number;
};
