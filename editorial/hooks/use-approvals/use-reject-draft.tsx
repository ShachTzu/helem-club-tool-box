import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Draft, type PlainDraft } from '@helemclub/editorial.entities.draft';
import { DRAFT_FIELDS_FRAGMENT } from './draft-fields.js';
import type { ReviewActionInput } from './review-action-input.js';

/**
 * GraphQL mutation rejecting a draft under review.
 */
export const REJECT_DRAFT_MUTATION = gql`
  mutation RejectDraft($draftId: ID, $note: String) {
    rejectDraft(options: { draftId: $draftId, note: $note }) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

type RejectDraftData = {
  rejectDraft: PlainDraft | null;
};

export type UseRejectDraftValue = {
  /**
   * rejects a draft under review. resolves with the updated draft, or
   * undefined when the mutation failed.
   */
  rejectDraft: (input: ReviewActionInput) => Promise<Draft | undefined>;

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
 * rejects a draft, archiving it and closing the editorial flow.
 */
export function useRejectDraft(): UseRejectDraftValue {
  const [mutate, { loading, error }] = useMutation<RejectDraftData>(REJECT_DRAFT_MUTATION);

  const rejectDraft = async ({ draftId, note }: ReviewActionInput) => {
    const result = await mutate({ variables: { draftId, note } });
    const draft = result.data?.rejectDraft;
    return draft ? Draft.from(draft) : undefined;
  };

  return { rejectDraft, loading, error };
}
