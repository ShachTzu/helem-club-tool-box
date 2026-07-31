import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';

/**
 * GraphQL query fetching the public authentication configuration.
 */
export const AUTH_CONFIG_QUERY = gql`
  query AuthConfig {
    authConfig {
      googleClientId
      emailSignInEnabled
    }
  }
`;

type AuthConfigData = {
  authConfig: {
    googleClientId: string | null;
    emailSignInEnabled: boolean | null;
  } | null;
};

export type UseAuthConfigValue = {
  /**
   * the Google OAuth client id, or undefined when Google sign-in is not
   * configured on the server. the sign-in UI hides the Google button when
   * this is absent rather than showing a button that cannot work.
   */
  googleClientId?: string;

  /**
   * whether members can sign in with an emailed one-time code.
   */
  emailSignInEnabled: boolean;

  /**
   * whether the configuration is still loading.
   */
  loading: boolean;
};

/**
 * fetches the public, non-secret auth configuration from the server.
 *
 * the Google client id is served at runtime rather than compiled into the
 * bundle, so the same build runs against staging and production without a
 * rebuild, and rotating the id does not require one either.
 */
export function useAuthConfig(): UseAuthConfigValue {
  // a failure here must never block sign-in: the page simply falls back to
  // email-only, so the error is tolerated rather than thrown.
  const { data, loading } = useQuery<AuthConfigData>(AUTH_CONFIG_QUERY, {
    errorPolicy: 'all',
  });

  return {
    googleClientId: data?.authConfig?.googleClientId || undefined,
    emailSignInEnabled: data?.authConfig?.emailSignInEnabled !== false,
    loading,
  };
}
