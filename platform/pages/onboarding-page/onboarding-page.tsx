import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { OnboardingWizard, type OnboardingWizardProps } from '@helemclub/platform.ui.onboarding-wizard';
import { useOnboarding, type OnboardingProfile } from '@helemclub/platform.hooks.use-onboarding';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import { PendingApprovalNotice } from './pending-approval-notice.js';
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
   * force the pending-approval state, useful for tests and previews.
   */
  mockPendingApproval?: boolean;

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
 * complete this profile form before continuing into the platform.
 *
 * completing the wizard does not grant community access on its own — joining
 * Helam Club is moderated. once the profile is submitted, a member whose
 * membership is still pending sees the pending-approval notice instead of
 * being redirected in, and only an approved member continues into the app.
 * RTL.
 */
export function OnboardingPage({
  redirectTo = `/`,
  onComplete,
  mockDomains,
  mockPendingApproval,
  className,
  style,
}: OnboardingPageProps) {
  const navigate = useNavigate();
  const { completeOnboarding: completeOnboardingLocally } = useOnboarding();
  const { completeOnboarding: completeOnboardingOnServer, user } = useAuth();
  const [submitted, setSubmitted] = useState(false);

  // a moderator decides on every signup, so the wizard is only the first half
  // of joining — pending and rejected members wait here.
  const awaitingApproval = mockPendingApproval ?? (user ? !user.isApprovedMember : false);

  const handleComplete = async (profile: OnboardingProfile) => {
    // persist locally right away for a snappy transition, then sync to the
    // server so the gate stays correct across devices and sessions. a server
    // failure is tolerated here — the local flag still records the profile,
    // and the gate will re-sync from `getCurrentUser` on the next load.
    completeOnboardingLocally(profile);
    try {
      await completeOnboardingOnServer(profile.interests);
    } catch {
      // ignore — see comment above.
    }
    onComplete?.(profile);
    setSubmitted(true);

    // only approved members go straight in; everyone else waits for a decision.
    if (!awaitingApproval) navigate(redirectTo);
  };

  // show the notice once the wizard was submitted, or immediately for a user
  // we already know is awaiting a decision (e.g. they signed back in).
  const showPendingNotice =
    mockPendingApproval ?? (awaitingApproval && (submitted || Boolean(user?.isPendingApproval)));

  return (
    <div className={classNames(styles.onboardingPage, className)} style={style}>
      <div className={styles.inner}>
        {showPendingNotice ? (
          <PendingApprovalNotice displayName={user?.displayName} browsePath={redirectTo} />
        ) : (
          <OnboardingWizard onComplete={handleComplete} mockDomains={mockDomains} />
        )}
      </div>
    </div>
  );
}
