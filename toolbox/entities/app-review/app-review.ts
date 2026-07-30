export type PlainAppReview = {
  /**
   * unique identifier of the review.
   */
  id: string;

  /**
   * id of the app being reviewed.
   */
  appId: string;

  /**
   * star rating given by the reviewer, typically 1-5.
   */
  stars: number;

  /**
   * optional free-text comment left by the reviewer.
   */
  comment?: string;

  /**
   * optional display name of the reviewer.
   */
  displayName?: string;

  /**
   * number of users who marked this review as helpful.
   */
  helpfulCount: number;

  /**
   * ISO timestamp of when the review was created.
   */
  createdAt: string;
};

export class AppReview {
  constructor(
    /**
     * unique identifier of the review.
     */
    readonly id: string,

    /**
     * id of the app being reviewed.
     */
    readonly appId: string,

    /**
     * star rating given by the reviewer, typically 1-5.
     */
    readonly stars: number,

    /**
     * number of users who marked this review as helpful.
     */
    readonly helpfulCount: number,

    /**
     * ISO timestamp of when the review was created.
     */
    readonly createdAt: string,

    /**
     * optional free-text comment left by the reviewer.
     */
    readonly comment?: string,

    /**
     * optional display name of the reviewer.
     */
    readonly displayName?: string
  ) {}

  /**
   * serialize an AppReview into
   * a plain, serializable object.
   */
  toObject(): PlainAppReview {
    return {
      id: this.id,
      appId: this.appId,
      stars: this.stars,
      comment: this.comment,
      displayName: this.displayName,
      helpfulCount: this.helpfulCount,
      createdAt: this.createdAt,
    };
  }

  /**
   * create an AppReview instance from a
   * plain object.
   */
  static from(plainAppReview: PlainAppReview): AppReview {
    const {
      id,
      appId,
      stars,
      comment,
      displayName,
      helpfulCount = 0,
      createdAt,
    } = plainAppReview || ({} as PlainAppReview);

    return new AppReview(id, appId, stars, helpfulCount, createdAt, comment, displayName);
  }
}
