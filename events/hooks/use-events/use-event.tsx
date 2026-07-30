import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Event, type PlainEvent } from '@helemclub/events.entities.event';

/**
 * GraphQL query resolving a single event by its id or slug.
 */
export const GET_EVENT_QUERY = gql`
  query GetEvent($idOrSlug: String!) {
    getEvent(idOrSlug: $idOrSlug) {
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

type GetEventData = {
  getEvent: PlainEvent | null;
};

export type UseEventOptions = {
  /**
   * provide mock data for the event to bypass the GraphQL query, useful
   * for tests and previews. pass null to simulate a missing event.
   */
  mockData?: PlainEvent | null;
};

export type UseEventValue = {
  /**
   * the resolved event, or null when not found.
   */
  event: Event | null;

  /**
   * whether the event is still being resolved.
   */
  loading: boolean;

  /**
   * error raised while resolving the event, if any.
   */
  error?: Error;

  /**
   * re-fetches the event from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * resolves a single event by its id or slug. accepts optional mock data to
 * skip the network request entirely, used for tests and previews.
 */
export function useEvent(idOrSlug: string, options?: UseEventOptions): UseEventValue {
  const hasMock = options?.mockData !== undefined;

  const { data, loading, error, refetch } = useQuery<GetEventData>(GET_EVENT_QUERY, {
    variables: { idOrSlug },
    skip: hasMock || !idOrSlug,
  });

  const event = useMemo(() => {
    if (hasMock) return options?.mockData ? Event.from(options.mockData) : null;
    return data?.getEvent ? Event.from(data.getEvent) : null;
  }, [hasMock, options?.mockData, data]);

  return {
    event,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
