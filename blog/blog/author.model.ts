import { prop } from '@typegoose/typegoose';
import { mockAuthors } from '@helemclub/blog.entities.author';

/**
 * the typegoose Author model persisted in MongoDB. mirrors the blog Author
 * entity (helemclub.blog/entities/author) and tracks which platform users
 * may write blog posts.
 */
export class AuthorModel {
  /**
   * stable, unique identifier of the author.
   */
  @prop({ unique: true, required: true, type: String })
  public id!: string;

  /**
   * id of the underlying platform user.
   */
  @prop({ required: true, type: String })
  public userId!: string;

  /**
   * display name of the author.
   */
  @prop({ required: true, type: String })
  public name!: string;

  /**
   * short biography of the author.
   */
  @prop({ type: String })
  public bio?: string;

  /**
   * url of the author's profile photo.
   */
  @prop({ type: String })
  public photo?: string;

  /**
   * whether the author has permission to write posts.
   */
  @prop({ type: Boolean, default: false })
  public hasWritePermission!: boolean;

  /**
   * number of posts published by the author.
   */
  @prop({ type: Number, default: 0 })
  public postCount!: number;

  /**
   * ISO date string of the author's most recent post.
   */
  @prop({ type: String })
  public lastPostDate?: string;
}

/**
 * seed authors derived from the blog Author entity mock, used to populate the
 * collection on first start.
 */
export const AUTHOR_MOCKS = mockAuthors().map((author, index) => {
  const plain = author.toObject();
  return {
    ...plain,
    id: `author-${index + 1}`,
    userId: `author-user-${index + 1}`,
  };
});
