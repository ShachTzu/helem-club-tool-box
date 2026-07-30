/**
 * a single piece of content tagged with one or more knowledge domains,
 * originating from anywhere across the Helam Club ecosystem (apps, posts,
 * records, events, gallery items, etc). matches the `TaggedContent` shape
 * consumed by hooks/use-domain-content.
 */
export type TaggedContent = {
  /**
   * the content type provider (e.g. 'app', 'post', 'record', 'event', 'gallery').
   */
  type: string;

  /**
   * unique identifier of the content item.
   */
  id: string;

  /**
   * display title of the content item.
   */
  title: string;

  /**
   * short excerpt or description of the content item.
   */
  excerpt?: string;

  /**
   * link to the content item.
   */
  url: string;

  /**
   * optional cover/preview image for the content item.
   */
  imageUrl?: string;

  /**
   * ids of the knowledge domains this content is tagged with.
   */
  domains: string[];
};

/**
 * a persisted association between a content item and a knowledge domain,
 * matching the `PlainDomainTag` shape returned by the tagContent mutation.
 */
export type DomainTag = {
  /**
   * unique identifier of the tag association.
   */
  id: string;

  /**
   * id of the knowledge domain.
   */
  domainId: string;

  /**
   * the content type provider (e.g. 'app', 'post', 'record', 'event', 'gallery').
   */
  targetType: string;

  /**
   * id of the tagged content item.
   */
  targetId: string;
};

/**
 * options for querying content tagged with a specific domain.
 */
export type GetContentByDomainOptions = {
  /**
   * id (or slug) of the knowledge domain to fetch content for.
   */
  domainId: string;

  /**
   * restrict the results to specific content types (e.g. ['post', 'event']).
   */
  types?: string[];

  /**
   * maximum number of content items to return.
   */
  limit?: number;

  /**
   * number of content items to skip, for pagination.
   */
  offset?: number;
};

/**
 * options for resolving which domains a specific content item is tagged with.
 */
export type GetContentDomainsOptions = {
  /**
   * the content type provider of the object.
   */
  targetType: string;

  /**
   * id of the content object.
   */
  targetId: string;
};

/**
 * options for tagging a content item with a set of knowledge domains.
 */
export type TagContentOptions = {
  /**
   * the content type provider of the object.
   */
  targetType: string;

  /**
   * id of the content object.
   */
  targetId: string;

  /**
   * ids of the domains to associate with the content object.
   */
  domainIds: string[];
};
