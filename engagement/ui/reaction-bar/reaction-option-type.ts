/**
 * type of content a reaction can target across the engagement surface.
 */
export type ReactionTargetType = `post` | `record` | `event` | `gallery` | `app` | `comment`;

/**
 * a single selectable reaction (a plain "like" or an emoji key).
 */
export type ReactionOption = {
  /**
   * unique reaction type key (e.g. "like", "heart", "hug", "star").
   */
  type: string;

  /**
   * emoji glyph rendered for this reaction.
   */
  emoji: string;

  /**
   * accessible label describing this reaction, in Hebrew.
   */
  label: string;
};
