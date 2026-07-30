import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

const DELETE_RECORD_MUTATION = gql`
  mutation DeleteRecord($id: String!) {
    deleteRecord(id: $id)
  }
`;

/**
 * deletes a media record from the knowledge base.
 */
export function useDeleteRecord() {
  const [mutate, results] = useMutation<{ deleteRecord: boolean | null }>(DELETE_RECORD_MUTATION);

  const deleteRecord = async (id: string) => {
    const result = await mutate({ variables: { id } });
    return Boolean(result.data?.deleteRecord);
  };

  return {
    deleteRecord,
    loading: results.loading,
    error: results.error,
  };
}
