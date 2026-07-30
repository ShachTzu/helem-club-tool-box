/**
 * The type of an event.
 */
export type EventType = 'round_table' | 'webinar' | 'local' | 'big';

export type PlainEvent = {
  /**
   * unique id of the event.
   */
  id: string;

  /**
   * url-friendly unique slug of the event.
   */
  slug: string;

  /**
   * title of the event.
   */
  title: string;

  /**
   * description of the event.
   */
  description: string;

  /**
   * type of the event.
   */
  type: EventType;

  /**
   * optional cover image url for the event.
   */
  coverImage?: string;

  /**
   * ISO date string of when the event starts.
   */
  startAt: string;

  /**
   * optional ISO date string of when the event ends.
   */
  endAt?: string;

  /**
   * optional physical or virtual location label.
   */
  location?: string;

  /**
   * whether the event is held online.
   */
  isOnline: boolean;

  /**
   * optional url to join the online event.
   */
  joinUrl?: string;

  /**
   * domains (topics) associated with the event.
   */
  domains: string[];

  /**
   * number of members that RSVP'd to the event.
   */
  rsvpCount: number;

  /**
   * optional id of the recorded media record published after the event.
   */
  recordingRecordId?: string;
};

/**
 * an Event entity, represents a community event such as a round table,
 * webinar, local meetup or a large conference.
 */
export class Event {
  constructor(
    /**
     * unique id of the event.
     */
    readonly id: string,

    /**
     * url-friendly unique slug of the event.
     */
    readonly slug: string,

    /**
     * title of the event.
     */
    readonly title: string,

    /**
     * description of the event.
     */
    readonly description: string,

    /**
     * type of the event.
     */
    readonly type: EventType,

    /**
     * ISO date string of when the event starts.
     */
    readonly startAt: string,

    /**
     * whether the event is held online.
     */
    readonly isOnline: boolean,

    /**
     * domains (topics) associated with the event.
     */
    readonly domains: string[],

    /**
     * number of members that RSVP'd to the event.
     */
    readonly rsvpCount: number,

    /**
     * optional cover image url for the event.
     */
    readonly coverImage?: string,

    /**
     * optional ISO date string of when the event ends.
     */
    readonly endAt?: string,

    /**
     * optional physical or virtual location label.
     */
    readonly location?: string,

    /**
     * optional url to join the online event.
     */
    readonly joinUrl?: string,

    /**
     * optional id of the recorded media record published after the event.
     */
    readonly recordingRecordId?: string
  ) {}

  /**
   * whether the event already took place, based on its end (or start) date.
   */
  get isPast(): boolean {
    const referenceDate = this.endAt || this.startAt;
    return new Date(referenceDate).getTime() < Date.now();
  }

  /**
   * whether a recording has been published for this event.
   */
  get hasRecording(): boolean {
    return Boolean(this.recordingRecordId);
  }

  /**
   * serialize an Event into a plain object.
   */
  toObject(): PlainEvent {
    return {
      id: this.id,
      slug: this.slug,
      title: this.title,
      description: this.description,
      type: this.type,
      coverImage: this.coverImage,
      startAt: this.startAt,
      endAt: this.endAt,
      location: this.location,
      isOnline: this.isOnline,
      joinUrl: this.joinUrl,
      domains: this.domains,
      rsvpCount: this.rsvpCount,
      recordingRecordId: this.recordingRecordId,
    };
  }

  /**
   * create an Event instance from a plain object.
   */
  static from(plainEvent: PlainEvent): Event {
    const {
      id,
      slug,
      title,
      description,
      type,
      startAt,
      isOnline = false,
      domains = [],
      rsvpCount = 0,
      coverImage,
      endAt,
      location,
      joinUrl,
      recordingRecordId,
    } = plainEvent;

    return new Event(
      id,
      slug,
      title,
      description,
      type,
      startAt,
      isOnline,
      domains,
      rsvpCount,
      coverImage,
      endAt,
      location,
      joinUrl,
      recordingRecordId
    );
  }
}
