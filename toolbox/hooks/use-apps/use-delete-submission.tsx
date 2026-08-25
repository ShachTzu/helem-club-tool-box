import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

/**
 * GraphQL mutation carrying out a member's deletion request on their own
 * submission. both modes are irreversible.
 */
export const DELETE_MY_SUBMISSION_MUTATION = gql`
  mutation DeleteMySubmission($options: DeleteMySubmissionOptions!) {
    deleteMySubmission(options: $options)
  }
`;

/**
 * how much of a submission to remove.
 * 'personal_data' — the member's details and everything written about them
 * go; the tool stays in the catalog with nothing tying it to them.
 * 'everything' — the submission itself goes too.
 */
export type DeletionMode = 'personal_data' | 'everything';

export type DeleteSubmissionOptions = {
  /**
   * id of the member's own submission being cleared.
   */
  appId: string;

  /**
   * how much to remove.
   */
  mode: DeletionMode;
};

/**
 * carries out a member's own deletion request. the server enforces that the
 * submission belongs to them, so this can never touch anyone else's.
 */
export function useDeleteSubmission() {
  const [deleteSubmissionMutation, { loading, error }] = useMutation<
    { deleteMySubmission: boolean },
    { options: DeleteSubmissionOptions }
  >(DELETE_MY_SUBMISSION_MUTATION);

  const deleteSubmission = async (options: DeleteSubmissionOptions) => {
    const result = await deleteSubmissionMutation({ variables: { options } });
    return Boolean(result.data?.deleteMySubmission);
  };

  return {
    deleteSubmission,
    loading,
    error,
  };
}
