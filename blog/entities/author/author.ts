export type PlainAuthor = {
  /**
   * unique identifier of the author.
   */
  id: string;

  /**
   * id of the underlying platform user.
   */
  userId: string;

  /**
   * display name of the author.
   */
  name: string;

  /**
   * short biography of the author.
   */
  bio?: string;

  /**
   * url of the author's profile photo.
   */
  photo?: string;

  /**
   * whether the author has permission to write posts.
   */
  hasWritePermission: boolean;

  /**
   * number of posts published by the author.
   */
  postCount: number;

  /**
   * ISO date string of the author's most recent post.
   */
  lastPostDate?: string;
};

export class Author {
  constructor(
    /**
     * unique identifier of the author.
     */
    readonly id: string,

    /**
     * id of the underlying platform user.
     */
    readonly userId: string,

    /**
     * display name of the author.
     */
    readonly name: string,

    /**
     * whether the author has permission to write posts.
     */
    readonly hasWritePermission: boolean,

    /**
     * number of posts published by the author.
     */
    readonly postCount: number,

    /**
     * short biography of the author.
     */
    readonly bio?: string,

    /**
     * url of the author's profile photo.
     */
    readonly photo?: string,

    /**
     * ISO date string of the author's most recent post.
     */
    readonly lastPostDate?: string
  ) {}

  /**
   * serialize an Author into a plain object.
   */
  toObject(): PlainAuthor {
    return {
      id: this.id,
      userId: this.userId,
      name: this.name,
      bio: this.bio,
      photo: this.photo,
      hasWritePermission: this.hasWritePermission,
      postCount: this.postCount,
      lastPostDate: this.lastPostDate,
    };
  }

  /**
   * create an Author instance from a plain object.
   */
  static from(plainAuthor: PlainAuthor) {
    const {
      id,
      userId,
      name,
      hasWritePermission = false,
      postCount = 0,
      bio,
      photo,
      lastPostDate,
    } = plainAuthor || ({} as PlainAuthor);

    return new Author(id, userId, name, hasWritePermission, postCount, bio, photo, lastPostDate);
  }
}
