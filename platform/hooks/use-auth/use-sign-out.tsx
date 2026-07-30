import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation ending the current platform authentication session.
 */
export const SIGN_OUT_MUTATION = gql`
  mutation SignOut {
    signOut
  }
`;

type SignOutData = {
  signOut: boolean | null;
};

export type UseSignOutValue = {
  /**
   * ends the current authentication session. resolves with whether the
   * server confirmed the sign-out.
   */
  signOut: () => Promise<boolean>;

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
 * signs the current user out of the platform.
 */
export function useSignOut(): UseSignOutValue {
  const [mutate, { loading, error }] = useMutation<SignOutData>(SIGN_OUT_MUTATION);

  const signOut = async () => {
    const result = await mutate();
    return Boolean(result.data?.signOut);
  };

  return { signOut, loading, error };
}
