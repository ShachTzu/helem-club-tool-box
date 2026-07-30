import { useCallback, useState } from 'react';

const STORAGE_KEY = 'helam.onboarding.completed';

/**
 * the profile a new user completes during the mandatory post-signup
 * onboarding flow.
 */
export type OnboardingProfile = {
  /**
   * the user's full name.
   */
  name: string;

  /**
   * an optional public display nickname.
   */
  nickname?: string;

  /**
   * the role that best describes the user (e.g. coper, family member, professional).
   */
  role?: string;

  /**
   * an optional free-text note about what brings the user to the community.
   */
  about?: string;

  /**
   * the coping-domain names the user is most interested in.
   */
  interests: string[];

  /**
   * whether the user wants updates on new content and events.
   */
  notify?: boolean;

  /**
   * whether the user prefers to stay anonymous in public activity.
   */
  anonymous?: boolean;
};

/**
 * the value returned by the useOnboarding hook.
 */
export type UseOnboardingValue = {
  /**
   * whether the current user has completed the onboarding flow.
   */
  completed: boolean;

  /**
   * persists the completed onboarding profile and marks onboarding as done.
   */
  completeOnboarding: (profile: OnboardingProfile) => void;

  /**
   * clears the completion flag (useful for testing or re-onboarding).
   */
  resetOnboarding: () => void;
};

export type UseOnboardingOptions = {
  /**
   * override the completion state, useful for tests and previews.
   */
  mockCompleted?: boolean;
};

function readCompleted(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * manages the mandatory post-signup onboarding gate. tracks whether the
 * current user has completed onboarding and persists the collected profile
 * (name, role, interest domains, preferences). new users are expected to be
 * routed to the onboarding page until `completed` is true.
 */
export function useOnboarding(options?: UseOnboardingOptions): UseOnboardingValue {
  const [completed, setCompleted] = useState<boolean>(
    options?.mockCompleted ?? readCompleted()
  );

  const completeOnboarding = useCallback((profile: OnboardingProfile) => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(STORAGE_KEY, 'true');
        window.localStorage.setItem(`${STORAGE_KEY}.profile`, JSON.stringify(profile));
      } catch {
        // ignore persistence errors (e.g. private mode)
      }
    }
    setCompleted(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    setCompleted(false);
  }, []);

  return { completed, completeOnboarding, resetOnboarding };
}
