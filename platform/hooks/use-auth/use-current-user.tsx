import { useMemo } from 'react';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { User, type PlainUser } from '@helemclub/platform.entities.user';

/**
 * GraphQL query fetching the currently authenticated platform user.
 * Returns null when no user is signed in.
 */
export const GET_CURRENT_USER_QUERY = gql`
  query GetCurrentUser {
    getCurrentUser {
      id
      email
      displayName
      avatarUrl
      role
      provider
      createdAt
      onboardingCompleted
      interests
      membershipStatus
      contentAdmin
    }
  }
`;

type GetCurrentUserData = {
  getCurrentUser: PlainUser | null;
};

export type UseCurrentUserOptions = {
  /**
   * provide mock data to bypass the GraphQL query, useful for tests and previews.
   * pass null to simulate a signed-out state.
   */
  mockData?: PlainUser | null;
};

export type UseCurrentUserValue = {
  /**
   * the currently authenticated user, or null when signed out.
   */
  user: User | null;

  /**
   * whether the current user query is in flight.
   */
  loading: boolean;

  /**
   * error raised by the current user query, if any.
   */
  error?: Error;

  /**
   * re-fetches the current user from the server.
   */
  refetch: () => Promise<unknown>;
};

/**
 * fetches the currently authenticated platform user. accepts optional mock
 * data to skip the network request entirely, used for tests and previews.
 */
export function useCurrentUser(options?: UseCurrentUserOptions): UseCurrentUserValue {
  const hasMock = options !== undefined && Object.prototype.hasOwnProperty.call(options, 'mockData');

  const { data, loading, error, refetch } = useQuery<GetCurrentUserData>(GET_CURRENT_USER_QUERY, {
    skip: hasMock,
  });

  const user = useMemo(() => {
    if (hasMock) {
      return options?.mockData ? User.from(options.mockData) : null;
    }
    return data?.getCurrentUser ? User.from(data.getCurrentUser) : null;
  }, [hasMock, options?.mockData, data]);

  return {
    user,
    loading: hasMock ? false : loading,
    error: hasMock ? undefined : error,
    refetch,
  };
}
