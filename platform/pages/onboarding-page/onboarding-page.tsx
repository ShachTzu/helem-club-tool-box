import React from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { OnboardingWizard, type OnboardingWizardProps } from '@helemclub/platform.ui.onboarding-wizard';
import { useOnboarding, type OnboardingProfile } from '@helemclub/platform.hooks.use-onboarding';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import styles from './onboarding-page.module.scss';

export type OnboardingPageProps = {
  /**
   * where to redirect after onboarding completes.
   */
  redirectTo?: string;

  /**
   * called with the completed profile in addition to the built-in persistence
   * and redirect. useful for tests and previews.
   */
  onComplete?: (profile: OnboardingProfile) => void;

  /**
   * provide mock domains for the interests step, useful for tests and previews.
   */
  mockDomains?: OnboardingWizardProps['mockDomains'];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * onboarding page shown immediately after signup. a newly-registered user must
 * complete this profile form before continuing into the platform. persists the
 * result via useOnboarding and redirects into the app on completion. RTL.
 */
export function OnboardingPage({
  redirectTo = `/`,
  onComplete,
  mockDomains,
  className,
  style,
}: OnboardingPageProps) {
  const navigate = useNavigate();
  const { completeOnboarding: completeOnboardingLocally } = useOnboarding();
  const { completeOnboarding: completeOnboardingOnServer } = useAuth();

  const handleComplete = async (profile: OnboardingProfile) => {
    // persist locally right away for a snappy redirect, then sync to the
    // server so the gate stays correct across devices and sessions. a server
    // failure is tolerated here — the local flag still lets the user through,
    // and the gate will re-sync from `getCurrentUser` on the next load.
    completeOnboardingLocally(profile);
    try {
      await completeOnboardingOnServer(profile.interests);
    } catch {
      // ignore — see comment above.
    }
    onComplete?.(profile);
    navigate(redirectTo);
  };

  return (
    <div className={classNames(styles.onboardingPage, className)} style={style}>
      <div className={styles.inner}>
        <OnboardingWizard onComplete={handleComplete} mockDomains={mockDomains} />
      </div>
    </div>
  );
}
