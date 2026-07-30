/**
 * options accepted by the listPosts query: filter by coping-domains, a free
 * text query, and paginate the results.
 */
export type ListPostsOptions = {
  /**
   * restrict results to posts tagged with any of the given coping-domains.
   */
  domainIds?: string[];

  /**
   * free-text search query matched against post title, excerpt and body.
   */
  query?: string;

  /**
   * maximum number of posts to return.
   */
  limit?: number;

  /**
   * number of posts to skip, for pagination.
   */
  offset?: number;
};

/**
 * editorial fields a writer/staff author can set when creating a post.
 */
export type CreatePostInput = {
  title: string;
  excerpt: string;
  coverImage?: string;
  body: string;
  domains?: string[];
  embeddedApps?: string[];
  visibility?: string;
  metaDescription?: string;
};

/**
 * editorial fields a writer/staff author can change when updating a post. all
 * fields are optional so partial edits are supported.
 */
export type UpdatePostInput = {
  title?: string;
  excerpt?: string;
  coverImage?: string;
  body?: string;
  domains?: string[];
  embeddedApps?: string[];
  visibility?: string;
  metaDescription?: string;
};

/**
 * fields collected when a community member submits an article for review. the
 * contact fields (submitterName/Email/Phone/Facebook) are stored for
 * moderation only and are NEVER exposed publicly.
 */
export type SubmitPostInput = {
  title: string;
  excerpt: string;
  coverImage?: string;
  body: string;
  domains?: string[];
  submitterName: string;
  submitterEmail: string;
  submitterPhone: string;
  submitterFacebook: string;
  displayName?: string;
};

/**
 * a moderation action taken on a pending post.
 */
export type ReviewPostAction = 'approve' | 'reject';

/**
 * a named/explicit time range accepted by the blog stats query.
 */
export type BlogTimeRange = {
  preset?: string;
  from?: string;
  to?: string;
};
