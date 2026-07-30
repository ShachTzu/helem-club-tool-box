import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Event, type PlainEvent } from '@helemclub/events.entities.event';

/**
 * GraphQL mutation updating an existing event.
 */
export const UPDATE_EVENT_MUTATION = gql`
  mutation UpdateEvent($id: String!, $options: UpdateEventOptions) {
    updateEvent(id: $id, options: $options) {
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

type UpdateEventData = {
  updateEvent: PlainEvent | null;
};

/**
 * input fields that may be updated on an existing event.
 */
export type UpdateEventInput = {
  title?: string;
  description?: string;
  type?: string;
  coverImage?: string;
  startAt?: string;
  endAt?: string;
  location?: string;
  isOnline?: boolean;
  joinUrl?: string;
  domains?: string[];
};

export type UseUpdateEventValue = {
  /**
   * updates an existing event by id. resolves with the updated event, or
   * undefined when the update failed.
   */
  updateEvent: (id: string, input: UpdateEventInput) => Promise<Event | undefined>;

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
 * updates an existing community event's fields.
 */
export function useUpdateEvent(): UseUpdateEventValue {
  const [mutate, { loading, error }] = useMutation<UpdateEventData>(UPDATE_EVENT_MUTATION);

  const updateEvent = async (id: string, input: UpdateEventInput) => {
    const result = await mutate({ variables: { id, options: input } });
    return result.data?.updateEvent ? Event.from(result.data.updateEvent) : undefined;
  };

  return { updateEvent, loading, error };
}
