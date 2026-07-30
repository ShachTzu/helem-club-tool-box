import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Rsvp, type PlainRsvp } from '@helemclub/events.entities.rsvp';

/**
 * GraphQL query fetching every RSVP recorded against a given event.
 */
export const LIST_RSVPS_QUERY = gql`
  query ListRsvps($eventId: String!) {
    listRsvps(eventId: $eventId) {
      id
      eventId
      userId
      attending
      createdAt
    }
  }
`;

type ListRsvpsData = {
  listRsvps: (PlainRsvp | null)[] | null;
};

export type UseListRsvpsOptions = {
  /**
   * provide mock RSVPs to bypass the GraphQL query, useful for tests and previews.
   */
  mockData?: PlainRsvp[];
};

export type UseListRsvpsValue = {
  /**
   * the RSVPs recorded for the event.
   */
  rsvps: Rsvp[];

  /**
   * whether the RSVPs query is in flight.
   */
  loading: boolean;

  /**
   * error raised by the RSVPs query, if any.
   */
  error?: Error;

  /**
   * re-fetches the RSVPs for the event from the server.
   */
  refetch: () => void;
};

/**
 * fetches every RSVP recorded against a given event. accepts optional mock
 * data to skip the network request entirely, used for tests and previews.
 */
export function useListRsvps(eventId: string, options?: UseListRsvpsOptions): UseListRsvpsValue {
  const hasMock = options?.mockData !== undefined;

  const { data, loading, error, refetch } = useQuery<ListRsvpsData>(LIST_RSVPS_QUERY, {
    variables: { eventId },
    skip: hasMock || !eventId,
  });

  const rsvps = useMemo(() => {
    if (hasMock) {
      return (options?.mockData || []).map((plainRsvp) => Rsvp.from(plainRsvp));
    }
    const list = data?.listRsvps || [];
    return list.filter((item): item is PlainRsvp => Boolean(item)).map((plainRsvp) => Rsvp.from(plainRsvp));
  }, [hasMock, options?.mockData, data]);

  return {
    rsvps,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch: () => {
      if (hasMock) return;
      refetch();
    },
  };
}
