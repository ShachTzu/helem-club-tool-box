import type { ReturnModelType } from '@typegoose/typegoose';
import { RsvpModel } from './rsvp.model.js';

/**
 * the result of upserting an RSVP: the resulting record plus the delta that
 * should be applied to the event's cached rsvpCount.
 */
export type UpsertRsvpResult = {
  rsvp: RsvpModel;
  countDelta: number;
};

/**
 * data-access layer for event RSVPs, wrapping the typegoose Rsvp model.
 */
export class RsvpRepository {
  constructor(private rsvpModel: ReturnModelType<typeof RsvpModel>) {}

  /**
   * list every RSVP recorded against an event, newest first.
   */
  async listRsvps(eventId: string): Promise<RsvpModel[]> {
    const rsvps = await this.rsvpModel.find({ eventId }).sort({ createdAt: -1 }).exec();
    return rsvps.map((rsvp) => rsvp.toObject());
  }

  /**
   * upsert the current user's RSVP for an event — a member holds at most one
   * RSVP per event. returns the resulting record and the delta to apply to the
   * event's cached attendee count so it stays in sync.
   */
  async upsertRsvp(eventId: string, userId: string, attending: boolean): Promise<UpsertRsvpResult> {
    const existing = await this.rsvpModel.findOne({ eventId, userId }).exec();

    if (existing) {
      const wasAttending = existing.attending;
      existing.attending = attending;
      await existing.save();
      let countDelta = 0;
      if (wasAttending && !attending) countDelta = -1;
      if (!wasAttending && attending) countDelta = 1;
      return { rsvp: existing.toObject(), countDelta };
    }

    const created = await this.rsvpModel.create({
      id: crypto.randomUUID(),
      eventId,
      userId,
      attending,
      createdAt: new Date().toISOString(),
    });

    return { rsvp: created.toObject(), countDelta: attending ? 1 : 0 };
  }
}
