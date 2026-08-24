import { useState } from 'react';
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import { Draft } from '@helemclub/editorial.entities.draft';
import { DRAFT_FIELDS_FRAGMENT, toDraft, type RawDraft } from './draft-fields.js';
import type { ReviewActionInput } from './review-action-input.js';

export const SUBMIT_FOR_REVIEW_MUTATION = gql`
  mutation SubmitForReview($options: ReviewOptions) {
    submitForReview(options: $options) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

export const REQUEST_CHANGES_MUTATION = gql`
  mutation RequestChanges($options: ReviewOptions) {
    requestChanges(options: $options) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

export const APPROVE_DRAFT_MUTATION = gql`
  mutation ApproveDraft($options: ReviewOptions) {
    approveDraft(options: $options) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

export const REJECT_DRAFT_MUTATION = gql`
  mutation RejectDraft($options: ReviewOptions) {
    rejectDraft(options: $options) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

export const PUBLISH_DRAFT_MUTATION = gql`
  mutation PublishDraft($draftId: ID) {
    publishDraft(draftId: $draftId) {
      ...DraftFields
    }
  }
  ${DRAFT_FIELDS_FRAGMENT}
`;

type SubmitForReviewData = { submitForReview: RawDraft | null };
type RequestChangesData = { requestChanges: RawDraft | null };
type ApproveDraftData = { approveDraft: RawDraft | null };
type RejectDraftData = { rejectDraft: RawDraft | null };
type PublishDraftData = { publishDraft: RawDraft | null };

export type UseReviewActionsValue = {
  /**
   * שולח טיוטה לביקורת. עובר ממצב 'draft' או 'changes_requested' ל-'in_review'.
   * מחזיר את הטיוטה המעודכנת, או undefined אם הפעולה נכשלה.
   */
  submitForReview: (input: ReviewActionInput) => Promise<Draft | undefined>;

  /**
   * מסמן שנדרשים תיקונים בטיוטה, עם הערת מנחה בעברית. מחזיר את הטיוטה
   * המעודכנת, או undefined אם הפעולה נכשלה.
   */
  requestChanges: (input: ReviewActionInput) => Promise<Draft | undefined>;

  /**
   * מאשר טיוטה לפרסום. מחזיר את הטיוטה המעודכנת, או undefined אם הפעולה נכשלה.
   */
  approveDraft: (input: ReviewActionInput) => Promise<Draft | undefined>;

  /**
   * דוחה טיוטה. מחזיר את הטיוטה המעודכנת, או undefined אם הפעולה נכשלה.
   */
  rejectDraft: (input: ReviewActionInput) => Promise<Draft | undefined>;

  /**
   * מפרסם טיוטה שאושרה. מחזיר את הטיוטה המעודכנת, או undefined אם הפעולה נכשלה.
   */
  publishDraft: (input: ReviewActionInput) => Promise<Draft | undefined>;

  /**
   * whether any one of the review actions is currently in flight.
   */
  acting: boolean;

  /**
   * הודעת שגיאה בעברית, אם אחת הפעולות נכשלה.
   */
  error?: string;
};

const GENERIC_ERROR_MESSAGE = 'אירעה שגיאה בביצוע הפעולה. נסו שוב מאוחר יותר.';

/**
 * exposes the editorial review actions performed on a draft: submitting it
 * for review, requesting changes, approving, rejecting and publishing it.
 * each action accepts the draft id and an optional Hebrew note, and returns
 * the updated Draft entity.
 */
export function useReviewActions(): UseReviewActionsValue {
  const [error, setError] = useState<string | undefined>(undefined);

  const [submitForReviewMutation, submitForReviewState] = useMutation<SubmitForReviewData>(
    SUBMIT_FOR_REVIEW_MUTATION
  );
  const [requestChangesMutation, requestChangesState] = useMutation<RequestChangesData>(
    REQUEST_CHANGES_MUTATION
  );
  const [approveDraftMutation, approveDraftState] = useMutation<ApproveDraftData>(APPROVE_DRAFT_MUTATION);
  const [rejectDraftMutation, rejectDraftState] = useMutation<RejectDraftData>(REJECT_DRAFT_MUTATION);
  const [publishDraftMutation, publishDraftState] = useMutation<PublishDraftData>(PUBLISH_DRAFT_MUTATION);

  const submitForReview = async ({ draftId, note }: ReviewActionInput) => {
    setError(undefined);
    try {
      const result = await submitForReviewMutation({ variables: { options: { draftId, note } } });
      const raw = result.data?.submitForReview;
      return raw ? toDraft(raw) : undefined;
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
      return undefined;
    }
  };

  const requestChanges = async ({ draftId, note }: ReviewActionInput) => {
    setError(undefined);
    try {
      const result = await requestChangesMutation({ variables: { options: { draftId, note } } });
      const raw = result.data?.requestChanges;
      return raw ? toDraft(raw) : undefined;
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
      return undefined;
    }
  };

  const approveDraft = async ({ draftId, note }: ReviewActionInput) => {
    setError(undefined);
    try {
      const result = await approveDraftMutation({ variables: { options: { draftId, note } } });
      const raw = result.data?.approveDraft;
      return raw ? toDraft(raw) : undefined;
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
      return undefined;
    }
  };

  const rejectDraft = async ({ draftId, note }: ReviewActionInput) => {
    setError(undefined);
    try {
      const result = await rejectDraftMutation({ variables: { options: { draftId, note } } });
      const raw = result.data?.rejectDraft;
      return raw ? toDraft(raw) : undefined;
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
      return undefined;
    }
  };

  const publishDraft = async ({ draftId }: ReviewActionInput) => {
    setError(undefined);
    try {
      const result = await publishDraftMutation({ variables: { draftId } });
      const raw = result.data?.publishDraft;
      return raw ? toDraft(raw) : undefined;
    } catch {
      setError(GENERIC_ERROR_MESSAGE);
      return undefined;
    }
  };

  const acting =
    submitForReviewState.loading ||
    requestChangesState.loading ||
    approveDraftState.loading ||
    rejectDraftState.loading ||
    publishDraftState.loading;

  return {
    submitForReview,
    requestChanges,
    approveDraft,
    rejectDraft,
    publishDraft,
    acting,
    error,
  };
}
