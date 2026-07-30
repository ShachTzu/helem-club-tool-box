export type CommentTargetType = string;

export type PlainComment = {
  /**
   * unique identifier of the comment.
   */
  id: string;

  /**
   * type of the content this comment is attached to (e.g. 'app', 'blog', 'domain').
   */
  targetType: CommentTargetType;

  /**
   * id of the content this comment is attached to.
   */
  targetId: string;

  /**
   * the comment body text.
   */
  text: string;

  /**
   * display name shown alongside the comment.
   */
  displayName?: string;

  /**
   * whether the comment was posted anonymously.
   */
  isAnonymous?: boolean;

  /**
   * whether the comment is restricted to members only.
   */
  membersOnly?: boolean;

  /**
   * anonymous device identifier used for un-authenticated commenters.
   */
  deviceId?: string;

  /**
   * id of the authenticated user who posted the comment.
   */
  userId?: string;

  /**
   * number of times this comment was reported.
   */
  reportCount?: number;

  /**
   * whether the comment is hidden from public view (e.g. due to moderation).
   */
  hidden?: boolean;

  /**
   * ISO timestamp of when the comment was created.
   */
  createdAt: string;
};

/**
 * a Comment represents a single message posted against a piece of content
 * (an app, blog post, domain, etc). supports both anonymous, device-scoped
 * comments and comments posted by authenticated members.
 */
export class Comment {
  constructor(
    /**
     * unique identifier of the comment.
     */
    readonly id: string,

    /**
     * type of the content this comment is attached to (e.g. 'app', 'blog', 'domain').
     */
    readonly targetType: CommentTargetType,

    /**
     * id of the content this comment is attached to.
     */
    readonly targetId: string,

    /**
     * the comment body text.
     */
    readonly text: string,

    /**
     * ISO timestamp of when the comment was created.
     */
    readonly createdAt: string,

    /**
     * display name shown alongside the comment.
     */
    readonly displayName?: string,

    /**
     * whether the comment was posted anonymously.
     */
    readonly isAnonymous: boolean = false,

    /**
     * whether the comment is restricted to members only.
     */
    readonly membersOnly: boolean = false,

    /**
     * anonymous device identifier used for un-authenticated commenters.
     */
    readonly deviceId?: string,

    /**
     * id of the authenticated user who posted the comment.
     */
    readonly userId?: string,

    /**
     * number of times this comment was reported.
     */
    readonly reportCount: number = 0,

    /**
     * whether the comment is hidden from public view (e.g. due to moderation).
     */
    readonly hidden: boolean = false
  ) {}

  /**
   * serialize a Comment into a plain, transferable object.
   */
  toObject(): PlainComment {
    return {
      id: this.id,
      targetType: this.targetType,
      targetId: this.targetId,
      text: this.text,
      displayName: this.displayName,
      isAnonymous: this.isAnonymous,
      membersOnly: this.membersOnly,
      deviceId: this.deviceId,
      userId: this.userId,
      reportCount: this.reportCount,
      hidden: this.hidden,
      createdAt: this.createdAt,
    };
  }

  /**
   * create a Comment instance from a plain object.
   */
  static from(plainComment: PlainComment): Comment {
    const {
      id,
      targetType,
      targetId,
      text,
      createdAt,
      displayName,
      isAnonymous = false,
      membersOnly = false,
      deviceId,
      userId,
      reportCount = 0,
      hidden = false,
    } = plainComment || ({} as PlainComment);

    return new Comment(
      id,
      targetType,
      targetId,
      text,
      createdAt,
      displayName,
      isAnonymous,
      membersOnly,
      deviceId,
      userId,
      reportCount,
      hidden
    );
  }
}
