export type PostStatus = 'draft' | 'pending' | 'published' | 'rejected';

export type PostVisibility = 'public' | 'members_only';

export type PlainPost = {
  /**
   * unique identifier of the post.
   */
  id: string;

  /**
   * url-friendly unique slug of the post.
   */
  slug: string;

  /**
   * title of the post.
   */
  title: string;

  /**
   * short excerpt / summary of the post.
   */
  excerpt: string;

  /**
   * optional cover image url.
   */
  coverImage?: string;

  /**
   * rich text body of the post (html/markdown).
   */
  body: string;

  /**
   * display name of the author.
   */
  authorName: string;

  /**
   * optional reference id to the author's user/account record.
   */
  authorRef?: string;

  /**
   * whether the author is a staff member of the organization.
   */
  isStaffAuthor: boolean;

  /**
   * coping-domains the post is tagged with.
   */
  domains: string[];

  /**
   * toolbox app ids embedded within the post body.
   */
  embeddedApps: string[];

  /**
   * moderation status of the post.
   */
  status: PostStatus;

  /**
   * visibility of the post.
   */
  visibility: PostVisibility;

  /**
   * optional meta description used for SEO.
   */
  metaDescription?: string;

  /**
   * ISO date string of when the post was (or will be) published.
   */
  publishDate?: string;

  /**
   * total number of views the post received.
   */
  viewCount: number;

  /**
   * number of unique visitors the post received.
   */
  uniqueVisitors: number;
};

export class Post {
  constructor(
    /**
     * unique identifier of the post.
     */
    readonly id: string,

    /**
     * url-friendly unique slug of the post.
     */
    readonly slug: string,

    /**
     * title of the post.
     */
    readonly title: string,

    /**
     * short excerpt / summary of the post.
     */
    readonly excerpt: string,

    /**
     * rich text body of the post (html/markdown).
     */
    readonly body: string,

    /**
     * display name of the author.
     */
    readonly authorName: string,

    /**
     * whether the author is a staff member of the organization.
     */
    readonly isStaffAuthor: boolean,

    /**
     * coping-domains the post is tagged with.
     */
    readonly domains: string[],

    /**
     * toolbox app ids embedded within the post body.
     */
    readonly embeddedApps: string[],

    /**
     * moderation status of the post.
     */
    readonly status: PostStatus,

    /**
     * visibility of the post.
     */
    readonly visibility: PostVisibility,

    /**
     * total number of views the post received.
     */
    readonly viewCount: number,

    /**
     * number of unique visitors the post received.
     */
    readonly uniqueVisitors: number,

    /**
     * optional cover image url.
     */
    readonly coverImage?: string,

    /**
     * optional reference id to the author's user/account record.
     */
    readonly authorRef?: string,

    /**
     * optional meta description used for SEO.
     */
    readonly metaDescription?: string,

    /**
     * ISO date string of when the post was (or will be) published.
     */
    readonly publishDate?: string
  ) {}

  /**
   * whether the post is publicly visible to any reader.
   */
  get isPublished(): boolean {
    return this.status === 'published';
  }

  /**
   * whether the post requires community membership to be read.
   */
  get isMembersOnly(): boolean {
    return this.visibility === 'members_only';
  }

  /**
   * serialize a Post into a plain, JSON-serializable object.
   */
  toObject(): PlainPost {
    return {
      id: this.id,
      slug: this.slug,
      title: this.title,
      excerpt: this.excerpt,
      coverImage: this.coverImage,
      body: this.body,
      authorName: this.authorName,
      authorRef: this.authorRef,
      isStaffAuthor: this.isStaffAuthor,
      domains: this.domains,
      embeddedApps: this.embeddedApps,
      status: this.status,
      visibility: this.visibility,
      metaDescription: this.metaDescription,
      publishDate: this.publishDate,
      viewCount: this.viewCount,
      uniqueVisitors: this.uniqueVisitors,
    };
  }

  /**
   * create a Post instance from a plain object. `status` and `visibility`
   * accept plain strings (e.g. from a database model) and are normalized to
   * their respective union types.
   */
  static from(
    plainPost: Partial<Omit<PlainPost, 'status' | 'visibility'>> & {
      status?: string;
      visibility?: string;
    }
  ): Post {
    const {
      id = '',
      slug = '',
      title = '',
      excerpt = '',
      coverImage,
      body = '',
      authorName = '',
      authorRef,
      isStaffAuthor = false,
      domains = [],
      embeddedApps = [],
      status = 'draft',
      visibility = 'public',
      metaDescription,
      publishDate,
      viewCount = 0,
      uniqueVisitors = 0,
    } = plainPost;

    return new Post(
      id,
      slug,
      title,
      excerpt,
      body,
      authorName,
      isStaffAuthor,
      domains,
      embeddedApps,
      status as PostStatus,
      visibility as PostVisibility,
      viewCount,
      uniqueVisitors,
      coverImage,
      authorRef,
      metaDescription,
      publishDate
    );
  }
}
