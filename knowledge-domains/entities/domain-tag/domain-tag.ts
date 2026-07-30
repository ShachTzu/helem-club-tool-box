export type PlainDomainTag = {
  /**
   * unique identifier of the tag association.
   */
  id: string;

  /**
   * id of the knowledge domain this tag points to.
   */
  domainId: string;

  /**
   * type of the content being tagged (e.g. 'app', 'post', 'record', 'event', 'gallery').
   */
  targetType: string;

  /**
   * id of the tagged content item.
   */
  targetId: string;
};

/**
 * DomainTag is a polymorphic association entity linking a knowledge domain
 * to any piece of content across the ecosystem (apps, posts, records, events, gallery items).
 */
export class DomainTag {
  constructor(
    /**
     * unique identifier of the tag association.
     */
    readonly id: string,

    /**
     * id of the knowledge domain this tag points to.
     */
    readonly domainId: string,

    /**
     * type of the content being tagged (e.g. 'app', 'post', 'record', 'event', 'gallery').
     */
    readonly targetType: string,

    /**
     * id of the tagged content item.
     */
    readonly targetId: string
  ) {}

  /**
   * serialize a DomainTag into a plain object.
   */
  toObject(): PlainDomainTag {
    return {
      id: this.id,
      domainId: this.domainId,
      targetType: this.targetType,
      targetId: this.targetId,
    };
  }

  /**
   * create a DomainTag instance from a plain object.
   */
  static from(plainDomainTag: PlainDomainTag) {
    const { id, domainId = '', targetType = '', targetId = '' } = plainDomainTag || ({} as PlainDomainTag);
    return new DomainTag(id, domainId, targetType, targetId);
  }
}
