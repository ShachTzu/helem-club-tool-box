import React, { useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Avatar } from '@helemclub/design.content.avatar';
import { useAuth, type UseAuthOptions } from '@helemclub/platform.hooks.use-auth';
import styles from './comment-composer.module.scss';

const MAX_LENGTH = 800;

type FormatCommand = 'bold' | 'italic' | 'link' | 'mention';

export type CommentComposerSubmitValues = {
  /**
   * the composed comment text.
   */
  text: string;

  /**
   * whether to post anonymously rather than under the member's name.
   */
  isAnonymous: boolean;

  /**
   * whether to restrict the comment's visibility to members only.
   */
  membersOnly: boolean;
};

export type CommentComposerProps = {
  /**
   * human-readable label of the parent content, used in the placeholder and
   * the sign-in prompt microcopy (e.g. "הכתבה", "האפליקציה").
   */
  parentLabel?: string;

  /**
   * name of the author being replied to, shown as a reply hint above the input.
   */
  replyTo?: string;

  /**
   * called with the composed values when the user submits. the input is
   * cleared automatically on submit.
   */
  onSubmit?: (values: CommentComposerSubmitValues) => void;

  /**
   * called when the user cancels an in-progress reply.
   */
  onCancel?: () => void;

  /**
   * destination for the "sign in to comment" call to action.
   */
  loginHref?: string;

  /**
   * override the current user resolution, useful for tests and previews.
   * pass null to preview the signed-out sign-in prompt.
   */
  mockUser?: UseAuthOptions['mockData'];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * inline style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * a first-class, reusable comment input used across every content type
 * (blog post, knowledge record, app, event, gallery work). RTL Hebrew,
 * mobile-first. features an auto-growing textarea with light formatting
 * helpers, @mention insertion, a live character counter, an anonymous toggle
 * and a members-only toggle. anonymous visitors see a friendly sign-in prompt.
 */
export function CommentComposer({
  parentLabel = `התוכן`,
  replyTo,
  onSubmit,
  onCancel,
  loginHref = `/login`,
  mockUser,
  className,
  style,
}: CommentComposerProps) {
  const { user } = useAuth(mockUser !== undefined ? { mockData: mockUser } : undefined);
  const [text, setText] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [membersOnly, setMembersOnly] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const rows = useMemo(() => Math.min(8, Math.max(3, text.split('\n').length)), [text]);

  if (!user) {
    return (
      <div className={classNames(styles.gate, className)} style={style}>
        <p className={styles.gateText}>
          הקריאה חופשית — כדי להצטרף לשיחה ולהגיב ל{parentLabel} צריך חשבון.
        </p>
        <Link to={loginHref} className={styles.gateButton}>התחברות / הרשמה</Link>
      </div>
    );
  }

  const applyFormat = (command: FormatCommand) => {
    const el = textareaRef.current;
    const start = el?.selectionStart ?? text.length;
    const end = el?.selectionEnd ?? text.length;
    const selected = text.slice(start, end);
    const wrap = (prefix: string, suffix = prefix, fallback = '') => {
      const inner = selected || fallback;
      return `${text.slice(0, start)}${prefix}${inner}${suffix}${text.slice(end)}`;
    };
    let next = text;
    if (command === 'bold') next = wrap('**', '**', 'טקסט מודגש');
    else if (command === 'italic') next = wrap('_', '_', 'טקסט נטוי');
    else if (command === 'link') next = wrap('[', '](https://)', 'קישור');
    else if (command === 'mention') next = `${text.slice(0, start)}@${text.slice(start)}`;
    setText(next.slice(0, MAX_LENGTH));
    requestAnimationFrame(() => el?.focus());
  };

  const submit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSubmit?.({ text: trimmed, isAnonymous, membersOnly });
    setText('');
    setMembersOnly(false);
  };

  const displayName = isAnonymous ? 'א' : (user.displayName ?? 'א');

  return (
    <div className={classNames(styles.composer, className)} style={style}>
      <Avatar name={displayName} size="medium" />
      <div className={styles.main}>
        {replyTo && <div className={styles.replyHint}>בתגובה ל{replyTo}</div>}

        <div className={styles.toolbar}>
          <button type="button" className={styles.fmtButton} title="מודגש" onClick={() => applyFormat('bold')}><strong>B</strong></button>
          <button type="button" className={styles.fmtButton} title="נטוי" onClick={() => applyFormat('italic')}><em>I</em></button>
          <button type="button" className={styles.fmtButton} title="קישור" onClick={() => applyFormat('link')}>🔗</button>
          <button type="button" className={styles.fmtButton} title="תיוג משתמש" onClick={() => applyFormat('mention')}>@</button>
        </div>

        <textarea
          ref={textareaRef}
          className={styles.textarea}
          value={text}
          rows={rows}
          onChange={(e) => setText(e.target.value.slice(0, MAX_LENGTH))}
          placeholder={`מה עלה לך מ${parentLabel}? כתבו בעדינות ובכבוד...`}
        />

        <div className={styles.footer}>
          <div className={styles.toggles}>
            <label className={styles.toggle}>
              <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
              פרסום אנונימי
            </label>
            <label className={styles.toggle}>
              <input type="checkbox" checked={membersOnly} onChange={(e) => setMembersOnly(e.target.checked)} />
              לחברים בלבד
            </label>
          </div>
          <div className={styles.actions}>
            <span className={classNames(styles.counter, text.length > MAX_LENGTH - 60 && styles.counterWarn)}>
              {text.length}/{MAX_LENGTH}
            </span>
            {onCancel && (
              <button type="button" className={styles.cancel} onClick={onCancel}>ביטול</button>
            )}
            <button type="button" className={styles.submit} onClick={submit} disabled={!text.trim()}>
              פרסום תגובה
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
