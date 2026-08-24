import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export type RestoreRevisionInput = {
  /**
   * id of the draft whose revision is being restored.
   */
  draftId: string;

  /**
   * version number of the revision to restore.
   */
  versionNumber: number;
};

export type RestoredDraft = {
  id: string;
  title: string;
  currentVersion: number;
  updatedAt: string;
};

export type UseRestoreRevisionResult = {
  /**
   * restores a past revision of a draft. restoring never rewrites history —
   * it creates a brand new revision on top of the draft with the restored
   * payload.
   */
  restoreRevision: (input: RestoreRevisionInput) => Promise<RestoredDraft | undefined>;

  /**
   * whether the restore mutation is currently in flight.
   */
  restoring: boolean;

  /**
   * error message, if the mutation failed.
   */
  error?: string;
};

type RestoreRevisionMutationResult = {
  restoreRevision: RestoredDraft | null;
};

export const RESTORE_REVISION_MUTATION = gql`
  mutation RestoreRevision($options: RestoreRevisionOptions) {
    restoreRevision(options: $options) {
      id
      title
      currentVersion
      updatedAt
    }
  }
`;

/**
 * restores a past revision of a draft, creating a brand new revision on top
 * of the draft's history rather than modifying or removing existing
 * revisions.
 */
export function useRestoreRevision(): UseRestoreRevisionResult {
  const [restoreRevisionMutation, { loading, error }] =
    useMutation<RestoreRevisionMutationResult>(RESTORE_REVISION_MUTATION);

  async function restoreRevision(input: RestoreRevisionInput) {
    const result = await restoreRevisionMutation({
      variables: { options: { draftId: input.draftId, versionNumber: input.versionNumber } },
    });

    return result.data?.restoreRevision ?? undefined;
  }

  return {
    restoreRevision,
    restoring: loading,
    error: error?.message,
  };
}
