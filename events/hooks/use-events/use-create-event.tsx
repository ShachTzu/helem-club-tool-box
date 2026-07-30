import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Event, type PlainEvent } from '@helemclub/events.entities.event';

/**
 * GraphQL mutation creating a new event.
 */
export const CREATE_EVENT_MUTATION = gql`
  mutation CreateEvent($options: CreateEventOptions) {
    createEvent(options: $options) {
      id
      slug
      title
      description
      type
      coverImage
      startAt
      endAt
      location
      isOnline
      joinUrl
      domains
      rsvpCount
      recordingRecordId
    }
  }
`;

type CreateEventData = {
  createEvent: PlainEvent | null;
};

/**
 * input needed to create a new event.
 */
export type CreateEventInput = {
  title: string;
  description: string;
  type: string;
  coverImage?: string;
  startAt: string;
  endAt?: string;
  location?: string;
  isOnline: boolean;
  joinUrl?: string;
  domains?: string[];
};

export type UseCreateEventValue = {
  /**
   * creates a new event. resolves with the created event, or undefined
   * when creation failed.
   */
  createEvent: (input: CreateEventInput) => Promise<Event | undefined>;

  /**
   * whether the mutation is in flight.
   */
  loading: boolean;

  /**
   * error raised by the mutation, if any.
   */
  error?: Error;
};

/**
 * creates a new community event, such as a round table, webinar, local
 * meetup or a large conference.
 */
export function useCreateEvent(): UseCreateEventValue {
  const [mutate, { loading, error }] = useMutation<CreateEventData>(CREATE_EVENT_MUTATION);

  const createEvent = async (input: CreateEventInput) => {
    const result = await mutate({ variables: { options: input } });
    return result.data?.createEvent ? Event.from(result.data.createEvent) : undefined;
  };

  return { createEvent, loading, error };
}
