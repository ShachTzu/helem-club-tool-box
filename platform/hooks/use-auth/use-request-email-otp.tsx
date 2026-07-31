import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation requesting a one-time-password to be sent to an email address.
 */
export const REQUEST_EMAIL_OTP_MUTATION = gql`
  mutation RequestEmailOtp($email: String!, $displayName: String) {
    requestEmailOtp(options: { email: $email, displayName: $displayName }) {
      sent
      reason
    }
  }
`;

type RequestEmailOtpData = {
  requestEmailOtp: {
    sent: boolean;
    reason?: string | null;
  } | null;
};

/**
 * the outcome of requesting a sign-in code.
 */
export type RequestOtpResult = {
  /**
   * whether a code was issued and sent.
   */
  sent: boolean;

  /**
   * a Hebrew, user-facing explanation when no code was sent — an invalid
   * address, or a throttled request. surface this to the member as-is.
   */
  reason?: string;
};

export type UseRequestEmailOtpValue = {
  /**
   * requests a one-time-password for the given email address. resolves with
   * whether the code was sent, and why not when it was not.
   */
  requestEmailOtp: (email: string, displayName?: string) => Promise<RequestOtpResult>;

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
 * triggers sending an email one-time-password to sign in or sign up a user.
 * the same code both signs an existing member in and creates an account for a
 * new one, so there is no separate registration call.
 */
export function useRequestEmailOtp(): UseRequestEmailOtpValue {
  const [mutate, { loading, error }] = useMutation<RequestEmailOtpData>(REQUEST_EMAIL_OTP_MUTATION);

  const requestEmailOtp = async (email: string, displayName?: string) => {
    const result = await mutate({ variables: { email, displayName } });
    const payload = result.data?.requestEmailOtp;
    return {
      sent: Boolean(payload?.sent),
      reason: payload?.reason || undefined,
    };
  };

  return { requestEmailOtp, loading, error };
}
