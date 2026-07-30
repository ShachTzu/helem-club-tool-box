import { useEffect, useMemo, useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { User, type PlainUser, type UserRole } from '@helemclub/platform.entities.user';

const LIST_PLATFORM_USERS_QUERY = gql`
  query ListPlatformUsers($options: ListPlatformUsersOptions) {
    listUsers(options: $options) {
      id
      email
      displayName
      avatarUrl
      role
      provider
      createdAt
    }
  }
`;

const UPDATE_PLATFORM_USER_ROLE_MUTATION = gql`
  mutation UpdatePlatformUserRole($options: UpdatePlatformUserRoleOptions!) {
    updateUserRole(options: $options) {
      id
      email
      displayName
      avatarUrl
      role
      provider
      createdAt
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

function matchesQuery(user: PlainUser, query: string): boolean {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;
  return (
    user.displayName.toLowerCase().includes(normalized) || user.email.toLowerCase().includes(normalized)
  );
}

export type UsePlatformUsersOptions = {
  /**
   * search query applied to the user's display name and email.
   */
  query?: string;

  /**
   * mock/initial list of users, bypassing the GraphQL query. role changes
   * are applied locally when provided. useful for tests and previews.
   */
  mockData?: PlainUser[];
};

export type UsePlatformUsersValue = {
  /**
   * users matching the current search query.
   */
  users: User[];

  /**
   * whether the users list is currently loading.
   */
  loading: boolean;

  /**
   * error message raised while loading the users list, if any.
   */
  error?: string;

  /**
   * updates a user's role. resolves with whether the update succeeded.
   */
  updateRole: (userId: string, role: UserRole) => Promise<boolean>;

  /**
   * whether a role update is currently in flight.
   */
  updating: boolean;
};

/**
 * lists platform users, optionally filtered by a search query, and exposes a
 * mutation to update a user's role. accepts mock data to bypass the network
 * entirely, useful for tests and previews.
 */
export function usePlatformUsers(options?: UsePlatformUsersOptions): UsePlatformUsersValue {
  const { query = ``, mockData } = options || {};
  const hasMock = mockData !== undefined;
  const debouncedQuery = useDebouncedValue(query, DEFAULT_DEBOUNCE_MS);

  const [mockUsersState, setMockUsersState] = useState<PlainUser[]>(mockData || []);

  const queryResult = useQuery<{ listUsers: PlainUser[] }>(LIST_PLATFORM_USERS_QUERY, {
    variables: { options: { query: debouncedQuery } },
    skip: hasMock,
  });

  const [mutate, { loading: updating }] = useMutation<{ updateUserRole: PlainUser }>(
    UPDATE_PLATFORM_USER_ROLE_MUTATION
  );

  const users = useMemo(() => {
    if (hasMock) {
      return mockUsersState.filter((user) => matchesQuery(user, debouncedQuery)).map((user) => User.from(user));
    }
    return (queryResult.data?.listUsers || []).map((user) => User.from(user));
  }, [hasMock, mockUsersState, debouncedQuery, queryResult.data]);

  const updateRole = async (userId: string, role: UserRole) => {
    if (hasMock) {
      setMockUsersState((previousUsers) =>
        previousUsers.map((user) => (user.id === userId ? { ...user, role } : user))
      );
      return true;
    }

    const result = await mutate({ variables: { options: { userId, role } } });
    if (!result.data?.updateUserRole) return false;
    await queryResult.refetch();
    return true;
  };

  return {
    users,
    loading: hasMock ? false : queryResult.loading,
    error: hasMock ? undefined : queryResult.error?.message,
    updateRole,
    updating,
  };
}
