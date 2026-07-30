/**
 * Plain (serializable) representation of a Label.
 */
export type PlainLabel = {
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

/**
 * A Label groups media records into a project / series within
 * the knowledge base (e.g. "עזרה ראשונה", "אפטר").
 */
export class Label {
  constructor(
    /**
     * unique identifier of the label.
     */
    readonly id: string,

    /**
     * URL-friendly slug of the label, e.g. 'first-aid'.
     */
    readonly slug: string,

    /**
     * display name of the label, in Hebrew.
     */
    readonly name: string,

    /**
     * number of records associated with this label.
     */
    readonly recordCount: number,

    /**
     * optional description of the label, in Hebrew.
     */
    readonly description?: string,

    /**
     * optional cover image URL for the label.
     */
    readonly coverImage?: string
  ) {}

  /**
   * serialize a Label into a plain object.
   */
  toObject(): PlainLabel {
    const { id, slug, name, description, coverImage, recordCount } = this;
    return {
      id,
      slug,
      name,
      description,
      coverImage,
      recordCount,
    };
  }

  /**
   * create a Label instance from a plain object.
   */
  static from(plainLabel: PlainLabel): Label {
    const {
      id,
      slug,
      name,
      recordCount = 0,
      description = undefined,
      coverImage = undefined,
    } = plainLabel || ({} as PlainLabel);

    return new Label(id, slug, name, recordCount, description, coverImage);
  }
}
