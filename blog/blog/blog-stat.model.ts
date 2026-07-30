import { prop } from '@typegoose/typegoose';

/**
 * the typegoose BlogStat model persisted in MongoDB. holds the community
 * engagement counters that are not derivable from the posts collection alone
 * (comments, reactions, saves and verified members). aggregate metrics such as
 * total posts, views and unique visitors are computed live from the posts
 * collection at query time.
 */
export class BlogStatModel {
  /**
   * stable, unique identifier of the stats snapshot. a single 'current'
   * document is maintained.
   */
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  /**
   * total number of comments across all posts.
   */
  @prop({ type: Number, default: 0 })
  public comments!: number;

  /**
   * total number of reactions across all posts.
   */
  @prop({ type: Number, default: 0 })
  public reactions!: number;

  /**
   * total number of saves/bookmarks across all posts.
   */
  @prop({ type: Number, default: 0 })
  public saves!: number;

  /**
   * total number of verified community members who engaged with the blog.
   */
  @prop({ type: Number, default: 0 })
  public verifiedMembers!: number;
}

/**
 * seed the engagement counters with the values from the blog-stat entity mock,
 * used to populate the collection on first start.
 */
export const BLOG_STAT_MOCK = {
  id: 'current',
  comments: 486,
  reactions: 1920,
  saves: 640,
  verifiedMembers: 312,
};
