import { prop, index } from '@typegoose/typegoose';
import { mockEvents } from '@helemclub/events.entities.event';

/**
 * the typegoose Event model persisted in MongoDB. mirrors the platform's
 * Event entity (helemclub.events/entities/event).
 */
@index({ slug: 1 }, { unique: true })
@index({ type: 1 })
@index({ startAt: 1 })
export class EventModel {
  /**
   * stable, unique identifier of the event.
   */
  @prop({ required: true, unique: true, type: String })
  public id!: string;

  /**
   * url-friendly unique slug of the event.
   */
  @prop({ required: true, type: String })
  public slug!: string;

  /**
   * title of the event.
   */
  @prop({ required: true, type: String })
  public title!: string;

  /**
   * description of the event.
   */
  @prop({ required: true, type: String, default: '' })
  public description!: string;

  /**
   * type of the event (round_table, webinar, local, big).
   */
  @prop({ required: true, type: String, default: 'round_table' })
  public type!: string;

  /**
   * optional cover image url for the event.
   */
  @prop({ type: String })
  public coverImage?: string;

  /**
   * ISO date string of when the event starts.
   */
  @prop({ required: true, type: String })
  public startAt!: string;

  /**
   * optional ISO date string of when the event ends.
   */
  @prop({ type: String })
  public endAt?: string;

  /**
   * optional physical or virtual location label.
   */
  @prop({ type: String })
  public location?: string;

  /**
   * whether the event is held online.
   */
  @prop({ type: Boolean, default: false })
  public isOnline!: boolean;

  /**
   * optional url to join the online event.
   */
  @prop({ type: String })
  public joinUrl?: string;

  /**
   * domains (topics) associated with the event.
   */
  @prop({ type: () => [String], default: [] })
  public domains!: string[];

  /**
   * number of members that RSVP'd to the event.
   */
  @prop({ type: Number, default: 0 })
  public rsvpCount!: number;

  /**
   * optional id of the recorded media record published after the event.
   */
  @prop({ type: String })
  public recordingRecordId?: string;
}

/**
 * seed events built from the shared entity mocks, so the running platform and
 * the component previews stay in sync.
 */
export const EVENT_MOCKS = mockEvents().map((event) => event.toObject());
