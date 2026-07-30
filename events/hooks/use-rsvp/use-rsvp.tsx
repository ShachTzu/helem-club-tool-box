import { useCallback, useMemo } from 'react';
import { useAuth, type UseAuthOptions } from '@helemclub/platform.hooks.use-auth';
import { Rsvp, type PlainRsvp } from '@helemclub/events.entities.rsvp';
import { useListRsvps } from './use-list-rsvps.js';
import { useToggleRsvp } from './use-toggle-rsvp.js';

export type UseRsvpOptions = {
  /**
   * provide mock data to bypass the GraphQL queries and mutation entirely,
   * useful for tests and previews.
   */
  mockData?: {
    /**
     * mock the currently authenticated user. pass null to simulate a signed-out state.
     */
    user?: UseAuthOptions['mockData'];

    /**
     * mock the RSVPs recorded for the event.
     */
    rsvps?: PlainRsvp[];
  };
};

export type UseRsvpValue = {
  /**
   * whether the current user is attending the event.
   */
  attending: boolean;

  /**
   * the current user's RSVP for the event, if one was recorded.
   */
  rsvp?: Rsvp;

  /**
   * every RSVP recorded for the event. only populated for admin users;
   * empty for everyone else.
   */
  rsvps: Rsvp[];

  /**
   * total number of RSVPs recorded for the event, regardless of role.
   */
  rsvpCount: number;

  /**
   * whether the current user holds the admin role.
   */
  isAdmin: boolean;

  /**
   * whether the RSVPs for the event are still being resolved.
   */
  loading: boolean;

  /**
   * whether the toggle RSVP mutation is in flight.
   */
  toggling: boolean;

  /**
   * error raised while resolving the RSVPs, if any.
   */
  error?: Error;

  /**
   * toggles the current user's attending state for the event, then
   * re-fetches the event's RSVPs.
   */
  toggleRsvp: () => Promise<void>;

  /**
   * re-fetches the RSVPs for the event from the server.
   */
  refetch: () => void;
};

/**
 * resolves the current user's RSVP state for an event, exposes a function to
 * toggle it, and — for admin users — the full list of RSVPs recorded for the
 * event. relies on useAuth to identify the current user, so no user
 * information needs to be passed in explicitly.
 */
export function useRsvp(eventId: string, options?: UseRsvpOptions): UseRsvpValue {
  const hasMockUser = options?.mockData !== undefined && Object.prototype.hasOwnProperty.call(options.mockData, 'user');
  const { user, isAdmin } = useAuth(hasMockUser ? { mockData: options?.mockData?.user ?? null } : undefined);

  const hasMockRsvps = options?.mockData !== undefined && Object.prototype.hasOwnProperty.call(options.mockData, 'rsvps');
  const { rsvps, loading, error, refetch } = useListRsvps(eventId, hasMockRsvps ? { mockData: options?.mockData?.rsvps || [] } : undefined);

  const { toggleRsvp: toggleRsvpMutation, loading: toggling } = useToggleRsvp();

  const myRsvp = useMemo(() => {
    if (!user) return undefined;
    return rsvps.find((candidate) => candidate.userId === user.id);
  }, [rsvps, user]);

  const attending = Boolean(myRsvp?.attending);

  const toggleRsvp = useCallback(async () => {
    if (!eventId || !user) return;
    await toggleRsvpMutation(eventId, !attending);
    refetch();
  }, [eventId, user, attending, toggleRsvpMutation, refetch]);

  return {
    attending,
    rsvp: myRsvp,
    rsvps: isAdmin ? rsvps : [],
    rsvpCount: rsvps.length,
    isAdmin,
    loading,
    toggling,
    error,
    toggleRsvp,
    refetch,
  };
}
