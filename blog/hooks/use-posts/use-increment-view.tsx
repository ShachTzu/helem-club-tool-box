import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation recording a view for a post from a given anonymous
 * device id, used to compute unique visitor counts.
 */
export const INCREMENT_VIEW_MUTATION = gql`
  mutation IncrementPostView($postId: ID!, $deviceId: String!) {
    incrementPostView(postId: $postId, deviceId: $deviceId)
  }
`;

type IncrementViewData = {
  incrementPostView: boolean | null;
};

export type UseIncrementViewValue = {
  /**
   * records a view for the given post id from the given device id.
   * resolves with whether the view was recorded.
   */
  incrementView: (postId: string, deviceId: string) => Promise<boolean>;

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
 * records a view of a post, keyed by an anonymous device id so unique
 * visitors can be tracked without requiring authentication.
 */
export function useIncrementView(): UseIncrementViewValue {
  const [mutate, { loading, error }] = useMutation<IncrementViewData>(INCREMENT_VIEW_MUTATION);

  const incrementView = async (postId: string, deviceId: string) => {
    const result = await mutate({ variables: { postId, deviceId } });
    return Boolean(result.data?.incrementPostView);
  };

  return { incrementView, loading, error };
}
