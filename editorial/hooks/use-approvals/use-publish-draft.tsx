import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Draft, type PlainDraft } from '@helemclub/editorial.entities.draft';
import { DRAFT_FIELDS_FRAGMENT } from './draft-fields.js';
import type { ReviewActionInput } from './review-action-input.js';

/**
 * GraphQL mutation publishing an approved draft.
 */
export const PUBLISH_DRAFT_MUTATION = gql`
  mutation PublishDraft($draftId: ID) {
    publishDraft(draftId: $draftId) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

type PublishDraftData = {
  publishDraft: PlainDraft | null;
};

export type UsePublishDraftValue = {
  /**
   * publishes an approved draft. resolves with the updated draft, or
   * undefined when the mutation failed.
   */
  publishDraft: (input: ReviewActionInput) => Promise<Draft | undefined>;

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
 * publishes an approved draft, making its content publicly visible. the
 * publish mutation does not accept a note — only the draft id is sent.
 */
export function usePublishDraft(): UsePublishDraftValue {
  const [mutate, { loading, error }] = useMutation<PublishDraftData>(PUBLISH_DRAFT_MUTATION);

  const publishDraft = async ({ draftId }: ReviewActionInput) => {
    const result = await mutate({ variables: { draftId } });
    const draft = result.data?.publishDraft;
    return draft ? Draft.from(draft) : undefined;
  };

  return { publishDraft, loading, error };
}
