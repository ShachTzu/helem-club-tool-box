import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const INCREMENT_VIEW_MUTATION = gql`
  mutation IncrementRecordView($recordId: String!) {
    incrementRecordView(recordId: $recordId)
  }
`;

/**
 * increments the view count of a media record, typically called
 * once playback of the record has started.
 */
export function useIncrementView() {
  const [mutate, results] = useMutation<{ incrementRecordView: boolean | null }>(INCREMENT_VIEW_MUTATION);

  const incrementView = async (recordId: string) => {
    const result = await mutate({ variables: { recordId } });
    return Boolean(result.data?.incrementRecordView);
  };

  return {
    incrementView,
    loading: results.loading,
    error: results.error,
  };
}
