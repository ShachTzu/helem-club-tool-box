import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { OnboardingWizard, type OnboardingWizardProps } from '@helemclub/platform.ui.onboarding-wizard';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import {
  useOnboarding,
  type OnboardingProfile,
  type MembershipStatus,
} from '@helemclub/platform.hooks.use-onboarding';
import styles from './onboarding-page.module.scss';

export type OnboardingPageProps = {
  /**
   * where to send the member once they are done reading the confirmation.
   */
  redirectTo?: string;

  /**
   * called with the completed profile in addition to the built-in persistence.
   * useful for tests and previews.
   */
  onComplete?: (profile: OnboardingProfile) => void;

  /**
   * override the membership state, bypassing the network. useful for tests
   * and previews.
   */
  mockStatus?: MembershipStatus;

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
 * onboarding page shown immediately after signup. a newly-registered account
 * must complete this profile before continuing into the platform. on
 * submission the member enters the approval queue and sees what happens next —
 * they are not a community member until an admin approves them. RTL.
 */
export function OnboardingPage({
  redirectTo = `/`,
  onComplete,
  mockStatus,
  mockDomains,
  className,
  style,
}: OnboardingPageProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { status, loading, completeOnboarding } = useOnboarding(
    mockStatus !== undefined ? { mockStatus } : undefined
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleComplete = async (profile: OnboardingProfile) => {
    setSubmitting(true);
    setError(null);
    try {
      await completeOnboarding(profile);
      onComplete?.(profile);
    } catch (err) {
      setError(`לא הצלחנו לשמור את הפרטים. אפשר לנסות שוב.`);
    } finally {
      setSubmitting(false);
    }
  };

  const alreadySubmitted = !loading && status !== `none`;

  return (
    <div className={classNames(styles.onboardingPage, className)} style={style}>
      <div className={styles.inner}>
        {alreadySubmitted ? (
          <div className={styles.pendingCard}>
            <div className={styles.pendingIcon} aria-hidden>
              {status === `approved` ? `🎉` : `⏳`}
            </div>
            <h1 className={styles.pendingTitle}>
              {status === `approved` ? `ברוכים הבאים להלם קלאב` : `קיבלנו את הפרטים שלך`}
            </h1>
            <p className={styles.pendingText}>
              {status === `approved`
                ? `החברות שלך בקהילה מאושרת. אפשר להיכנס לארגז הכלים, להגיש כלים משלך ולהשתתף בפעילות.`
                : status === `rejected`
                  ? `הבקשה שלך נבדקה וכרגע לא אושרה. אם נראה לך שזו טעות, אפשר לפנות אלינו ונשמח לבדוק שוב.`
                  : `הבקשה שלך להצטרף לקהילה עברה לצוות הניהול. נעדכן אותך במייל ברגע שהיא תאושר — עד אז אפשר להסתובב באתר ולעיין בתכנים.`}
            </p>
            <button type="button" className={styles.pendingButton} onClick={() => navigate(redirectTo)}>
              לדף הבית
            </button>
          </div>
        ) : (
          <>
            {error && <div className={styles.error}>{error}</div>}
            <OnboardingWizard
              account={{ displayName: user?.displayName, email: user?.email }}
              onComplete={handleComplete}
              submitting={submitting}
              mockDomains={mockDomains}
            />
          </>
        )}
      </div>
    </div>
  );
}
