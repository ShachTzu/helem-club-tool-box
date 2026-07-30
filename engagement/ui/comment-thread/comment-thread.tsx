import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { Avatar } from '@helemclub/design.content.avatar';
import { Badge } from '@helemclub/design.content.badge';
import { Textarea } from '@helemclub/design.inputs.textarea';
import { useComments, useListComments } from '@helemclub/engagement.hooks.use-comments';
import type { UseCommentsOptions } from '@helemclub/engagement.hooks.use-comments';
import type { PlainComment, Comment } from '@helemclub/engagement.entities.comment';
import { FlagIcon } from './flag-icon.js';
import { LockIcon } from './lock-icon.js';
import { formatRelativeTime } from './format-relative-time.js';
import styles from './comment-thread.module.scss';

export type CommentThreadProps = {
  /**
   * the type of content this thread is attached to (e.g. 'app', 'blog', 'domain').
   */
  targetType?: string;

  /**
   * the id of the content this thread is attached to.
   */
  targetId?: string;

  /**
   * a human readable label of the content, used in microcopy (e.g. "הכתבה").
   */
  parentLabel?: string;

  /**
   * destination url for the "join the community" call to action shown to
   * anonymous viewers on members-only comments.
   */
  joinUrl?: string;

  /**
   * provide mock comments to bypass the GraphQL query, useful for tests and previews.
   */
  mockComments?: PlainComment[];

  /**
   * provide mock data for the current user, useful for tests and previews.
   * pass null to simulate a signed-out viewer.
   */
  mockUser?: UseCommentsOptions['mockUser'];

  /**
   * override the generated/persisted device id, useful for tests and previews.
   */
  mockDeviceId?: string;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

type ThreadEntry =
  | { kind: `comment`; comment: Comment }
  | { kind: `gated`; comment: Comment };

/**
 * a threaded comment display bound to a content object: lists comments
 * (excluding moderated ones), gates members-only comments behind a join
 * placeholder for anonymous viewers, and provides an add-comment form with
 * a prominent anonymous toggle and a members-only toggle for signed-in
 * members. every comment carries a report button.
 */
export function CommentThread({
  targetType = `app`,
  targetId = `meditation-timer`,
  parentLabel = `התוכן הזה`,
  joinUrl = `/join`,
  mockComments,
  mockUser,
  mockDeviceId,
  className,
  style,
}: CommentThreadProps) {
  const [text, setText] = useState(``);
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [membersOnly, setMembersOnly] = useState(false);
  const [reportedIds, setReportedIds] = useState<string[]>([]);

  const commentsOptions: UseCommentsOptions = {};
  if (mockComments !== undefined) commentsOptions.mockComments = mockComments;
  if (mockUser !== undefined) commentsOptions.mockUser = mockUser;
  if (mockDeviceId !== undefined) commentsOptions.mockDeviceId = mockDeviceId;

  const {
    isMember,
    addComment,
    addingComment,
    reportComment,
    reportingComment,
    loading,
    error,
  } = useComments(targetType, targetId, commentsOptions);

  const { comments: rawComments } = useListComments(targetType, targetId, {
    mockData: mockComments,
  });

  const forcedAnonymous = !isMember;
  const effectiveAnonymous = forcedAnonymous || postAnonymously;

  const entries = useMemo<ThreadEntry[]>(() => {
    const visible = rawComments.filter((comment) => !comment.hidden);
    const sorted = [...visible].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return sorted.map((comment) => {
      if (comment.membersOnly && !isMember) return { kind: `gated`, comment };
      return { kind: `comment`, comment };
    });
  }, [rawComments, isMember]);

  const commentCount = entries.length;

  const handleSubmit = async () => {
    if (!text.trim()) return;
    const created = await addComment({
      text: text.trim(),
      isAnonymous: effectiveAnonymous,
      membersOnly: isMember && membersOnly,
    });
    if (created) {
      setText(``);
      setMembersOnly(false);
    }
  };

  const handleReport = async (commentId: string) => {
    setReportedIds((prev) => [...prev, commentId]);
    const hidden = await reportComment(commentId);
    return hidden;
  };

  return (
    <section className={classNames(styles.commentThread, className)} style={style}>
      <h2 className={styles.heading}>תגובות ({commentCount})</h2>

      <div className={styles.composer}>
        <Textarea
          label="הוספת תגובה"
          value={text}
          onChange={(nextValue) => setText(nextValue)}
          placeholder={`מה עלה לך מ${parentLabel}? כתבו בעדינות ובכבוד...`}
          maxLength={800}
          minRows={3}
          maxRows={8}
        />

        <div className={styles.composerControls}>
          <button
            type="button"
            onClick={() => !forcedAnonymous && setPostAnonymously((prev) => !prev)}
            className={classNames(styles.anonymousToggle, {
              [styles.anonymousToggleActive]: effectiveAnonymous,
              [styles.anonymousToggleDisabled]: forcedAnonymous,
            })}
            aria-pressed={effectiveAnonymous}
            disabled={forcedAnonymous}
          >
            <span
              className={classNames(styles.switch, {
                [styles.switchActive]: effectiveAnonymous,
              })}
            >
              <span className={styles.switchKnob} />
            </span>
            <span className={styles.anonymousLabel}>הגב בעילום שם</span>
          </button>

          {isMember && (
            <button
              type="button"
              onClick={() => setMembersOnly((prev) => !prev)}
              className={classNames(styles.membersToggle, {
                [styles.membersToggleActive]: membersOnly,
              })}
              aria-pressed={membersOnly}
            >
              <LockIcon className={styles.membersToggleIcon} />
              <span>רק לחברי הקהילה</span>
            </button>
          )}
        </div>

        <p className={styles.reassurance}>
          {effectiveAnonymous
            ? `השם שלך לא יישמר ולא יוצג לאף אחד — התגובה תתפרסם ללא כל זיהוי.`
            : forcedAnonymous
              ? `לא מחוברים? אין בעיה — אפשר להגיב גם ככה, התגובה תפורסם בעילום שם.`
              : `התגובה תתפרסם תחת השם שלך. אפשר תמיד לעבור למצב אנונימי.`}
        </p>

        <div className={styles.composerFooter}>
          <Button
            variant="accent"
            size="md"
            disabled={!text.trim()}
            loading={addingComment}
            onClick={() => {
              handleSubmit();
            }}
          >
            פרסום תגובה
          </Button>
        </div>
      </div>

      {error && <p className={styles.errorText}>אירעה שגיאה בטעינת התגובות. נסו לרענן את העמוד.</p>}

      {!error && loading && <p className={styles.loadingText}>טוען תגובות...</p>}

      {!error && !loading && commentCount === 0 && (
        <p className={styles.emptyText}>עדיין אין תגובות. היו הראשונים להגיב.</p>
      )}

      <div className={styles.list}>
        {entries.map((entry) => {
          if (entry.kind === `gated`) {
            return (
              <div key={entry.comment.id} className={styles.gatedRow}>
                <LockIcon className={styles.gatedIcon} />
                <p className={styles.gatedText}>תגובה זו זמינה לחברי הקהילה בלבד.</p>
                <Button variant="accent" size="sm" href={joinUrl}>
                  הצטרפות לקהילה
                </Button>
              </div>
            );
          }

          const { comment } = entry;
          const displayName = comment.isAnonymous ? `אנונימי/ת` : comment.displayName || `אנונימי/ת`;
          const wasReported = reportedIds.includes(comment.id);

          return (
            <div key={comment.id} className={styles.commentRow}>
              <Avatar
                name={displayName}
                size="medium"
                anonymous={comment.isAnonymous}
                className={styles.commentAvatar}
              />
              <div className={styles.commentBody}>
                <div className={styles.commentBubble}>
                  <div className={styles.commentMeta}>
                    <span className={styles.commentAuthor}>{displayName}</span>
                    <span className={styles.commentTime}>{formatRelativeTime(comment.createdAt)}</span>
                    {comment.membersOnly && <Badge variant="accent">לחברים בלבד</Badge>}
                  </div>
                  <p className={styles.commentText}>{comment.text}</p>
                </div>
                <div className={styles.commentActions}>
                  <button
                    type="button"
                    onClick={() => {
                      handleReport(comment.id);
                    }}
                    disabled={wasReported || reportingComment}
                    className={styles.reportButton}
                  >
                    <FlagIcon className={styles.reportIcon} />
                    {wasReported ? `הדיווח נשלח` : `דיווח`}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
