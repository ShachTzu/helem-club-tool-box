import type { EventType } from '@helemclub/events.entities.event';

/**
 * options accepted by the listEvents query.
 */
export type ListEventsOptions = {
  /**
   * filter events by type (round_table, webinar, local, big).
   */
  type?: string;

  /**
   * filter events associated with any of the given domain ids.
   */
  domainIds?: string[];

  /**
   * filter events to only upcoming or only past ones.
   */
  when?: 'upcoming' | 'past';
};

/**
 * options accepted by the getEvent query.
 */
export type GetEventOptions = {
  idOrSlug: string;
};

/**
 * options accepted by the rsvp mutation.
 */
export type RsvpOptions = {
  eventId: string;
  attending: boolean;
};

/**
 * input needed to create a new event.
 */
export type CreateEventInput = {
  title: string;
  description: string;
  type: EventType;
  coverImage?: string;
  startAt: string;
  endAt?: string;
  location?: string;
  isOnline: boolean;
  joinUrl?: string;
  domains?: string[];
};

/**
 * input fields that may be updated on an existing event.
 */
export type UpdateEventInput = {
  title?: string;
  description?: string;
  type?: EventType;
  coverImage?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  isOnline?: boolean;
  joinUrl?: string;
  domains?: string[];
};

/**
 * input needed to publish a recording for a past event into the knowledge base.
 */
export type PublishRecordingInput = {
  labelId: string;
  title: string;
  mediaType: string;
  mediaUrl: string;
  thumbnailUrl?: string;
  domains?: string[];
};

/**
 * the minimal authenticated user shape read from the request session in
 * GraphQL resolvers.
 */
export type SessionUser = {
  id: string;
  email?: string;
  displayName?: string;
  role?: string;
};

/**
 * the resolved RSVP shape returned by the API.
 */
export type EventRsvp = {
  id: string;
  eventId: string;
  userId: string;
  attending: boolean;
  createdAt: string;
};
