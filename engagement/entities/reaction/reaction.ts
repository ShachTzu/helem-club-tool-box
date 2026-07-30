/**
 * Reaction target types supported across the engagement surface.
 */
export type ReactionTargetType = 'post' | 'record' | 'event' | 'gallery' | 'app' | 'comment';

/**
 * Reaction type — a plain "like" or an emoji key (e.g. "heart", "hug", "star").
 */
export type ReactionType = 'like' | string;

export type PlainReaction = {
  /**
   * unique id of the reaction.
   */
  id: string;

  /**
   * type of content the reaction targets (e.g. 'post', 'record', 'event').
   */
  targetType: ReactionTargetType;

  /**
   * id of the content item the reaction targets.
   */
  targetId: string;

  /**
   * reaction type, a "like" or an emoji key.
   */
  type: ReactionType;

  /**
   * anonymous device identifier that created the reaction.
   * used to enforce one reaction per device per object.
   */
  deviceId: string;

  /**
   * ISO timestamp of when the reaction was created.
   */
  createdAt: string;
};

/**
 * A Reaction represents a single device's reaction (like/emoji) to a
 * piece of content. Only one reaction is allowed per device per target
 * object; toggling or changing it replaces the existing reaction.
 */
export class Reaction {
  constructor(
    /**
     * unique id of the reaction.
     */
    readonly id: string,

    /**
     * type of content the reaction targets (e.g. 'post', 'record', 'event').
     */
    readonly targetType: ReactionTargetType,

    /**
     * id of the content item the reaction targets.
     */
    readonly targetId: string,

    /**
     * reaction type, a "like" or an emoji key.
     */
    readonly type: ReactionType,

    /**
     * anonymous device identifier that created the reaction.
     */
    readonly deviceId: string,

    /**
     * ISO timestamp of when the reaction was created.
     */
    readonly createdAt: string = new Date().toISOString()
  ) {}

  /**
   * serialize a Reaction into a plain, transportable object.
   */
  toObject(): PlainReaction {
    const {
      id = '',
      targetType = 'post',
      targetId = '',
      type = 'like',
      deviceId = '',
      createdAt = new Date().toISOString(),
    } = this;

    return {
      id,
      targetType,
      targetId,
      type,
      deviceId,
      createdAt,
    };
  }

  /**
   * create a Reaction instance from a plain object.
   */
  static from(plainReaction: Partial<PlainReaction> & { id: string }): Reaction {
    const {
      id,
      targetType = 'post',
      targetId = '',
      type = 'like',
      deviceId = '',
      createdAt = new Date().toISOString(),
    } = plainReaction;

    return new Reaction(id, targetType, targetId, type, deviceId, createdAt);
  }
}
