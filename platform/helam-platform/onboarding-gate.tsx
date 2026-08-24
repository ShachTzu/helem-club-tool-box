import React, { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@helemclub/platform.hooks.use-auth';

export type OnboardingGateProps = {
  /**
   * the content rendered once the authenticated user has completed onboarding.
   */
  children?: ReactNode;

  /**
   * where to send authenticated users that have not completed onboarding yet.
   */
  onboardingPath?: string;
};

/**
 * gates authenticated users through the mandatory onboarding flow. while the
 * auth state resolves, or when the visitor is signed out, it renders the
 * children untouched (sign-in gating is handled by ProtectedRoute). once a
 * signed-in user is detected that has not yet completed onboarding — per the
 * `onboardingCompleted` flag persisted on their account — they are redirected
 * to the onboarding page. RTL.
 */
export function OnboardingGate({ children, onboardingPath = `/onboarding` }: OnboardingGateProps) {
  const location = useLocation();
  const { user, loading } = useAuth();

  const needsOnboarding = !loading && Boolean(user) && !user?.onboardingCompleted;
  const alreadyThere = location.pathname === onboardingPath;

  if (needsOnboarding && !alreadyThere) {
    return <Navigate to={onboardingPath} replace />;
  }

  return <>{children}</>;
}
