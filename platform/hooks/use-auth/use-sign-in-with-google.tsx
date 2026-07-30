import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { User, type PlainUser } from '@helemclub/platform.entities.user';
import type { AuthSession } from './use-verify-email-otp.js';

/**
 * GraphQL mutation exchanging a Google ID token for a platform auth session.
 */
export const SIGN_IN_WITH_GOOGLE_MUTATION = gql`
  mutation SignInWithGoogle($idToken: String!) {
    signInWithGoogle(options: { idToken: $idToken }) {
      token
      user {
        id
        email
        displayName
        avatarUrl
        role
        provider
        createdAt
      }
    }
  }
`;

type SignInWithGoogleData = {
  signInWithGoogle: {
    token: string;
    user: PlainUser;
  } | null;
};

export type UseSignInWithGoogleValue = {
  /**
   * signs in with a Google ID token. resolves with the authenticated
   * session, or undefined when sign-in failed.
   */
  signInWithGoogle: (idToken: string) => Promise<AuthSession | undefined>;

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
 * exchanges a Google ID token for a platform authentication session.
 */
export function useSignInWithGoogle(): UseSignInWithGoogleValue {
  const [mutate, { loading, error }] = useMutation<SignInWithGoogleData>(SIGN_IN_WITH_GOOGLE_MUTATION);

  const signInWithGoogle = async (idToken: string) => {
    const result = await mutate({ variables: { idToken } });
    const session = result.data?.signInWithGoogle;
    return session ? { user: User.from(session.user), token: session.token } : undefined;
  };

  return { signInWithGoogle, loading, error };
}
