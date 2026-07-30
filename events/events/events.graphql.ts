import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import type { EventsNode } from './events.node.runtime.js';
import type {
  ListEventsOptions,
  GetEventOptions,
  CreateEventInput,
  UpdateEventInput,
  PublishRecordingInput,
  SessionUser,
} from './events-types.js';

type ResolverContext = {
  session?: {
    user?: SessionUser;
    userId?: string;
  };
};

/**
 * creates the GraphQL schema for the events API. exposes queries for listing
 * and resolving events and their RSVPs, together with full CRUD mutations,
 * an RSVP upsert and a publish-recording action.
 */
export function eventsGqlSchema(eventsMain: EventsNode): GqlSchema {
  return {
    typeDefs: gql`
      type Event {
        id: ID!
        slug: String!
        title: String!
        description: String!
        type: String!
        coverImage: String
        startAt: String!
        endAt: String
        location: String
        isOnline: Boolean!
        joinUrl: String
        domains: [String]
        rsvpCount: Int!
        recordingRecordId: String
      }

      type EventRsvp {
        id: ID!
        eventId: String!
        userId: String!
        attending: Boolean!
        createdAt: String!
      }

      input ListEventsOptions {
        type: String
        domainIds: [String]
        when: String
      }

      input CreateEventOptions {
        title: String!
        description: String!
        type: String!
        coverImage: String
        startAt: String!
        endAt: String
        location: String
        isOnline: Boolean!
        joinUrl: String
        domains: [String]
      }

      input UpdateEventOptions {
        title: String
        description: String
        type: String
        coverImage: String
        startAt: String
        endAt: String
        location: String
        isOnline: Boolean
        joinUrl: String
        domains: [String]
      }

      input PublishRecordingOptions {
        labelId: String!
        title: String!
        mediaType: String!
        mediaUrl: String!
        thumbnailUrl: String
        domains: [String]
      }

      type Query {
        listEvents(options: ListEventsOptions): [Event]
        getEvent(idOrSlug: String!): Event
        listRsvps(eventId: String!): [EventRsvp]
      }

      type Mutation {
        createEvent(options: CreateEventOptions): Event
        updateEvent(id: String!, options: UpdateEventOptions): Event
        deleteEvent(id: String!): Boolean
        rsvp(eventId: String!, attending: Boolean!): EventRsvp
        publishRecording(eventId: String!, options: PublishRecordingOptions): Boolean
      }
    `,
    resolvers: {
      Query: {
        listEvents: async (_parent: unknown, { options }: { options?: ListEventsOptions }) => {
          const events = await eventsMain.listEvents(options || {});
          return events.map((event) => event.toObject());
        },
        getEvent: async (_parent: unknown, { idOrSlug }: GetEventOptions) => {
          if (!idOrSlug) return null;
          const event = await eventsMain.getEvent(idOrSlug);
          return event ? event.toObject() : null;
        },
        listRsvps: async (_parent: unknown, { eventId }: { eventId: string }) => {
          if (!eventId) return [];
          const rsvps = await eventsMain.listRsvps(eventId);
          return rsvps.map((rsvp) => rsvp.toObject());
        },
      },
      Mutation: {
        createEvent: async (
          _parent: unknown,
          { options }: { options?: CreateEventInput },
          context: ResolverContext
        ) => {
          const user = context?.session?.user;
          if (!user) throw new Unauthorized();
          if (!options) return null;
          const event = await eventsMain.createEvent(options, user);
          return event.toObject();
        },
        updateEvent: async (
          _parent: unknown,
          { id, options }: { id: string; options?: UpdateEventInput },
          context: ResolverContext
        ) => {
          const user = context?.session?.user;
          if (!user) throw new Unauthorized();
          const event = await eventsMain.updateEvent(id, options || {}, user);
          return event ? event.toObject() : null;
        },
        deleteEvent: async (
          _parent: unknown,
          { id }: { id: string },
          context: ResolverContext
        ) => {
          const user = context?.session?.user;
          if (!user) throw new Unauthorized();
          return eventsMain.deleteEvent(id, user);
        },
        rsvp: async (
          _parent: unknown,
          { eventId, attending }: { eventId: string; attending: boolean },
          context: ResolverContext
        ) => {
          const user = context?.session?.user;
          if (!user) throw new Unauthorized();
          const rsvp = await eventsMain.rsvp(eventId, attending, user);
          return rsvp.toObject();
        },
        publishRecording: async (
          _parent: unknown,
          { eventId, options }: { eventId: string; options?: PublishRecordingInput },
          context: ResolverContext
        ) => {
          const user = context?.session?.user;
          if (!user) throw new Unauthorized();
          if (!options) return false;
          return eventsMain.publishRecording(eventId, options, user);
        },
      },
    },
  };
}
