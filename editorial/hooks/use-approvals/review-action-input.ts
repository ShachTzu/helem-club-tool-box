/**
 * input shared by every review action: submitting for review, requesting
 * changes, approving, rejecting and publishing a draft.
 */
export type ReviewActionInput = {
  /**
   * id of the draft to act on.
   */
  draftId: string;

  /**
   * optional note, written in Hebrew, explaining the decision.
   */
  note?: string;
};
