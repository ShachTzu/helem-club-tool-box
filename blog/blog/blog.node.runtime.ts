import { SymphonyPlatformAspect, type SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformNode } from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
import { Post } from '@helemclub/blog.entities.post';
import { Author } from '@helemclub/blog.entities.author';
import { BlogStats } from '@helemclub/blog.entities.blog-stat';
import type { User } from '@helemclub/platform.entities.user';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import { NotFound } from '@bitdev/symphony.exceptions.not-found';
import type { BlogConfig } from './blog-config.js';
import { blogGqlSchema } from './blog.graphql.js';
import { PostModel, POST_MOCKS } from './post.model.js';
import { AuthorModel, AUTHOR_MOCKS } from './author.model.js';
import { BlogStatModel, BLOG_STAT_MOCK } from './blog-stat.model.js';
import { PostRepository } from './post-repository.js';
import type {
  ListPostsOptions,
  CreatePostInput,
  UpdatePostInput,
  SubmitPostInput,
  ReviewPostAction,
  BlogTimeRange,
} from './post-options.js';

/**
 * the shape of the GraphQL resolver context this runtime reads the session
 * from. only the user id is needed — the user record is resolved via the
 * platform.
 */
export type BlogContext = {
  session?: {
    userId?: string;
  };
};

/**
 * roles ordered by increasing privilege.
 */
const ROLE_ORDER = ['member', 'writer', 'moderator', 'admin'];

export class BlogNode {
  constructor(
    private blogConfig: BlogConfig,
    private symphonyPlatform: SymphonyPlatformNode,
    private helamPlatform: HelamPlatformNode,
    private postRepository: PostRepository
  ) {}

  /**
   * resolve the currently authenticated user from the resolver context, or
   * null when no one is signed in.
   */
  private async currentUser(context?: BlogContext): Promise<User | null> {
    if (!context) return null;
    return this.helamPlatform.getCurrentUser(context);
  }

  /**
   * whether the given user's role is at least as privileged as the required
   * role.
   */
  private hasRole(user: User | null, minRole: string): boolean {
    if (!user) return false;
    return ROLE_ORDER.indexOf(user.role) >= ROLE_ORDER.indexOf(minRole);
  }

  /**
   * list published posts, honoring the members-only visibility rule: a
   * members-only post is only returned to signed-in users.
   */
  async listPosts(options?: ListPostsOptions, context?: BlogContext): Promise<Post[]> {
    const user = await this.currentUser(context);
    const isMember = Boolean(user);
    const postModels = await this.postRepository.listPublishedPosts(options);
    return postModels
      .filter((model) => isMember || model.visibility !== 'members_only')
      .map((model) => Post.from(model));
  }

  /**
   * resolve a single post by slug. members-only posts are only returned to
   * signed-in users; non-published posts are only returned to writers and
   * above.
   */
  async getPost(slug: string, context?: BlogContext): Promise<Post | null> {
    const postModel = await this.postRepository.getPostBySlug(slug);
    if (!postModel) return null;

    const user = await this.currentUser(context);

    if (postModel.status !== 'published' && !this.hasRole(user, 'writer')) {
      return null;
    }

    if (postModel.visibility === 'members_only' && !user) {
      return null;
    }

    return Post.from(postModel);
  }

  /**
   * list posts awaiting moderation review. restricted to moderators and admins.
   */
  async listPendingPosts(context?: BlogContext): Promise<Post[]> {
    const user = await this.currentUser(context);
    if (!user) throw new Unauthorized();
    if (!this.hasRole(user, 'moderator')) throw new AccessDenied();

    const postModels = await this.postRepository.listPendingPosts();
    return postModels.map((model) => Post.from(model));
  }

  /**
   * create a published post. restricted to writers and above.
   */
  async createPost(input: CreatePostInput, context?: BlogContext): Promise<Post> {
    const user = await this.currentUser(context);
    if (!user) throw new Unauthorized();
    if (!this.hasRole(user, 'writer')) throw new AccessDenied();

    const created = await this.postRepository.createPost(input, {
      authorName: user.displayName,
      authorRef: user.id,
      isStaffAuthor: this.hasRole(user, 'moderator'),
    });

    return Post.from(created);
  }

  /**
   * apply an editorial update to a post. restricted to writers and above.
   */
  async updatePost(id: string, input: UpdatePostInput, context?: BlogContext): Promise<Post | null> {
    const user = await this.currentUser(context);
    if (!user) throw new Unauthorized();
    if (!this.hasRole(user, 'writer')) throw new AccessDenied();

    const updated = await this.postRepository.updatePost(id, input);
    if (!updated) throw new NotFound(`post ${id}`);
    return Post.from(updated);
  }

  /**
   * submit a community-authored article for moderation review. requires the
   * visitor to be signed in. contact details are stored but never exposed.
   */
  async submitPost(input: SubmitPostInput, context?: BlogContext): Promise<Post> {
    const user = await this.currentUser(context);
    if (!user) throw new Unauthorized();

    const created = await this.postRepository.submitPost(input);
    return Post.from(created);
  }

  /**
   * approve or reject a pending post. restricted to moderators and admins.
   */
  async reviewPost(
    id: string,
    action: ReviewPostAction | string,
    context?: BlogContext
  ): Promise<Post | null> {
    const user = await this.currentUser(context);
    if (!user) throw new Unauthorized();
    if (!this.hasRole(user, 'moderator')) throw new AccessDenied();

    const status = action === 'approve' ? 'published' : 'rejected';
    const updated = await this.postRepository.setPostStatus(id, status);
    if (!updated) throw new NotFound(`post ${id}`);
    return Post.from(updated);
  }

  /**
   * record a view for a post, keyed by an anonymous device id so unique
   * visitors can be tracked without authentication.
   */
  async incrementView(postId: string, deviceId: string): Promise<boolean> {
    return this.postRepository.incrementView(postId, deviceId);
  }

  /**
   * list all blog authors.
   */
  async listAuthors(): Promise<Author[]> {
    const authorModels = await this.postRepository.listAuthors();
    return authorModels.map((model) => Author.from(model));
  }

  /**
   * grant or revoke a user's write permission. restricted to admins and to
   * users scoped in as content admins.
   */
  async setWritePermission(
    userId: string,
    canWrite: boolean,
    context?: BlogContext
  ): Promise<Author | null> {
    const user = await this.currentUser(context);
    if (!user) throw new Unauthorized();
    if (!user.canManageContent()) throw new AccessDenied();

    const target = await this.helamPlatform.getUser(userId);
    const updated = await this.postRepository.setWritePermission(
      userId,
      canWrite,
      target?.displayName
    );
    return updated ? Author.from(updated) : null;
  }

  /**
   * compute aggregated blog dashboard metrics for the given time range.
   * headline metrics (posts, views, unique visitors, top posts, authors) are
   * derived live from the posts collection; engagement counters (comments,
   * reactions, saves, verified members) are read from the persisted stat doc.
   */
  async getBlogStats(_range?: BlogTimeRange): Promise<BlogStats> {
    const posts = await this.postRepository.listAllPublishedPosts();
    const counters = await this.postRepository.getEngagementCounters();

    const totalPosts = posts.length;
    const totalViews = posts.reduce((sum, post) => sum + (post.viewCount || 0), 0);
    const uniqueVisitors = posts.reduce((sum, post) => sum + (post.uniqueVisitors || 0), 0);

    const topPosts = [...posts]
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, 10)
      .map((post) => ({ id: post.id, title: post.title, views: post.viewCount || 0 }));

    const authorsMap = new Map<
      string,
      { name: string; postCount: number; lastPostDate?: string; posts: { title: string; date: string }[] }
    >();

    posts.forEach((post) => {
      const key = post.authorName || 'אנונימי';
      const entry = authorsMap.get(key) || { name: key, postCount: 0, lastPostDate: undefined, posts: [] };
      entry.postCount += 1;
      entry.posts.push({ title: post.title, date: post.publishDate || '' });
      if (post.publishDate && (!entry.lastPostDate || post.publishDate > entry.lastPostDate)) {
        entry.lastPostDate = post.publishDate;
      }
      authorsMap.set(key, entry);
    });

    const authors = Array.from(authorsMap.values()).sort((a, b) => b.postCount - a.postCount);

    return BlogStats.from({
      id: 'current',
      totalPosts,
      totalViews,
      uniqueVisitors,
      topPosts,
      authors,
      comments: counters?.comments ?? BLOG_STAT_MOCK.comments,
      reactions: counters?.reactions ?? BLOG_STAT_MOCK.reactions,
      saves: counters?.saves ?? BLOG_STAT_MOCK.saves,
      verifiedMembers: counters?.verifiedMembers ?? BLOG_STAT_MOCK.verifiedMembers,
    });
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: BlogConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
    config: BlogConfig
  ) {
    const postModel = getModelForClass(PostModel);
    const authorModel = getModelForClass(AuthorModel);
    const blogStatModel = getModelForClass(BlogStatModel);
    const postRepository = new PostRepository(postModel, authorModel, blogStatModel);
    const blog = new BlogNode(config, symphonyPlatform, helamPlatform, postRepository);

    const gqlSchema = blogGqlSchema(blog);

    helamPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    // demo posts, authors and stats are invented content. `registerSeed` only
    // runs while seeding is permitted (see DISABLE_SEED_DATA on the platform).
    helamPlatform.registerSeed(async () => {
      const existingPosts = await postModel.find().limit(1).exec();
      if (existingPosts.length === 0) {
        await postModel.insertMany(POST_MOCKS);
      }

      const existingAuthors = await authorModel.find().limit(1).exec();
      if (existingAuthors.length === 0) {
        await authorModel.insertMany(AUTHOR_MOCKS);
      }

      const existingStats = await blogStatModel.find().limit(1).exec();
      if (existingStats.length === 0) {
        await blogStatModel.insertMany([BLOG_STAT_MOCK]);
      }
    });

    return blog;
  }
}

export default BlogNode;
