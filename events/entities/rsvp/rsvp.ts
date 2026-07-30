export type PlainRsvp = {
  /**
   * unique identifier of the rsvp.
   */
  id: string;

  /**
   * id of the event the rsvp belongs to.
   */
  eventId: string;

  /**
   * id of the user who responded.
   */
  userId: string;

  /**
   * whether the user is attending the event.
   */
  attending: boolean;

  /**
   * iso timestamp of when the rsvp was created.
   */
  createdAt: string;
};

export class Rsvp {
  constructor(
    /**
     * unique identifier of the rsvp.
     */
    readonly id: string,

    /**
     * id of the event the rsvp belongs to.
     */
    readonly eventId: string,

    /**
     * id of the user who responded.
     */
    readonly userId: string,

    /**
     * whether the user is attending the event.
     */
    readonly attending: boolean,

    /**
     * iso timestamp of when the rsvp was created.
     */
    readonly createdAt: string
  ) {}

  /**
   * serialize an Rsvp instance into
   * a plain, serializable object.
   */
  toObject(): PlainRsvp {
    return {
      id: this.id,
      eventId: this.eventId,
      userId: this.userId,
      attending: this.attending,
      createdAt: this.createdAt,
    };
  }

  /**
   * create an Rsvp instance from a
   * plain object.
   */
  static from(plainRsvp: PlainRsvp): Rsvp {
    const { id, eventId = '', userId = '', attending = false, createdAt = new Date().toISOString() } = plainRsvp || ({} as PlainRsvp);
    return new Rsvp(id, eventId, userId, attending, createdAt);
  }
}
