import { SymphonyPlatformAspect, type SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformNode } from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
import { Event, type EventType } from '@helemclub/events.entities.event';
import { Rsvp } from '@helemclub/events.entities.rsvp';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import { NotFound } from '@bitdev/symphony.exceptions.not-found';
import type { EventsConfig } from './events-config.js';
import { eventsGqlSchema } from './events.graphql.js';
import { EventModel, EVENT_MOCKS } from './event.model.js';
import { RsvpModel } from './rsvp.model.js';
import { EventRepository } from './event-repository.js';
import { RsvpRepository } from './rsvp-repository.js';
import type {
  ListEventsOptions,
  CreateEventInput,
  UpdateEventInput,
  PublishRecordingInput,
  SessionUser,
} from './events-types.js';

/**
 * roles allowed to manage events and publish recordings.
 */
const MANAGE_ROLES = ['moderator', 'admin'];

export class EventsNode {
  constructor(
    private eventsConfig: EventsConfig,
    private symphonyPlatform: SymphonyPlatformNode,
    private helamPlatform: HelamPlatformNode,
    private eventRepository: EventRepository,
    private rsvpRepository: RsvpRepository
  ) {}

  /**
   * assert that the given user holds a moderator or admin role, throwing an
   * AccessDenied exception otherwise.
   */
  private assertCanManage(user?: SessionUser): void {
    if (!user || !user.role || !MANAGE_ROLES.includes(user.role)) {
      throw new AccessDenied();
    }
  }

  /**
   * build an Event entity from a persisted event document, narrowing its
   * loosely-typed `type` field to the entity's EventType union.
   */
  private toEvent(model: EventModel): Event {
    return Event.from({ ...model, type: model.type as EventType });
  }

  /**
   * list events, filtered by type, domain ids and upcoming/past timeframe.
   */
  async listEvents(options?: ListEventsOptions): Promise<Event[]> {
    const events = await this.eventRepository.listEvents(options || {});
    return events.map((event) => this.toEvent(event));
  }

  /**
   * resolve a single event by its id or slug.
   */
  async getEvent(idOrSlug: string): Promise<Event | null> {
    const event = await this.eventRepository.getEventByIdOrSlug(idOrSlug);
    return event ? this.toEvent(event) : null;
  }

  /**
   * list every RSVP recorded against an event.
   */
  async listRsvps(eventId: string): Promise<Rsvp[]> {
    const rsvps = await this.rsvpRepository.listRsvps(eventId);
    return rsvps.map((rsvp) => Rsvp.from(rsvp));
  }

  /**
   * create a new community event. restricted to moderators and admins.
   */
  async createEvent(input: CreateEventInput, user?: SessionUser): Promise<Event> {
    this.assertCanManage(user);
    const created = await this.eventRepository.createEvent(input);
    return this.toEvent(created);
  }

  /**
   * update an existing event by id. restricted to moderators and admins.
   */
  async updateEvent(id: string, input: UpdateEventInput, user?: SessionUser): Promise<Event | null> {
    this.assertCanManage(user);
    const updated = await this.eventRepository.updateEvent(id, input);
    return updated ? this.toEvent(updated) : null;
  }

  /**
   * delete an event by id. restricted to moderators and admins.
   */
  async deleteEvent(id: string, user?: SessionUser): Promise<boolean> {
    this.assertCanManage(user);
    return this.eventRepository.deleteEvent(id);
  }

  /**
   * upsert the current user's RSVP for an event, keeping the event's cached
   * attendee count in sync with atomic increments. requires authentication.
   */
  async rsvp(eventId: string, attending: boolean, user?: SessionUser): Promise<Rsvp> {
    if (!user || !user.id) throw new AccessDenied();

    const event = await this.eventRepository.getEventByIdOrSlug(eventId);
    if (!event) throw new NotFound('event');

    const { rsvp, countDelta } = await this.rsvpRepository.upsertRsvp(event.id, user.id, attending);
    if (countDelta !== 0) {
      await this.eventRepository.adjustRsvpCount(event.id, countDelta);
    }

    return Rsvp.from(rsvp);
  }

  /**
   * publish a recorded media record for a past event and link it back to the
   * event, feeding the knowledge base. restricted to moderators and admins.
   */
  async publishRecording(
    eventId: string,
    input: PublishRecordingInput,
    user?: SessionUser
  ): Promise<boolean> {
    this.assertCanManage(user);

    const event = await this.eventRepository.getEventByIdOrSlug(eventId);
    if (!event) throw new NotFound('event');

    const recordingRecordId = crypto.randomUUID();
    const updated = await this.eventRepository.setRecordingRecordId(event.id, recordingRecordId);
    return Boolean(updated);
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: EventsConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
    config: EventsConfig
  ) {
    const eventModel = getModelForClass(EventModel);
    const rsvpModel = getModelForClass(RsvpModel);

    const eventRepository = new EventRepository(eventModel);
    const rsvpRepository = new RsvpRepository(rsvpModel);

    const events = new EventsNode(
      config,
      symphonyPlatform,
      helamPlatform,
      eventRepository,
      rsvpRepository
    );

    const gqlSchema = eventsGqlSchema(events);

    helamPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    helamPlatform.registerOnStart(async () => {
      const existing = await eventModel.find().limit(1).exec();
      if (existing.length > 0) return;
      await eventModel.insertMany(EVENT_MOCKS);
    });

    return events;
  }
}

export default EventsNode;
