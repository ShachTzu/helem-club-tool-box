import { prop, index } from '@typegoose/typegoose';
import { mockPosts } from '@helemclub/blog.entities.post';

/**
 * the typegoose Post model persisted in MongoDB. mirrors the blog Post entity
 * (helemclub.blog/entities/post) and adds backend-only fields used for
 * community submissions (contact details, never exposed publicly) and unique
 * view tracking.
 */
@index({ title: 'text', excerpt: 'text', body: 'text' })
export class PostModel {
  /**
   * stable, unique identifier of the post.
   */
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  /**
   * url-friendly unique slug of the post.
   */
  @prop({ unique: true, required: true, type: String })
  public slug!: string;

  /**
   * title of the post.
   */
  @prop({ required: true, type: String })
  public title!: string;

  /**
   * short excerpt / summary of the post.
   */
  @prop({ type: String, default: '' })
  public excerpt!: string;

  /**
   * optional cover image url.
   */
  @prop({ type: String })
  public coverImage?: string;

  /**
   * rich text body of the post (html/markdown).
   */
  @prop({ type: String, default: '' })
  public body!: string;

  /**
   * display name of the author.
   */
  @prop({ type: String, default: '' })
  public authorName!: string;

  /**
   * optional reference id to the author's user/account record.
   */
  @prop({ type: String })
  public authorRef?: string;

  /**
   * whether the author is a staff member of the organization.
   */
  @prop({ type: Boolean, default: false })
  public isStaffAuthor!: boolean;

  /**
   * coping-domains the post is tagged with.
   */
  @prop({ type: () => [String], default: [] })
  public domains!: string[];

  /**
   * toolbox app ids embedded within the post body.
   */
  @prop({ type: () => [String], default: [] })
  public embeddedApps!: string[];

  /**
   * moderation status of the post (draft | pending | published | rejected).
   */
  @prop({ required: true, type: String, default: 'published' })
  public status!: string;

  /**
   * visibility of the post (public | members_only).
   */
  @prop({ type: String, default: 'public' })
  public visibility!: string;

  /**
   * optional meta description used for SEO.
   */
  @prop({ type: String })
  public metaDescription?: string;

  /**
   * ISO date string of when the post was (or will be) published.
   */
  @prop({ type: String })
  public publishDate?: string;

  /**
   * total number of views the post received.
   */
  @prop({ type: Number, default: 0 })
  public viewCount!: number;

  /**
   * number of unique visitors the post received.
   */
  @prop({ type: Number, default: 0 })
  public uniqueVisitors!: number;

  /**
   * anonymous device ids that have viewed the post, used to compute the
   * unique visitor count. never exposed over the public API.
   */
  @prop({ type: () => [String], default: [] })
  public viewedDeviceIds!: string[];

  /**
   * full name of a community submitter. stored for moderation contact only,
   * never exposed publicly.
   */
  @prop({ type: String })
  public submitterName?: string;

  /**
   * email of a community submitter. stored for moderation contact only,
   * never exposed publicly.
   */
  @prop({ type: String })
  public submitterEmail?: string;

  /**
   * phone of a community submitter. stored for moderation contact only,
   * never exposed publicly.
   */
  @prop({ type: String })
  public submitterPhone?: string;

  /**
   * facebook profile of a community submitter. stored for moderation contact
   * only, never exposed publicly.
   */
  @prop({ type: String })
  public submitterFacebook?: string;
}

/**
 * seed posts derived from the blog Post entity mock, used to populate the
 * collection on first start.
 */
export const POST_MOCKS = mockPosts().map((post, index) => {
  const plain = post.toObject();
  return {
    ...plain,
    id: `post-${index + 1}`,
    viewedDeviceIds: [],
  };
});
