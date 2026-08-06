import { useCallback } from 'react';
import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';

const MY_MEMBERSHIP_QUERY = gql`
  query MyMembership {
    myMembership {
      userId
      status
      onboardingCompleted
      fullName
    }
  }
`;

const SUBMIT_MEMBER_PROFILE_MUTATION = gql`
  mutation SubmitMemberProfile($options: SubmitMemberProfileOptions!) {
    submitMemberProfile(options: $options) {
      userId
      status
      onboardingCompleted
      fullName
    }
  }
`;

/**
 * the membership state of the signed-in member.
 *
 * - `none`      — registered, has not completed onboarding ("לא חבר קהילה")
 * - `pending`   — onboarding submitted, awaiting approval ("ממתין לאישור")
 * - `approved`  — an approved community member ("חבר קהילה")
 * - `rejected`  — an admin declined membership ("לא חבר קהילה")
 */
export type MembershipStatus = 'none' | 'pending' | 'approved' | 'rejected';

/**
 * the profile a new member completes during the mandatory post-signup
 * onboarding flow. mirrors questions 1-9 and 12 of the community's volunteer
 * survey, plus the platform's own interests step.
 */
export type OnboardingProfile = {
  /**
   * the member's full name (q1).
   */
  fullName: string;

  /**
   * phone number (q2) — the one answer the survey requires.
   */
  phone: string;

  /**
   * preferred contact email (q3). may differ from the sign-in address.
   */
  contactEmail?: string;

  /**
   * age (q4).
   */
  age?: number;

  /**
   * city or area of residence (q5).
   */
  city?: string;

  /**
   * roles the member already holds inside the community (q6).
   */
  communityRoles?: string;

  /**
   * gender (q7), used to match members for welcome calls.
   */
  gender?: 'female' | 'male' | 'other';

  /**
   * a few words about the member's injury (q8). health data.
   */
  injuryNote?: string;

  /**
   * recognition status with National Insurance / Ministry of Defense (q9).
   * health data.
   */
  recognitionStatus?: 'recognized' | 'in-process' | 'planned' | 'none';

  /**
   * whether the member is willing to take welcome calls with new members (q12).
   */
  welcomeCallsOptIn?: boolean;

  /**
   * the coping-domain names the member is most interested in.
   */
  interests: string[];
};

/**
 * the value returned by the useOnboarding hook.
 */
export type UseOnboardingValue = {
  /**
   * whether the current user has submitted the onboarding profile. this is the
   * gate for the onboarding wizard — it says nothing about approval.
   */
  completed: boolean;

  /**
   * the member's community-membership state.
   */
  status: MembershipStatus;

  /**
   * whether the member is an approved community member. member-only actions
   * (submitting a tool, commenting, rating) key off this, not `completed`.
   */
  isMember: boolean;

  /**
   * the name the member gave during onboarding, when they have one.
   */
  fullName: string;

  /**
   * whether the membership state is still being resolved.
   */
  loading: boolean;

  /**
   * persists the completed onboarding profile and enters the approval queue.
   * resolves with the resulting membership state.
   */
  completeOnboarding: (profile: OnboardingProfile) => Promise<MembershipStatus>;
};

export type UseOnboardingOptions = {
  /**
   * override the membership state, bypassing the network. useful for tests
   * and previews.
   */
  mockStatus?: MembershipStatus;
};

type MyMembershipResult = {
  myMembership: {
    userId: string;
    status: MembershipStatus;
    onboardingCompleted: boolean;
    fullName?: string;
  } | null;
};

/**
 * resolves the signed-in member's community-membership state and submits the
 * mandatory post-signup onboarding profile.
 *
 * the state lives on the server (the membership aspect), not in localStorage:
 * membership is an approval decision an admin makes, so the browser is not
 * allowed to be the source of truth for it, and it has to survive a new device
 * or a cleared cache. anonymous visitors simply get `none`.
 */
export function useOnboarding(options?: UseOnboardingOptions): UseOnboardingValue {
  const hasMock = options?.mockStatus !== undefined;

  const queryResult = useQuery<MyMembershipResult>(MY_MEMBERSHIP_QUERY, { skip: hasMock });
  const [mutate] = useMutation<{ submitMemberProfile: MyMembershipResult['myMembership'] }>(
    SUBMIT_MEMBER_PROFILE_MUTATION
  );

  const loading = hasMock ? false : queryResult.loading;
  const status: MembershipStatus = hasMock
    ? (options?.mockStatus as MembershipStatus)
    : queryResult.data?.myMembership?.status || 'none';

  const completeOnboarding = useCallback(
    async (profile: OnboardingProfile) => {
      if (hasMock) return 'pending' as MembershipStatus;

      const result = await mutate({ variables: { options: profile } });
      await queryResult.refetch();
      return result.data?.submitMemberProfile?.status || 'pending';
    },
    [hasMock, mutate, queryResult]
  );

  return {
    // while the state is still loading we report onboarding as done. the
    // onboarding gate redirects on `!completed`, so answering "false" during
    // the query would bounce an already-onboarded member to the wizard for a
    // frame on every page load.
    completed: loading ? true : status !== 'none',
    status,
    isMember: status === 'approved',
    fullName: (hasMock ? '' : queryResult.data?.myMembership?.fullName) || '',
    loading,
    completeOnboarding,
  };
}
