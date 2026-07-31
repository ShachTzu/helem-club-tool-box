import { useCallback } from 'react';
import { User, type PlainUser } from '@helemclub/platform.entities.user';
import { useCurrentUser } from './use-current-user.js';
import { useRequestEmailOtp, type RequestOtpResult } from './use-request-email-otp.js';
import { useAuthConfig } from './use-auth-config.js';
import { useVerifyEmailOtp, type AuthSession } from './use-verify-email-otp.js';
import { useSignInWithGoogle } from './use-sign-in-with-google.js';
import { useSignOut } from './use-sign-out.js';

export type { AuthSession } from './use-verify-email-otp.js';
export type { RequestOtpResult } from './use-request-email-otp.js';

export type UseAuthOptions = {
  /**
   * provide mock data for the current user to bypass the GraphQL query,
   * useful for tests and previews. pass null to simulate a signed-out state.
   */
  mockData?: PlainUser | null;
};

export type UseAuthValue = {
  /**
   * the currently authenticated user, or null when no one is signed in.
   */
  user: User | null;

  /**
   * whether the current user is still being resolved.
   */
  loading: boolean;

  /**
   * error raised while resolving the current user, if any.
   */
  error?: Error;

  /**
   * requests a one-time-password to be sent to the given email address.
   * resolves with whether the code was sent, and a Hebrew reason when it was
   * not — an invalid address, or a throttled request. an optional display
   * name is captured for accounts created on first verification.
   */
  requestEmailOtp: (email: string, displayName?: string) => Promise<RequestOtpResult>;

  /**
   * verifies a one-time-password sent to an email address and signs the user in.
   * resolves with the authenticated session, or undefined when verification failed.
   */
  verifyEmailOtp: (email: string, code: string) => Promise<AuthSession | undefined>;

  /**
   * signs in with a Google ID token. resolves with the authenticated
   * session, or undefined when sign-in failed.
   */
  signInWithGoogle: (idToken: string) => Promise<AuthSession | undefined>;

  /**
   * signs the current user out of the platform.
   */
  signOut: () => Promise<void>;

  /**
   * the Google OAuth client id served by the platform, or undefined when
   * Google sign-in is not configured. sign-in pages hide the Google button
   * when this is absent.
   */
  googleClientId?: string;

  /**
   * whether the current user holds the admin role.
   */
  isAdmin: boolean;

  /**
   * whether the current user holds at least the moderator role.
   */
  isModerator: boolean;

  /**
   * whether the current user holds at least the writer role, and is
   * therefore allowed to create or edit content.
   */
  canWrite: boolean;
};

/**
 * manages platform authentication state and actions. exposes the currently
 * signed-in user (or null), loading state, email one-time-password flows,
 * Google sign-in, sign-out, and role helpers derived from the user's role.
 * never returns a hardcoded default user; the user is null until resolved
 * from the server or provided via mock data.
 */
export function useAuth(options?: UseAuthOptions): UseAuthValue {
  const { user, loading, error, refetch } = useCurrentUser(options);
  const { requestEmailOtp } = useRequestEmailOtp();
  const { verifyEmailOtp: verifyEmailOtpMutation } = useVerifyEmailOtp();
  const { signInWithGoogle: signInWithGoogleMutation } = useSignInWithGoogle();
  const { signOut: signOutMutation } = useSignOut();
  const { googleClientId } = useAuthConfig();

  const verifyEmailOtp = useCallback(
    async (email: string, code: string) => {
      const session = await verifyEmailOtpMutation(email, code);
      if (session) {
        await refetch();
      }
      return session;
    },
    [verifyEmailOtpMutation, refetch]
  );

  const signInWithGoogle = useCallback(
    async (idToken: string) => {
      const session = await signInWithGoogleMutation(idToken);
      if (session) {
        await refetch();
      }
      return session;
    },
    [signInWithGoogleMutation, refetch]
  );

  const signOut = useCallback(async () => {
    await signOutMutation();
    await refetch();
  }, [signOutMutation, refetch]);

  const isAdmin = Boolean(user?.isAtLeast('admin'));
  const isModerator = Boolean(user?.isAtLeast('moderator'));
  const canWrite = Boolean(user?.isAtLeast('writer'));

  return {
    user,
    loading,
    error,
    requestEmailOtp,
    verifyEmailOtp,
    signInWithGoogle,
    signOut,
    googleClientId,
    isAdmin,
    isModerator,
    canWrite,
  };
}
