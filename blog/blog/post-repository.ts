import type { ReturnModelType } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';
import type { PostModel } from './post.model.js';
import type { AuthorModel } from './author.model.js';
import type { BlogStatModel } from './blog-stat.model.js';
import type {
  ListPostsOptions,
  CreatePostInput,
  UpdatePostInput,
  SubmitPostInput,
} from './post-options.js';

/**
 * details of the author creating or submitting a post.
 */
export type PostAuthorDetails = {
  authorName: string;
  authorRef?: string;
  isStaffAuthor: boolean;
};

/**
 * build a url-friendly slug from a title, falling back to a random suffix when
 * the title has no latin characters (e.g. Hebrew-only titles).
 */
function slugify(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u0590-\u05FF]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base || `post-${uuidv4().slice(0, 8)}`;
}

export class PostRepository {
  constructor(
    private postModel: ReturnModelType<typeof PostModel>,
    private authorModel: ReturnModelType<typeof AuthorModel>,
    private blogStatModel: ReturnModelType<typeof BlogStatModel>
  ) {}

  /**
   * list published posts, optionally filtered by domains and a free-text
   * query, with pagination. results are newest-first.
   */
  async listPublishedPosts(options?: ListPostsOptions): Promise<PostModel[]> {
    const filter: Record<string, unknown> = { status: 'published' };

    if (options?.domainIds && options.domainIds.length > 0) {
      filter.domains = { $in: options.domainIds };
    }

    if (options?.query && options.query.trim()) {
      const term = options.query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = { $regex: term, $options: 'i' };
      filter.$or = [{ title: regex }, { excerpt: regex }, { body: regex }];
    }

    let cursor = this.postModel.find(filter).sort({ publishDate: -1, _id: -1 });

    if (typeof options?.offset === 'number' && options.offset > 0) {
      cursor = cursor.skip(options.offset);
    }
    if (typeof options?.limit === 'number' && options.limit > 0) {
      cursor = cursor.limit(options.limit);
    }

    const posts = await cursor.exec();
    return posts.map((post) => post.toObject());
  }

  /**
   * list posts awaiting moderation review, newest-first.
   */
  async listPendingPosts(): Promise<PostModel[]> {
    const posts = await this.postModel.find({ status: 'pending' }).sort({ _id: -1 }).exec();
    return posts.map((post) => post.toObject());
  }

  /**
   * resolve a post by slug.
   */
  async getPostBySlug(slug: string): Promise<PostModel | null> {
    const post = await this.postModel.findOne({ slug }).exec();
    return post ? post.toObject() : null;
  }

  /**
   * resolve a post by its stable id.
   */
  async getPostById(id: string): Promise<PostModel | null> {
    const post = await this.postModel.findOne({ id }).exec();
    return post ? post.toObject() : null;
  }

  /**
   * create a published post authored by a writer/staff member.
   */
  async createPost(input: CreatePostInput, author: PostAuthorDetails): Promise<PostModel> {
    const created = await this.postModel.create({
      id: uuidv4(),
      slug: slugify(input.title),
      title: input.title,
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      body: input.body,
      authorName: author.authorName,
      authorRef: author.authorRef,
      isStaffAuthor: author.isStaffAuthor,
      domains: input.domains || [],
      embeddedApps: input.embeddedApps || [],
      status: 'published',
      visibility: input.visibility || 'public',
      metaDescription: input.metaDescription,
      publishDate: new Date().toISOString(),
      viewCount: 0,
      uniqueVisitors: 0,
      registeredViewCount: 0,
      viewedDeviceIds: [],
    });

    return created.toObject();
  }

  /**
   * create a pending community submission, storing contact details for
   * moderation. contact details are never surfaced through the public API.
   */
  async submitPost(input: SubmitPostInput): Promise<PostModel> {
    const created = await this.postModel.create({
      id: uuidv4(),
      slug: slugify(input.title),
      title: input.title,
      excerpt: input.excerpt,
      coverImage: input.coverImage,
      body: input.body,
      authorName: input.displayName || input.submitterName,
      isStaffAuthor: false,
      domains: input.domains || [],
      embeddedApps: [],
      status: 'pending',
      visibility: 'public',
      viewCount: 0,
      uniqueVisitors: 0,
      registeredViewCount: 0,
      viewedDeviceIds: [],
      submitterName: input.submitterName,
      submitterEmail: input.submitterEmail,
      submitterPhone: input.submitterPhone,
      submitterFacebook: input.submitterFacebook,
    });

    return created.toObject();
  }

  /**
   * apply an editorial update to an existing post.
   */
  async updatePost(id: string, input: UpdatePostInput): Promise<PostModel | null> {
    const update: Record<string, unknown> = {};
    const fields: (keyof UpdatePostInput)[] = [
      'title',
      'excerpt',
      'coverImage',
      'body',
      'domains',
      'embeddedApps',
      'visibility',
      'metaDescription',
    ];
    fields.forEach((field) => {
      if (input[field] !== undefined) update[field] = input[field];
    });

    const updated = await this.postModel
      .findOneAndUpdate({ id }, { $set: update }, { new: true })
      .exec();
    return updated ? updated.toObject() : null;
  }

  /**
   * set the moderation status of a post and, when publishing, stamp the
   * publish date.
   */
  async setPostStatus(id: string, status: string): Promise<PostModel | null> {
    const update: Record<string, unknown> = { status };
    if (status === 'published') update.publishDate = new Date().toISOString();

    const updated = await this.postModel
      .findOneAndUpdate({ id }, { $set: update }, { new: true })
      .exec();
    return updated ? updated.toObject() : null;
  }

  /**
   * atomically increment the view count of a post, and track the unique
   * visitor count by only counting each device id once. isRegistered marks
   * whether the viewer was signed in, resolved server-side from the session
   * — never client-supplied.
   */
  async incrementView(id: string, deviceId: string, isRegistered: boolean): Promise<boolean> {
    const existing = await this.postModel.findOne({ id }).exec();
    if (!existing) return false;

    const isNewDevice = deviceId ? !existing.viewedDeviceIds.includes(deviceId) : false;
    const inc: Record<string, number> = { viewCount: 1 };
    if (isRegistered) inc.registeredViewCount = 1;

    const update: Record<string, unknown> = { $inc: inc };

    if (isNewDevice) {
      inc.uniqueVisitors = 1;
      update.$addToSet = { viewedDeviceIds: deviceId };
    }

    await this.postModel.updateOne({ id }, update).exec();
    return true;
  }

  /**
   * list all authors, newest-first.
   */
  async listAuthors(): Promise<AuthorModel[]> {
    const authors = await this.authorModel.find({}).sort({ _id: -1 }).exec();
    return authors.map((author) => author.toObject());
  }

  /**
   * find an author by the underlying platform user id.
   */
  async getAuthorByUserId(userId: string): Promise<AuthorModel | null> {
    const author = await this.authorModel.findOne({ userId }).exec();
    return author ? author.toObject() : null;
  }

  /**
   * set an author's write permission. creates an author record for the user
   * when one does not exist yet.
   */
  async setWritePermission(
    userId: string,
    canWrite: boolean,
    name?: string
  ): Promise<AuthorModel | null> {
    const existing = await this.authorModel.findOne({ userId }).exec();

    if (!existing) {
      const created = await this.authorModel.create({
        id: uuidv4(),
        userId,
        name: name || 'כותב/ת',
        hasWritePermission: canWrite,
        postCount: 0,
      });
      return created.toObject();
    }

    const updated = await this.authorModel
      .findOneAndUpdate({ userId }, { $set: { hasWritePermission: canWrite } }, { new: true })
      .exec();
    return updated ? updated.toObject() : null;
  }

  /**
   * return all published posts, used to compute aggregate stats.
   */
  async listAllPublishedPosts(): Promise<PostModel[]> {
    const posts = await this.postModel.find({ status: 'published' }).exec();
    return posts.map((post) => post.toObject());
  }

  /**
   * return the persisted engagement counters, or defaults when not seeded.
   */
  async getEngagementCounters(): Promise<BlogStatModel | null> {
    const stat = await this.blogStatModel.findOne({ id: 'current' }).exec();
    return stat ? stat.toObject() : null;
  }
}
