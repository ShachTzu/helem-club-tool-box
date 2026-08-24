import { useCallback, useEffect, useRef } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Draft, type PlainDraft } from '@helemclub/editorial.entities.draft';
import type { SaveDraftInput } from './draft-options.js';

export type { SaveDraftInput } from './draft-options.js';

/**
 * GraphQL mutation creating or updating a draft.
 */
export const SAVE_DRAFT_MUTATION = gql`
  mutation SaveDraft($options: SaveDraftOptions) {
    saveDraft(options: $options) {
      id
      contentType
      contentRef
      title
      payload
      domains
      status
      authorId
      authorName
      currentVersion
      createdAt
      updatedAt
      submittedAt
      publishedAt
      lastReviewerId
      lastReviewNote
    }
  }
`;

type SaveDraftData = {
  saveDraft: PlainDraft | null;
};

/**
 * the default delay, in milliseconds, between the last edit and the
 * autosave request being sent.
 */
const DEFAULT_AUTOSAVE_DELAY_MS = 1200;

export type UseSaveDraftValue = {
  /**
   * saves the draft immediately, creating it when no id is provided.
   * resolves with the saved draft, or undefined when the save failed.
   */
  saveDraft: (input: SaveDraftInput) => Promise<Draft | undefined>;

  /**
   * schedules a debounced autosave of the draft. repeated calls within the
   * debounce window reset the timer, so only the latest content is sent.
   * an optional changeSummary is recorded on the resulting revision.
   */
  scheduleAutosave: (input: SaveDraftInput, debounceMs?: number) => void;

  /**
   * cancels a pending autosave scheduled by `scheduleAutosave`, if any.
   */
  cancelAutosave: () => void;

  /**
   * whether a save (immediate or autosave) is currently in flight.
   */
  saving: boolean;

  /**
   * a Hebrew, user-facing error message, when the last save failed.
   */
  error?: string;
};

/**
 * creates or updates a draft, with support for debounced autosave.
 *
 * `saveDraft` persists changes immediately, while `scheduleAutosave` waits
 * for a pause in editing before sending the request, so frequent keystrokes
 * do not each trigger a network call. both accept an optional
 * changeSummary, recorded on the resulting revision.
 */
export function useSaveDraft(): UseSaveDraftValue {
  const [mutate, { loading, error }] = useMutation<SaveDraftData>(SAVE_DRAFT_MUTATION, {
    errorPolicy: 'all',
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const saveDraft = useCallback(
    async (input: SaveDraftInput) => {
      const result = await mutate({ variables: { options: input } });
      const saved = result.data?.saveDraft;
      return saved ? Draft.from(saved) : undefined;
    },
    [mutate]
  );

  const scheduleAutosave = useCallback(
    (input: SaveDraftInput, debounceMs: number = DEFAULT_AUTOSAVE_DELAY_MS) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        saveDraft(input);
      }, debounceMs);
    },
    [saveDraft]
  );

  const cancelAutosave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  return {
    saveDraft,
    scheduleAutosave,
    cancelAutosave,
    saving: loading,
    error: error ? 'אירעה שגיאה בשמירת הטיוטה' : undefined,
  };
}
