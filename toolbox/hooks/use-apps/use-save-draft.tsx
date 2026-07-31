import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import type { SubmitAppOptions } from './use-submit-app.js';

/**
 * the minimal draft handle returned after an autosave — enough to resume the
 * draft by id.
 */
export type SavedDraft = { id: string; status: string };

/**
 * GraphQL mutation autosaving the current member's submission draft.
 */
export const SAVE_TOOLBOX_DRAFT_MUTATION = gql`
  mutation SaveToolboxDraft($options: SubmitToolboxAppOptions!, $id: String) {
    saveToolboxDraft(options: $options, id: $id) {
      id
      status
    }
  }
`;

/**
 * autosaves the current member's submission draft. pass the existing draft id to
 * update it, or omit to create a new one. the server owns and gates the record;
 * this returns only the saved draft's id + status.
 */
export function useSaveDraft() {
  const [saveDraftMutation, { loading, error }] = useMutation<
    { saveToolboxDraft: SavedDraft | null },
    { options: SubmitAppOptions; id?: string }
  >(SAVE_TOOLBOX_DRAFT_MUTATION);

  const saveDraft = async (
    options: SubmitAppOptions,
    id?: string
  ): Promise<SavedDraft | undefined> => {
    const result = await saveDraftMutation({ variables: { options, id } });
    return result.data?.saveToolboxDraft || undefined;
  };

  return { saveDraft, loading, error };
}
