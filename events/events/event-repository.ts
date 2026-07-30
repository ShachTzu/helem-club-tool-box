import type { ReturnModelType } from '@typegoose/typegoose';
import { EventModel } from './event.model.js';
import type { ListEventsOptions, CreateEventInput, UpdateEventInput } from './events-types.js';

/**
 * turn a title into a url-friendly slug, preserving hebrew characters and
 * collapsing whitespace and punctuation into single dashes.
 */
function slugify(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/['"`]/g, '')
    .replace(/[^a-z0-9\u0590-\u05FF]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return base || 'event';
}

/**
 * data-access layer for community events, wrapping the typegoose Event model.
 */
export class EventRepository {
  constructor(private eventModel: ReturnModelType<typeof EventModel>) {}

  /**
   * list and filter events by type, domainIds and timeframe (upcoming vs
   * past), sorted by start date.
   */
  async listEvents(options: ListEventsOptions = {}): Promise<EventModel[]> {
    const query: Record<string, unknown> = {};

    if (options.type) {
      query.type = options.type;
    }

    if (options.domainIds && options.domainIds.length > 0) {
      query.domains = { $in: options.domainIds };
    }

    const now = new Date().toISOString();
    if (options.when === 'upcoming') {
      query.startAt = { $gte: now };
    } else if (options.when === 'past') {
      query.startAt = { $lt: now };
    }

    const sortDirection = options.when === 'past' ? -1 : 1;
    const events = await this.eventModel.find(query).sort({ startAt: sortDirection }).exec();
    return events.map((event) => event.toObject());
  }

  /**
   * find an event by its id or slug.
   */
  async getEventByIdOrSlug(idOrSlug: string): Promise<EventModel | null> {
    const event = await this.eventModel
      .findOne({ $or: [{ id: idOrSlug }, { slug: idOrSlug }] })
      .exec();
    return event ? event.toObject() : null;
  }

  /**
   * generate a unique slug derived from the title, appending a numeric suffix
   * on collision.
   */
  private async uniqueSlug(title: string): Promise<string> {
    const base = slugify(title);
    let slug = base;
    let suffix = 1;
    while (await this.eventModel.exists({ slug })) {
      suffix += 1;
      slug = `${base}-${suffix}`;
    }
    return slug;
  }

  /**
   * create a new event.
   */
  async createEvent(input: CreateEventInput): Promise<EventModel> {
    const id = crypto.randomUUID();
    const slug = await this.uniqueSlug(input.title);
    const created = await this.eventModel.create({
      id,
      slug,
      title: input.title,
      description: input.description,
      type: input.type,
      coverImage: input.coverImage,
      startAt: input.startAt,
      endAt: input.endAt,
      location: input.location,
      isOnline: input.isOnline,
      joinUrl: input.joinUrl,
      domains: input.domains || [],
      rsvpCount: 0,
    });
    return created.toObject();
  }

  /**
   * update an existing event by id, only touching the provided fields.
   */
  async updateEvent(id: string, input: UpdateEventInput): Promise<EventModel | null> {
    const update: Record<string, unknown> = {};
    const keys = Object.keys(input) as Array<keyof UpdateEventInput>;
    keys.forEach((key) => {
      if (input[key] !== undefined) update[key] = input[key];
    });

    const updated = await this.eventModel
      .findOneAndUpdate({ id }, { $set: update }, { new: true })
      .exec();
    return updated ? updated.toObject() : null;
  }

  /**
   * delete an event by id.
   */
  async deleteEvent(id: string): Promise<boolean> {
    const result = await this.eventModel.deleteOne({ id }).exec();
    return result.deletedCount > 0;
  }

  /**
   * atomically adjust the cached RSVP count for an event.
   */
  async adjustRsvpCount(id: string, delta: number): Promise<void> {
    await this.eventModel.updateOne({ id }, { $inc: { rsvpCount: delta } }).exec();
  }

  /**
   * set the id of the recording published for a past event.
   */
  async setRecordingRecordId(id: string, recordingRecordId: string): Promise<EventModel | null> {
    const updated = await this.eventModel
      .findOneAndUpdate({ id }, { $set: { recordingRecordId } }, { new: true })
      .exec();
    return updated ? updated.toObject() : null;
  }
}
