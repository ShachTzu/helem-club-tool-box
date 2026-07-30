import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Rsvp, type PlainRsvp } from '@helemclub/events.entities.rsvp';

/**
 * GraphQL mutation creating or updating the current user's RSVP for an event.
 */
export const RSVP_MUTATION = gql`
  mutation Rsvp($eventId: String!, $attending: Boolean!) {
    rsvp(eventId: $eventId, attending: $attending) {
      id
      eventId
      userId
      attending
      createdAt
    }
  }
`;

type RsvpMutationData = {
  rsvp: PlainRsvp | null;
};

export type UseToggleRsvpValue = {
  /**
   * creates or updates the current user's RSVP for the given event. resolves
   * with the resulting RSVP, or undefined when the mutation failed.
   */
  toggleRsvp: (eventId: string, attending: boolean) => Promise<Rsvp | undefined>;

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
 * sets the current user's attending state for an event.
 */
export function useToggleRsvp(): UseToggleRsvpValue {
  const [mutate, { loading, error }] = useMutation<RsvpMutationData>(RSVP_MUTATION);

  const toggleRsvp = async (eventId: string, attending: boolean) => {
    const result = await mutate({ variables: { eventId, attending } });
    return result.data?.rsvp ? Rsvp.from(result.data.rsvp) : undefined;
  };

  return { toggleRsvp, loading, error };
}
