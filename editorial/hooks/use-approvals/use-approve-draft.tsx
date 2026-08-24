import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Draft, type PlainDraft } from '@helemclub/editorial.entities.draft';
import { DRAFT_FIELDS_FRAGMENT } from './draft-fields.js';
import type { ReviewActionInput } from './review-action-input.js';

/**
 * GraphQL mutation approving a draft under review.
 */
export const APPROVE_DRAFT_MUTATION = gql`
  mutation ApproveDraft($draftId: ID, $note: String) {
    approveDraft(options: { draftId: $draftId, note: $note }) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

type ApproveDraftData = {
  approveDraft: PlainDraft | null;
};

export type UseApproveDraftValue = {
  /**
   * approves a draft under review. resolves with the updated draft, or
   * undefined when the mutation failed.
   */
  approveDraft: (input: ReviewActionInput) => Promise<Draft | undefined>;

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
 * approves a draft, moving it into the approved status and ready to be
 * published.
 */
export function useApproveDraft(): UseApproveDraftValue {
  const [mutate, { loading, error }] = useMutation<ApproveDraftData>(APPROVE_DRAFT_MUTATION);

  const approveDraft = async ({ draftId, note }: ReviewActionInput) => {
    const result = await mutate({ variables: { draftId, note } });
    const draft = result.data?.approveDraft;
    return draft ? Draft.from(draft) : undefined;
  };

  return { approveDraft, loading, error };
}
