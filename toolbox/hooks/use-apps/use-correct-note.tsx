import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { App, type PlainApp } from '@helemclub/toolbox.entities.app';

/**
 * GraphQL mutation fixing the wording of a note already written on a decided
 * submission. the decision itself is never changed.
 */
export const CORRECT_MODERATION_NOTE_MUTATION = gql`
  mutation CorrectModerationNote($options: CorrectModerationNoteOptions!) {
    correctModerationNote(options: $options) {
      id
      slug
      name
      status
      moderatorNote
    }
  }
`;

export type CorrectNoteOptions = {
  /**
   * id of the already-decided app whose note is being corrected.
   */
  appId: string;

  /**
   * the corrected note. this is what the submitter sees from now on.
   */
  note: string;
};

/**
 * corrects a moderator note on a decided submission. intended for moderators
 * and admins fixing their own wording — the member sees only the corrected
 * text, while the team keeps both versions in the submission's history.
 */
export function useCorrectNote() {
  const [correctNoteMutation, { loading, error }] = useMutation<
    { correctModerationNote: PlainApp },
    { options: CorrectNoteOptions }
  >(CORRECT_MODERATION_NOTE_MUTATION);

  const correctNote = async (options: CorrectNoteOptions) => {
    const result = await correctNoteMutation({ variables: { options } });
    const corrected = result.data?.correctModerationNote;
    return corrected ? App.from(corrected) : undefined;
  };

  return {
    correctNote,
    loading,
    error,
  };
}
