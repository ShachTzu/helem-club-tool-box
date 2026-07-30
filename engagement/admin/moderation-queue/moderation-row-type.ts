/**
 * a single row rendered in the moderation queue table. flattened primitive
 * fields derived from a `Comment`, matching the shape the `Table` component
 * expects for its rows.
 */
export type ModerationRow = {
  /**
   * unique identifier of the comment.
   */
  id: string;

  /**
   * display name of the comment author, or a fallback label for anonymous authors.
   */
  displayName: string;

  /**
   * whether the comment was posted anonymously.
   */
  isAnonymous: boolean;

  /**
   * the comment body text.
   */
  text: string;

  /**
   * number of times this comment was reported.
   */
  reportCount: number;

  /**
   * whether the comment is currently hidden from public view.
   */
  hidden: boolean;

  /**
   * ISO timestamp of when the comment was created.
   */
  createdAt: string;
};
