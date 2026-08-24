import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { User, type PlainUser } from '@helemclub/platform.entities.user';

/**
 * GraphQL mutation verifying an email one-time-password and establishing a session.
 */
export const VERIFY_EMAIL_OTP_MUTATION = gql`
  mutation VerifyEmailOtp($email: String!, $code: String!) {
    verifyEmailOtp(options: { email: $email, code: $code }) {
      token
      user {
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
  }
`;

type VerifyEmailOtpData = {
  verifyEmailOtp: {
    token: string;
    user: PlainUser;
  } | null;
};

export type AuthSession = {
  user: User;
  token: string;
};

export type UseVerifyEmailOtpValue = {
  /**
   * verifies the one-time-password sent to the given email address. resolves
   * with the authenticated session, or undefined when verification failed.
   */
  verifyEmailOtp: (email: string, code: string) => Promise<AuthSession | undefined>;

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
 * verifies an email one-time-password and returns the resulting auth session.
 */
export function useVerifyEmailOtp(): UseVerifyEmailOtpValue {
  const [mutate, { loading, error }] = useMutation<VerifyEmailOtpData>(VERIFY_EMAIL_OTP_MUTATION);

  const verifyEmailOtp = async (email: string, code: string) => {
    const result = await mutate({ variables: { email, code } });
    const session = result.data?.verifyEmailOtp;
    return session ? { user: User.from(session.user), token: session.token } : undefined;
  };

  return { verifyEmailOtp, loading, error };
}
