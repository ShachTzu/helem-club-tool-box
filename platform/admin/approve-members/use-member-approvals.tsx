import { useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

/**
 * the membership states a registered account can be in. mirrors the membership
 * aspect's own type, declared here rather than imported: the membership aspect
 * mounts this panel, so importing back from it would close a dependency cycle.
 * the GraphQL schema is the contract between them.
 */
export type MembershipStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * a member's application as the approval queue receives it. carries the
 * sensitive onboarding answers, and is only ever served to admins.
 */
export type AdminMemberProfile = {
  userId: string;
  status: MembershipStatus;
  accountEmail: string;
  accountDisplayName: string;
  provider: string;
  fullName: string;
  phone: string;
  contactEmail: string;
  age: number;
  city: string;
  communityRoles: string;
  gender: string;
  injuryNote: string;
  recognitionStatus: string;
  welcomeCallsOptIn: boolean;
  interests: string[];
  submittedAt?: string;
  decidedAt?: string;
  decisionNote: string;
  createdAt?: string;
};

const LIST_MEMBER_PROFILES_QUERY = gql`
  query ListMemberProfiles($options: ListMemberProfilesOptions) {
    listMemberProfiles(options: $options) {
      userId
      status
      accountEmail
      accountDisplayName
      provider
      fullName
      phone
      contactEmail
      age
      city
      communityRoles
      gender
      injuryNote
      recognitionStatus
      welcomeCallsOptIn
      interests
      submittedAt
      decidedAt
      decisionNote
      createdAt
    }
  }
`;

const SET_MEMBERSHIP_STATUS_MUTATION = gql`
  mutation SetMembershipStatus($options: SetMembershipStatusOptions!) {
    setMembershipStatus(options: $options) {
      userId
      status
      decidedAt
      decisionNote
    }
  }
`;

const DEFAULT_DEBOUNCE_MS = 300;

function useDebouncedValue(value: string, delayMs: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}

function matchesQuery(profile: AdminMemberProfile, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return [profile.fullName, profile.accountDisplayName, profile.accountEmail, profile.contactEmail]
    .filter(Boolean)
    .some((field) => field.toLowerCase().includes(normalized));
}

export type UseMemberApprovalsOptions = {
  /**
   * restrict the queue to a single membership state.
   */
  status?: MembershipStatus;

  /**
   * free-text search across name and email.
   */
  query?: string;

  /**
   * mock profiles, bypassing the network entirely. decisions are applied
   * locally when provided. useful for tests and previews.
   */
  mockData?: AdminMemberProfile[];
};

export type UseMemberApprovalsValue = {
  /**
   * the member applications matching the current filters.
   */
  profiles: AdminMemberProfile[];

  /**
   * per-state counts across the whole queue, ignoring the current filters.
   */
  counts: Record<MembershipStatus, number>;

  /**
   * whether the queue is loading.
   */
  loading: boolean;

  /**
   * error message raised while loading the queue, if any.
   */
  error?: string;

  /**
   * record a decision on a member's application.
   */
  setStatus: (userId: string, status: MembershipStatus, note?: string) => Promise<boolean>;

  /**
   * whether a decision is currently in flight.
   */
  deciding: boolean;
};

const EMPTY_COUNTS: Record<MembershipStatus, number> = {
  none: 0,
  pending: 0,
  approved: 0,
  rejected: 0,
};

function countByStatus(profiles: AdminMemberProfile[]): Record<MembershipStatus, number> {
  return profiles.reduce(
    (acc, profile) => ({ ...acc, [profile.status]: (acc[profile.status] || 0) + 1 }),
    { ...EMPTY_COUNTS }
  );
}

/**
 * lists member applications for the admin approval queue and exposes the
 * decision mutation. the server re-checks the admin role on every call — this
 * hook is a client of that check, not a substitute for it.
 */
export function useMemberApprovals(options?: UseMemberApprovalsOptions): UseMemberApprovalsValue {
  const { status, query = ``, mockData } = options || {};
  const hasMock = mockData !== undefined;
  const debouncedQuery = useDebouncedValue(query, DEFAULT_DEBOUNCE_MS);

  const [mockProfiles, setMockProfiles] = useState<AdminMemberProfile[]>(mockData || []);

  const queryResult = useQuery<{ listMemberProfiles: AdminMemberProfile[] }>(
    LIST_MEMBER_PROFILES_QUERY,
    {
      variables: { options: { status, query: debouncedQuery } },
      skip: hasMock,
    }
  );

  const [mutate, { loading: deciding }] = useMutation(SET_MEMBERSHIP_STATUS_MUTATION);

  const loaded = queryResult.data?.listMemberProfiles;
  const allProfiles = useMemo(
    () => (hasMock ? mockProfiles : loaded || []),
    [hasMock, mockProfiles, loaded]
  );

  const profiles = useMemo(() => {
    if (!hasMock) return allProfiles;
    return allProfiles
      .filter((profile) => (status ? profile.status === status : true))
      .filter((profile) => matchesQuery(profile, debouncedQuery));
  }, [hasMock, allProfiles, status, debouncedQuery]);

  // the counts come from the unfiltered mock list, or from the loaded page.
  // ponytail: good enough while the community is in the hundreds — swap in the
  // countMemberProfiles query if the queue ever outgrows a single page.
  const counts = useMemo(() => countByStatus(hasMock ? mockProfiles : allProfiles), [
    hasMock,
    mockProfiles,
    allProfiles,
  ]);

  const setStatus = async (userId: string, nextStatus: MembershipStatus, note?: string) => {
    if (hasMock) {
      setMockProfiles((previous) =>
        previous.map((profile) =>
          profile.userId === userId ? { ...profile, status: nextStatus } : profile
        )
      );
      return true;
    }

    const result = await mutate({ variables: { options: { userId, status: nextStatus, note } } });
    if (!result.data) return false;
    await queryResult.refetch();
    return true;
  };

  return {
    profiles,
    counts,
    loading: hasMock ? false : queryResult.loading,
    error: hasMock ? undefined : queryResult.error?.message,
    setStatus,
    deciding,
  };
}
