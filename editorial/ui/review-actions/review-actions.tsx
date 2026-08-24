import React, { useState } from 'react';
import classNames from 'classnames';
import { type PlainDraft, type Draft } from '@helemclub/editorial.entities.draft';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import { useReviewActions, canReview, canPublish } from '@helemclub/editorial.hooks.use-approvals';
import {
  ReviewIcon,
  ApproveIcon,
  ChangesRequestedIcon,
  RejectIcon,
  PublishIcon,
} from '@helemclub/editorial.icons.library-icons';
import { Button } from '@helemclub/design.actions.button';
import { Modal } from '@helemclub/design.overlays.modal';
import { Textarea } from '@helemclub/design.inputs.textarea';
import type { ReviewActionsUser } from './review-actions-user-type.js';
import type { PendingReviewAction } from './review-actions-pending-action-type.js';
import styles from './review-actions.module.scss';

export type ReviewActionsProps = {
  /**
   * the draft to render role- and status-aware review actions for.
   */
  draft: PlainDraft;

  /**
   * called with the updated draft after a review action completes successfully.
   */
  onDone?: (updatedDraft: Draft) => void;

  /**
   * provide mock user data to bypass the authentication query, useful for
   * tests and previews. pass null to simulate a signed-out state.
   */
  mockUser?: ReviewActionsUser | null;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

const REQUEST_CHANGES_ACTION: PendingReviewAction = {
  kind: `requestChanges`,
  title: `בקשת תיקונים`,
  confirmLabel: `שליחת הבקשה`,
  requiresNote: true,
};

const REJECT_ACTION: PendingReviewAction = {
  kind: `reject`,
  title: `דחיית הטיוטה`,
  confirmLabel: `דחייה`,
  requiresNote: true,
};

/**
 * a role-aware and status-aware row of editorial review actions, RTL.
 * only shows the actions the signed-in user is allowed to perform on the
 * given draft, given its current status. actions that require a reason
 * ("בקש תיקונים", "דחה") open a modal with a mandatory Hebrew note.
 */
export function ReviewActions({ draft, onDone, mockUser, className, style }: ReviewActionsProps) {
  const authOptions = mockUser !== undefined ? { mockData: mockUser } : undefined;
  const { user, loading: authLoading, canWrite } = useAuth(authOptions);
  const { submitForReview, requestChanges, approveDraft, rejectDraft, publishDraft, acting, error } =
    useReviewActions();

  const [pendingAction, setPendingAction] = useState<PendingReviewAction | null>(null);
  const [note, setNote] = useState(``);
  const [noteError, setNoteError] = useState<string | undefined>(undefined);

  const isAuthor = Boolean(user && user.id === draft.authorId);
  const canSubmit =
    isAuthor && canWrite && (draft.status === `draft` || draft.status === `changes_requested`);
  const canReviewDraft = canReview(user) && draft.status === `in_review`;
  const canPublishDraft = canPublish(user) && draft.status === `approved`;
  const hasAnyAction = canSubmit || canReviewDraft || canPublishDraft;

  const openPendingAction = (action: PendingReviewAction) => {
    setPendingAction(action);
    setNote(``);
    setNoteError(undefined);
  };

  const closePendingAction = () => {
    setPendingAction(null);
    setNote(``);
    setNoteError(undefined);
  };

  const handleSubmit = async () => {
    const updated = await submitForReview({ draftId: draft.id });
    if (updated) onDone?.(updated);
  };

  const handleApprove = async () => {
    const updated = await approveDraft({ draftId: draft.id });
    if (updated) onDone?.(updated);
  };

  const handlePublish = async () => {
    const updated = await publishDraft({ draftId: draft.id });
    if (updated) onDone?.(updated);
  };

  const handleConfirmPendingAction = async () => {
    if (!pendingAction) return;

    const trimmedNote = note.trim();
    if (pendingAction.requiresNote && !trimmedNote) {
      setNoteError(`יש להזין נימוק לפני האישור`);
      return;
    }

    const updated =
      pendingAction.kind === `requestChanges`
        ? await requestChanges({ draftId: draft.id, note: trimmedNote })
        : await rejectDraft({ draftId: draft.id, note: trimmedNote });

    if (updated) {
      onDone?.(updated);
      closePendingAction();
    }
  };

  if (authLoading) {
    return (
      <div className={classNames(styles.reviewActions, className)} style={style}>
        <span className={styles.statusMessage}>בודקים הרשאות...</span>
      </div>
    );
  }

  if (!hasAnyAction) {
    return (
      <div className={classNames(styles.reviewActions, className)} style={style}>
        <span className={styles.statusMessage}>אין פעולות עריכה זמינות עבורך עבור הטיוטה במצבה הנוכחי.</span>
      </div>
    );
  }

  return (
    <div className={classNames(styles.reviewActions, className)} style={style}>
      <div className={styles.actionsRow}>
        {canSubmit && (
          <Button
            variant="primary"
            size="md"
            loading={acting}
            leadingIcon={<ReviewIcon size="small" color="inverse" />}
            onClick={() => handleSubmit()}
          >
            שלח לביקורת
          </Button>
        )}
        {canReviewDraft && (
          <>
            <Button
              variant="primary"
              size="md"
              loading={acting}
              leadingIcon={<ApproveIcon size="small" color="inverse" />}
              onClick={() => handleApprove()}
            >
              אשר
            </Button>
            <Button
              variant="secondary"
              size="md"
              disabled={acting}
              leadingIcon={<ChangesRequestedIcon size="small" color="secondary" />}
              onClick={() => openPendingAction(REQUEST_CHANGES_ACTION)}
            >
              בקש תיקונים
            </Button>
            <Button
              variant="danger"
              size="md"
              disabled={acting}
              leadingIcon={<RejectIcon size="small" color="inverse" />}
              onClick={() => openPendingAction(REJECT_ACTION)}
            >
              דחה
            </Button>
          </>
        )}
        {canPublishDraft && (
          <Button
            variant="accent"
            size="md"
            loading={acting}
            leadingIcon={<PublishIcon size="small" color="primary" />}
            onClick={() => handlePublish()}
          >
            פרסם
          </Button>
        )}
      </div>
      {error && <p className={styles.errorMessage}>{error}</p>}

      <Modal
        open={Boolean(pendingAction)}
        onClose={() => closePendingAction()}
        title={pendingAction?.title}
        size="small"
        footer={
          <div className={styles.modalFooter}>
            <Button variant="ghost" size="sm" disabled={acting} onClick={() => closePendingAction()}>
              ביטול
            </Button>
            <Button
              variant={pendingAction?.kind === `reject` ? `danger` : `primary`}
              size="sm"
              loading={acting}
              onClick={() => handleConfirmPendingAction()}
            >
              {pendingAction?.confirmLabel || `אישור`}
            </Button>
          </div>
        }
      >
        <div className={styles.modalBody}>
          <p className={styles.modalHelper}>נא לפרט את הסיבה — ההערה תישלח לכותב/ת הטיוטה.</p>
          <Textarea
            label="נימוק"
            required
            value={note}
            onChange={(nextValue) => {
              setNote(nextValue);
              if (noteError) setNoteError(undefined);
            }}
            error={noteError}
            placeholder="לדוגמה: יש להוסיף מקורות ולקצר את הפתיחה..."
            minRows={4}
          />
        </div>
      </Modal>
    </div>
  );
}
