import { prop, index } from '@typegoose/typegoose';

/**
 * the typegoose Rsvp model persisted in MongoDB. mirrors the platform's Rsvp
 * entity (helemclub.events/entities/rsvp). a member can hold at most one RSVP
 * per event.
 */
@index({ eventId: 1, userId: 1 }, { unique: true })
export class RsvpModel {
  /**
   * stable, unique identifier of the rsvp.
   */
  @prop({ required: true, unique: true, type: String })
  public id!: string;

  /**
   * id of the event the rsvp belongs to.
   */
  @prop({ required: true, type: String })
  public eventId!: string;

  /**
   * id of the user who responded.
   */
  @prop({ required: true, type: String })
  public userId!: string;

  /**
   * whether the user is attending the event.
   */
  @prop({ type: Boolean, default: true })
  public attending!: boolean;

  /**
   * iso timestamp of when the rsvp was created.
   */
  @prop({ type: String })
  public createdAt!: string;
}

/**
 * seed RSVPs so a couple of events show attendees out of the box. the event
 * ids match the seeded mock events resolved lazily on start.
 */
export const RSVP_MOCKS: Array<{
  id: string;
  eventId: string;
  userId: string;
  attending: boolean;
  createdAt: string;
}> = [];
