import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { User, type PlainUser } from '@helemclub/platform.entities.user';

/**
 * GraphQL mutation persisting the mandatory post-signup onboarding profile:
 * marks the signed-in user as having completed onboarding and stores the
 * coping-domain interests they selected in the wizard.
 */
export const COMPLETE_ONBOARDING_MUTATION = gql`
  mutation CompleteOnboarding($interests: [String!]) {
    completeOnboarding(options: { interests: $interests }) {
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
    }
  }
`;

type CompleteOnboardingData = {
  completeOnboarding: PlainUser | null;
};

export type UseCompleteOnboardingValue = {
  /**
   * persists the onboarding profile's interests on the server and marks the
   * signed-in user as onboarded. resolves with the updated user, or
   * undefined when the mutation failed (e.g. the visitor is signed out).
   */
  completeOnboarding: (interests: string[]) => Promise<User | undefined>;

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
 * persists onboarding completion to the backend, syncing the interests
 * collected by the onboarding wizard onto the user's MongoDB record so the
 * gate stays consistent across devices and sessions rather than living only
 * in local storage.
 */
export function useCompleteOnboarding(): UseCompleteOnboardingValue {
  const [mutate, { loading, error }] = useMutation<CompleteOnboardingData>(
    COMPLETE_ONBOARDING_MUTATION
  );

  const completeOnboarding = async (interests: string[]) => {
    const result = await mutate({ variables: { interests } });
    const user = result.data?.completeOnboarding;
    return user ? User.from(user) : undefined;
  };

  return { completeOnboarding, loading, error };
}
