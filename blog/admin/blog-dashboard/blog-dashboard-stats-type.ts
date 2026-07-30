/**
 * a single post entry ranked by views, shown in the dashboard's top posts
 * panel.
 */
export type BlogDashboardTopPost = {
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
 * a single post authored by a given author, shown in the author's hover
 * popover.
 */
export type BlogDashboardAuthorPost = {
  /**
   * title of the post.
   */
  title: string;

  /**
   * publish date label of the post.
   */
  date: string;
};

/**
 * aggregated contribution stats for a single blog author.
 */
export type BlogDashboardAuthorStats = {
  /**
   * display name of the author.
   */
  name: string;

  /**
   * total number of posts published by the author.
   */
  postCount: number;

  /**
   * date label of the author's most recent post.
   */
  lastPostDate?: string;

  /**
   * posts published by the author.
   */
  posts?: BlogDashboardAuthorPost[];
};

/**
 * aggregated blog dashboard metrics for a selected time range.
 */
export type BlogDashboardStats = {
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
  topPosts?: BlogDashboardTopPost[];

  /**
   * per-author contribution stats.
   */
  authors?: BlogDashboardAuthorStats[];

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
