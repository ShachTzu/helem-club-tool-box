import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { Event, type PlainEvent } from '@helemclub/events.entities.event';

/**
 * GraphQL query listing events, optionally filtered by type, domains and
 * whether they are upcoming or past.
 */
export const LIST_EVENTS_QUERY = gql`
  query ListEvents($type: String, $domainIds: [String], $when: String) {
    listEvents(options: { type: $type, domainIds: $domainIds, when: $when }) {
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

type ListEventsData = {
  listEvents: (PlainEvent | null)[] | null;
};

/**
 * whether to list upcoming or past events.
 */
export type EventsWhen = 'upcoming' | 'past';

export type UseListEventsOptions = {
  /**
   * filter events by type (e.g. round_table, webinar, local, big).
   */
  type?: string;

  /**
   * filter events by associated domain ids.
   */
  domainIds?: string[];

  /**
   * filter events to only upcoming or only past ones.
   */
  when?: EventsWhen;

  /**
   * provide mock data for the events list to bypass the GraphQL query,
   * useful for tests and previews.
   */
  mockData?: PlainEvent[];
};

export type UseListEventsValue = {
  /**
   * the list of events matching the given filters.
   */
  events: Event[];

  /**
   * whether the events list is still being resolved.
   */
  loading: boolean;

  /**
   * error raised while resolving the events list, if any.
   */
  error?: Error;

  /**
   * re-fetches the events list from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * lists events, optionally filtered by type, domain ids, and whether they
 * are upcoming or past events.
 */
export function useListEvents(options?: UseListEventsOptions): UseListEventsValue {
  const hasMock = Boolean(options?.mockData);

  const { data, loading, error, refetch } = useQuery<ListEventsData>(LIST_EVENTS_QUERY, {
    variables: { type: options?.type, domainIds: options?.domainIds, when: options?.when },
    skip: hasMock,
  });

  const events = useMemo(() => {
    if (hasMock) return (options?.mockData || []).map(Event.from);
    return (data?.listEvents || []).filter((item): item is PlainEvent => Boolean(item)).map(Event.from);
  }, [hasMock, options?.mockData, data]);

  return {
    events,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
