import { useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from './theme.js';

/** A single comment in a thread. */
export type Comment = {
  id: string;
  author: string;
  initial: string;
  timeAgo: string;
  body: string;
  likes: number;
  liked?: boolean;
  replies?: Comment[];
};

const SEED_COMMENTS: Comment[] = [
  {
    id: 'c1',
    author: 'מיכל ר.',
    initial: 'מ',
    timeAgo: 'לפני 3 שעות',
    body: 'תודה על השיתוף. הפסקה על הקרקוע הזכירה לי כמה חשוב פשוט לעצור ולנשום. שמרתי לעצמי.',
    likes: 12,
    replies: [
      {
        id: 'c1r1',
        author: 'צוות הלם קלאב',
        initial: '●',
        timeAgo: 'לפני שעתיים',
        body: 'שמחים שעזר 🤍 יש עוד תרגול קרקוע מודרך במאגר הידע אם בא לך.',
        likes: 4,
      },
    ],
  },
  {
    id: 'c2',
    author: 'אנונימי/ת',
    initial: '?',
    timeAgo: 'אתמול',
    body: 'לקח לי זמן להבין שאני לא לבד עם זה. הקהילה כאן עושה הבדל.',
    likes: 8,
  },
];

/**
 * A first-class comment input used across all content types.
 * RTL Hebrew, auto-growing, light formatting hints, character counter,
 * and a login-gated submit. Bound to a parent object via props.
 */
export function CommentComposer({
  parentLabel = 'הכתבה',
  isAuthenticated = false,
  onSubmit,
  replyTo,
  onCancel,
}: {
  parentLabel?: string;
  isAuthenticated?: boolean;
  onSubmit?: (body: string) => void;
  replyTo?: string;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState('');
  const max = 800;

  if (!isAuthenticated) {
    return (
      <div style={{ background: theme.color.surface, border: `1px dashed ${theme.color.border}`, borderRadius: theme.radius.md, padding: 20, textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px', color: theme.color.textMuted, fontSize: 14.5, lineHeight: 1.6 }}>
          הקריאה חופשית — כדי להצטרף לשיחה ולהגיב ל{parentLabel} צריך חשבון.
        </p>
        <Link
          to="/login"
          style={{ display: 'inline-block', background: theme.color.accent, color: theme.color.primary, fontWeight: 700, fontSize: 14.5, padding: '10px 22px', borderRadius: theme.radius.pill, textDecoration: 'none' }}
        >
          התחברות / הרשמה
        </Link>
      </div>
    );
  }

  const submit = () => {
    if (!value.trim()) return;
    onSubmit?.(value.trim());
    setValue('');
  };

  return (
    <div style={{ background: theme.color.white, border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.md, padding: 14 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: '50%', background: theme.color.primary, color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 800 }}>
          א
        </div>
        <div style={{ flex: 1 }}>
          {replyTo && (
            <div style={{ fontSize: 12.5, color: theme.color.secondary, marginBottom: 6 }}>
              בתגובה ל{replyTo}
            </div>
          )}
          <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
            <FmtBtn label="B" title="מודגש" bold />
            <FmtBtn label="I" title="נטוי" italic />
            <FmtBtn label="🔗" title="קישור" />
            <FmtBtn label="@" title="תיוג משתמש" />
          </div>
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value.slice(0, max))}
            placeholder={`מה עלה לך מ${parentLabel}? כתבו בעדינות ובכבוד...`}
            rows={Math.min(8, Math.max(3, value.split('\n').length))}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              border: `1px solid ${theme.color.border}`,
              borderRadius: theme.radius.sm,
              padding: '11px 13px',
              fontSize: 15,
              lineHeight: 1.6,
              fontFamily: 'inherit',
              resize: 'none',
              background: theme.color.surface,
              color: theme.color.black,
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 }}>
            <span style={{ fontSize: 12, color: value.length > max - 60 ? theme.color.accent : theme.color.textMuted }}>
              {value.length}/{max}
            </span>
            <div style={{ display: 'flex', gap: 8 }}>
              {onCancel && (
                <button onClick={onCancel} style={{ background: 'transparent', border: 'none', color: theme.color.textMuted, fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
                  ביטול
                </button>
              )}
              <button
                onClick={submit}
                disabled={!value.trim()}
                style={{
                  background: value.trim() ? theme.color.accent : theme.color.border,
                  color: value.trim() ? theme.color.primary : theme.color.textMuted,
                  border: 'none',
                  fontWeight: 800,
                  fontSize: 14.5,
                  padding: '9px 22px',
                  borderRadius: theme.radius.pill,
                  cursor: value.trim() ? 'pointer' : 'default',
                  fontFamily: 'inherit',
                }}
              >
                פרסום תגובה
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FmtBtn({ label, title, bold, italic }: { label: string; title: string; bold?: boolean; italic?: boolean }) {
  return (
    <button
      title={title}
      type="button"
      style={{
        width: 30,
        height: 30,
        border: `1px solid ${theme.color.border}`,
        background: theme.color.white,
        borderRadius: theme.radius.sm,
        cursor: 'pointer',
        fontWeight: bold ? 800 : 600,
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: 13.5,
        color: theme.color.secondary,
        fontFamily: 'inherit',
      }}
    >
      {label}
    </button>
  );
}

/** One rendered comment with like + reply affordances. */
function CommentRow({ comment, depth = 0 }: { comment: Comment; depth?: number }) {
  const [liked, setLiked] = useState(!!comment.liked);
  const [likes, setLikes] = useState(comment.likes);
  const [replying, setReplying] = useState(false);

  const toggleLike = () => {
    setLiked((v) => !v);
    setLikes((n) => (liked ? n - 1 : n + 1));
  };

  return (
    <div style={{ marginInlineStart: depth * 44, marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        <div style={{ width: 38, height: 38, flexShrink: 0, borderRadius: '50%', background: depth ? theme.color.secondary : theme.color.surfaceAlt, color: depth ? '#fff' : theme.color.secondary, display: 'grid', placeItems: 'center', fontWeight: 800 }}>
          {comment.initial}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ background: theme.color.surface, border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.md, padding: '12px 14px' }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline', marginBottom: 5 }}>
              <span style={{ fontWeight: 800, color: theme.color.primary, fontSize: 14.5 }}>{comment.author}</span>
              <span style={{ fontSize: 12, color: theme.color.textMuted }}>{comment.timeAgo}</span>
            </div>
            <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.65, color: theme.color.black }}>{comment.body}</p>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 6, paddingInlineStart: 4 }}>
            <button onClick={toggleLike} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: liked ? theme.color.accent : theme.color.textMuted, fontFamily: 'inherit' }}>
              {liked ? '❤️' : '🤍'} {likes}
            </button>
            {depth === 0 && (
              <button onClick={() => setReplying((v) => !v)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 700, color: theme.color.textMuted, fontFamily: 'inherit' }}>
                💬 תגובה
              </button>
            )}
          </div>
          {replying && (
            <div style={{ marginTop: 10 }}>
              <CommentComposer isAuthenticated replyTo={comment.author} onCancel={() => setReplying(false)} onSubmit={() => setReplying(false)} />
            </div>
          )}
        </div>
      </div>
      {comment.replies?.map((r) => (
        <div key={r.id} style={{ marginTop: 16 }}>
          <CommentRow comment={r} depth={depth + 1} />
        </div>
      ))}
    </div>
  );
}

/**
 * Threaded comment display + composer, bound to a parent content object.
 * Demonstrates the engagement pattern the plan defines (comments always
 * tied to a parent; anonymous read, login-gated posting).
 */
export function CommentThread({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
  const [comments, setComments] = useState<Comment[]>(SEED_COMMENTS);

  const addComment = (body: string) => {
    setComments((prev) => [
      { id: `new-${Date.now()}`, author: 'אתה', initial: 'א', timeAgo: 'עכשיו', body, likes: 0 },
      ...prev,
    ]);
  };

  return (
    <section style={{ marginTop: 40 }}>
      <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.color.primary, margin: '0 0 18px' }}>
        תגובות ({comments.length})
      </h2>
      <div style={{ marginBottom: 28 }}>
        <CommentComposer isAuthenticated={isAuthenticated} onSubmit={addComment} />
      </div>
      <div>
        {comments.map((c) => (
          <CommentRow key={c.id} comment={c} />
        ))}
      </div>
    </section>
  );
}
