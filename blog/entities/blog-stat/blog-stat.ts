/**
 * Plain representation of a single top-performing blog post.
 */
export type PlainBlogTopPost = {
  /**
   * unique id of the post.
   */
  id: string;

  /**
   * title of the post.
   */
  title: string;

  /**
   * total view count for the post.
   */
  views: number;
};

/**
 * A blog post entry ranked by views, used inside BlogStats.topPosts.
 */
export class BlogTopPost {
  constructor(
    /**
     * unique id of the post.
     */
    readonly id: string,

    /**
     * title of the post.
     */
    readonly title: string,

    /**
     * total view count for the post.
     */
    readonly views: number
  ) {}

  /**
   * serialize a BlogTopPost into a plain object.
   */
  toObject() {
    return {
      id: this.id,
      title: this.title,
      views: this.views,
    };
  }

  /**
   * create a BlogTopPost from a plain object.
   */
  static from(plainTopPost: PlainBlogTopPost) {
    const { id, title, views = 0 } = plainTopPost || ({} as PlainBlogTopPost);
    return new BlogTopPost(id, title, views);
  }
}

/**
 * Plain representation of a single post authored by a given author.
 */
export type PlainBlogAuthorPost = {
  /**
   * title of the post.
   */
  title: string;

  /**
   * publish date of the post.
   */
  date: string;
};

/**
 * A lightweight reference to a post, nested inside an author's stats.
 */
export class BlogAuthorPost {
  constructor(
    /**
     * title of the post.
     */
    readonly title: string,

    /**
     * publish date of the post.
     */
    readonly date: string
  ) {}

  /**
   * serialize a BlogAuthorPost into a plain object.
   */
  toObject() {
    return {
      title: this.title,
      date: this.date,
    };
  }

  /**
   * create a BlogAuthorPost from a plain object.
   */
  static from(plainAuthorPost: PlainBlogAuthorPost) {
    const { title, date } = plainAuthorPost || ({} as PlainBlogAuthorPost);
    return new BlogAuthorPost(title, date);
  }
}

/**
 * Plain representation of an author's contribution stats.
 */
export type PlainBlogAuthorStats = {
  /**
   * display name of the author.
   */
  name: string;

  /**
   * total number of posts published by the author.
   */
  postCount: number;

  /**
   * date of the author's most recent post.
   */
  lastPostDate?: string;

  /**
   * posts published by the author.
   */
  posts?: PlainBlogAuthorPost[];
};

/**
 * Aggregated stats for a single blog author, including their posts.
 */
export class BlogAuthorStats {
  constructor(
    /**
     * display name of the author.
     */
    readonly name: string,

    /**
     * total number of posts published by the author.
     */
    readonly postCount: number,

    /**
     * date of the author's most recent post.
     */
    readonly lastPostDate?: string,

    /**
     * posts published by the author.
     */
    readonly posts: BlogAuthorPost[] = []
  ) {}

  /**
   * virtual id of the author stats entry, derived from the author's name
   * since this aggregate has no natural identifier on the schema.
   */
  get id(): string {
    return this.name;
  }

  /**
   * serialize a BlogAuthorStats into a plain object.
   */
  toObject() {
    return {
      id: this.id,
      name: this.name,
      postCount: this.postCount,
      lastPostDate: this.lastPostDate,
      posts: this.posts.map((post) => post.toObject()),
    };
  }

  /**
   * create a BlogAuthorStats from a plain object.
   */
  static from(plainAuthorStats: PlainBlogAuthorStats) {
    const { name, postCount = 0, lastPostDate, posts = [] } =
      plainAuthorStats || ({} as PlainBlogAuthorStats);

    return new BlogAuthorStats(
      name,
      postCount,
      lastPostDate,
      posts.map((post) => BlogAuthorPost.from(post))
    );
  }
}

/**
 * Plain representation of the BlogStats entity.
 */
export type PlainBlogStats = {
  /**
   * unique id of the stats snapshot (e.g. per selected time range).
   */
  id?: string;

  /**
   * total number of published posts.
   */
  totalPosts: number;

  /**
   * total number of unique visitors across the blog.
   */
  uniqueVisitors: number;

  /**
   * total number of views across all posts.
   */
  totalViews: number;

  /**
   * top performing posts, ranked by views.
   */
  topPosts?: PlainBlogTopPost[];

  /**
   * per-author contribution stats.
   */
  authors?: PlainBlogAuthorStats[];

  /**
   * total number of comments across all posts.
   */
  comments: number;

  /**
   * total number of reactions across all posts.
   */
  reactions: number;

  /**
   * total number of saves/bookmarks across all posts.
   */
  saves: number;

  /**
   * total number of verified community members who engaged with the blog.
   */
  verifiedMembers: number;
};

/**
 * The BlogStats entity — an aggregated snapshot of blog activity, used to
 * power analytics dashboards for the Helam Club blog.
 */
export class BlogStats {
  constructor(
    /**
     * total number of published posts.
     */
    readonly totalPosts: number,

    /**
     * total number of unique visitors across the blog.
     */
    readonly uniqueVisitors: number,

    /**
     * total number of views across all posts.
     */
    readonly totalViews: number,

    /**
     * top performing posts, ranked by views.
     */
    readonly topPosts: BlogTopPost[] = [],

    /**
     * per-author contribution stats.
     */
    readonly authors: BlogAuthorStats[] = [],

    /**
     * total number of comments across all posts.
     */
    readonly comments: number = 0,

    /**
     * total number of reactions across all posts.
     */
    readonly reactions: number = 0,

    /**
     * total number of saves/bookmarks across all posts.
     */
    readonly saves: number = 0,

    /**
     * total number of verified community members who engaged with the blog.
     */
    readonly verifiedMembers: number = 0,

    /**
     * unique id of the stats snapshot (e.g. per selected time range).
     */
    readonly id: string = 'current'
  ) {}

  /**
   * serialize a BlogStats into a plain, serializable object.
   */
  toObject() {
    return {
      id: this.id,
      totalPosts: this.totalPosts,
      uniqueVisitors: this.uniqueVisitors,
      totalViews: this.totalViews,
      topPosts: this.topPosts.map((post) => post.toObject()),
      authors: this.authors.map((author) => author.toObject()),
      comments: this.comments,
      reactions: this.reactions,
      saves: this.saves,
      verifiedMembers: this.verifiedMembers,
    };
  }

  /**
   * create a BlogStats from a plain object.
   */
  static from(plainBlogStats: PlainBlogStats) {
    const {
      id,
      totalPosts = 0,
      uniqueVisitors = 0,
      totalViews = 0,
      topPosts = [],
      authors = [],
      comments = 0,
      reactions = 0,
      saves = 0,
      verifiedMembers = 0,
    } = plainBlogStats || ({} as PlainBlogStats);

    return new BlogStats(
      totalPosts,
      uniqueVisitors,
      totalViews,
      topPosts.map((post) => BlogTopPost.from(post)),
      authors.map((author) => BlogAuthorStats.from(author)),
      comments,
      reactions,
      saves,
      verifiedMembers,
      id || 'current'
    );
  }
}
