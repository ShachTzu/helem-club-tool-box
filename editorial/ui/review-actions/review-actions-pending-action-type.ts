/**
 * the review action kinds this component may perform on a draft.
 */
export type ReviewActionKind =
  | `submit`
  | `approve`
  | `requestChanges`
  | `reject`
  | `publish`;

/**
 * an action awaiting the reviewer's note in the confirmation modal.
 * only `requestChanges` and `reject` require a mandatory note.
 */
export type PendingReviewAction = {
  /**
   * the kind of review action pending confirmation.
   */
  kind: ReviewActionKind;

  /**
   * modal title shown while confirming the action.
   */
  title: string;

  /**
   * label of the confirm button.
   */
  confirmLabel: string;

  /**
   * whether a note is mandatory before the action can be confirmed.
   */
  requiresNote: boolean;
};
