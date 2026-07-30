import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation requesting a one-time-password to be sent to an email address.
 */
export const REQUEST_EMAIL_OTP_MUTATION = gql`
  mutation RequestEmailOtp($email: String!) {
    requestEmailOtp(options: { email: $email }) {
      sent
    }
  }
`;

type RequestEmailOtpData = {
  requestEmailOtp: {
    sent: boolean;
  } | null;
};

export type UseRequestEmailOtpValue = {
  /**
   * requests a one-time-password for the given email address. resolves with
   * whether the code was sent successfully.
   */
  requestEmailOtp: (email: string) => Promise<boolean>;

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
 */
export function useRequestEmailOtp(): UseRequestEmailOtpValue {
  const [mutate, { loading, error }] = useMutation<RequestEmailOtpData>(REQUEST_EMAIL_OTP_MUTATION);

  const requestEmailOtp = async (email: string) => {
    const result = await mutate({ variables: { email } });
    return Boolean(result.data?.requestEmailOtp?.sent);
  };

  return { requestEmailOtp, loading, error };
}
