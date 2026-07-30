export type PlainDomain = {
  /**
   * unique identifier of the domain.
   */
  id: string;

  /**
   * url-friendly, unique slug of the domain.
   */
  slug: string;

  /**
   * display name of the domain, in Hebrew.
   */
  name: string;

  /**
   * short description of the domain.
   */
  description?: string;

  /**
   * icon (emoji or icon key) representing the domain.
   */
  icon?: string;

  /**
   * number of content items tagged with this domain.
   */
  count: number;
};

/**
 * a coping domain — a cross-cutting tag used to classify and discover
 * content (apps, posts, records, events, gallery items) across the ecosystem.
 */
export class Domain {
  constructor(
    /**
     * unique identifier of the domain.
     */
    readonly id: string,

    /**
     * url-friendly, unique slug of the domain.
     */
    readonly slug: string,

    /**
     * display name of the domain, in Hebrew.
     */
    readonly name: string,

    /**
     * number of content items tagged with this domain.
     */
    readonly count: number,

    /**
     * short description of the domain.
     */
    readonly description?: string,

    /**
     * icon (emoji or icon key) representing the domain.
     */
    readonly icon?: string
  ) {}

  /**
   * serialize a Domain into a plain object.
   */
  toObject(): PlainDomain {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      description: this.description,
      icon: this.icon,
      count: this.count,
    };
  }

  /**
   * create a Domain instance from a plain object.
   */
  static from(plainDomain: PlainDomain): Domain {
    const { id, slug, name, description, icon, count = 0 } = plainDomain || ({} as PlainDomain);
    return new Domain(id, slug, name, count, description, icon);
  }
}
