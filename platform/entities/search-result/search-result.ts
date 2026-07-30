/**
 * The type of content a search result represents.
 */
export type SearchResultType = 'app' | 'blog' | 'event' | 'gallery' | 'knowledge' | 'wisdom' | 'domain' | string;

export type PlainSearchResult = {
  /**
   * unique identifier of the search result.
   */
  id: string;

  /**
   * the kind of content this result represents (e.g. 'app', 'blog', 'event').
   */
  type: SearchResultType;

  /**
   * title of the search result.
   */
  title: string;

  /**
   * short excerpt / snippet describing the result.
   */
  excerpt?: string;

  /**
   * url to navigate to when the result is selected.
   */
  url: string;

  /**
   * optional thumbnail image url for the result.
   */
  imageUrl?: string;

  /**
   * coping domains associated with this result, used for filtering.
   */
  domains?: string[];
};

/**
 * SearchResult entity, representing a single item returned from a
 * platform-wide search query across registered search providers.
 */
export class SearchResult {
  constructor(
    /**
     * unique identifier of the search result.
     */
    readonly id: string,

    /**
     * the kind of content this result represents (e.g. 'app', 'blog', 'event').
     */
    readonly type: SearchResultType,

    /**
     * title of the search result.
     */
    readonly title: string,

    /**
     * url to navigate to when the result is selected.
     */
    readonly url: string,

    /**
     * short excerpt / snippet describing the result.
     */
    readonly excerpt?: string,

    /**
     * optional thumbnail image url for the result.
     */
    readonly imageUrl?: string,

    /**
     * coping domains associated with this result, used for filtering.
     */
    readonly domains?: string[]
  ) {}

  /**
   * serialize a SearchResult into a plain, serializable object.
   */
  toObject(): PlainSearchResult {
    return {
      id: this.id,
      type: this.type,
      title: this.title,
      url: this.url,
      excerpt: this.excerpt,
      imageUrl: this.imageUrl,
      domains: this.domains,
    };
  }

  /**
   * create a SearchResult instance from a plain object.
   */
  static from(plainSearchResult: PlainSearchResult): SearchResult {
    const {
      id,
      type,
      title,
      url,
      excerpt = undefined,
      imageUrl = undefined,
      domains = undefined,
    } = plainSearchResult || ({} as PlainSearchResult);

    return new SearchResult(id, type, title, url, excerpt, imageUrl, domains);
  }
}
