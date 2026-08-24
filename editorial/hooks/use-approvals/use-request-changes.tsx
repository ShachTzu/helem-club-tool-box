import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Draft, type PlainDraft } from '@helemclub/editorial.entities.draft';
import { DRAFT_FIELDS_FRAGMENT } from './draft-fields.js';
import type { ReviewActionInput } from './review-action-input.js';

/**
 * GraphQL mutation requesting changes on a draft under review.
 */
export const REQUEST_CHANGES_MUTATION = gql`
  mutation RequestChanges($draftId: ID, $note: String) {
    requestChanges(options: { draftId: $draftId, note: $note }) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

type RequestChangesData = {
  requestChanges: PlainDraft | null;
};

export type UseRequestChangesValue = {
  /**
   * requests changes on a draft, sending it back to its author with a note.
   * resolves with the updated draft, or undefined when the mutation failed.
   */
  requestChanges: (input: ReviewActionInput) => Promise<Draft | undefined>;

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
 * sends a draft under review back to its author, with a note explaining
 * what needs to change before it can be approved.
 */
export function useRequestChanges(): UseRequestChangesValue {
  const [mutate, { loading, error }] = useMutation<RequestChangesData>(REQUEST_CHANGES_MUTATION);

  const requestChanges = async ({ draftId, note }: ReviewActionInput) => {
    const result = await mutate({ variables: { draftId, note } });
    const draft = result.data?.requestChanges;
    return draft ? Draft.from(draft) : undefined;
  };

  return { requestChanges, loading, error };
}
