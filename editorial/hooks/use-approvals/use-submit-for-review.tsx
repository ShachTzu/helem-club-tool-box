import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Draft, type PlainDraft } from '@helemclub/editorial.entities.draft';
import { DRAFT_FIELDS_FRAGMENT } from './draft-fields.js';
import type { ReviewActionInput } from './review-action-input.js';

/**
 * GraphQL mutation submitting a draft for editorial review.
 */
export const SUBMIT_FOR_REVIEW_MUTATION = gql`
  mutation SubmitForReview($draftId: ID, $note: String) {
    submitForReview(options: { draftId: $draftId, note: $note }) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

type SubmitForReviewData = {
  submitForReview: PlainDraft | null;
};

export type UseSubmitForReviewValue = {
  /**
   * submits a draft for editorial review. resolves with the updated draft,
   * or undefined when the mutation failed.
   */
  submitForReview: (input: ReviewActionInput) => Promise<Draft | undefined>;

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
 * sends a draft into the review queue, so a moderator can decide whether to
 * request changes or approve it.
 */
export function useSubmitForReview(): UseSubmitForReviewValue {
  const [mutate, { loading, error }] = useMutation<SubmitForReviewData>(SUBMIT_FOR_REVIEW_MUTATION);

  const submitForReview = async ({ draftId, note }: ReviewActionInput) => {
    const result = await mutate({ variables: { draftId, note } });
    const draft = result.data?.submitForReview;
    return draft ? Draft.from(draft) : undefined;
  };

  return { submitForReview, loading, error };
}
