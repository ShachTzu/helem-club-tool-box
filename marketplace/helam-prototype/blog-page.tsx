import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { theme } from './theme.js';
import { PageShell, Container, Hero, Section, Card, Chip, Badge, Button } from './ui.js';
import { POSTS, type Post } from './ecosystem-mock.js';
import { APPS } from './mock.js';
import { AppCard } from './app-card.js';
import { CommentThread } from './comment-thread.js';

/** A single blog post card. */
export function PostCard({ post }: { post: Post }) {
  return (
    <Card to={`/blog/${post.slug}`} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img src={post.cover} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        {post.membersOnly && (
          <span style={{ position: 'absolute', top: 10, insetInlineStart: 10 }}>
            <Badge tone="accent">🔒 לחברי קהילה</Badge>
          </span>
        )}
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
          {post.domains.slice(0, 2).map((d) => (
            <span key={d} style={{ fontSize: 11.5, color: theme.color.secondary, background: theme.color.surface, border: `1px solid ${theme.color.border}`, padding: '2px 9px', borderRadius: theme.radius.pill }}>{d}</span>
          ))}
        </div>
        <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: theme.color.primary, lineHeight: 1.35 }}>{post.title}</h3>
        <p style={{ margin: '0 0 14px', fontSize: 14, color: theme.color.textMuted, lineHeight: 1.5, flex: 1 }}>{post.excerpt}</p>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, color: theme.color.textMuted }}>
          <span>{post.author}</span>
          <span>{post.date} · {post.readTime}</span>
        </div>
      </div>
    </Card>
  );
}

/** Blog home — filterable list of posts. */
export function BlogPage() {
  const [active, setActive] = useState<string[]>([]);
  const domains = useMemo(() => Array.from(new Set(POSTS.flatMap((p) => p.domains))), []);
  const filtered = useMemo(
    () => POSTS.filter((p) => (active.length === 0 ? true : active.some((d) => p.domains.includes(d)))),
    [active]
  );
  const toggle = (d: string) =>
    setActive((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  return (
    <PageShell>
      <Hero eyebrow="Blog Club" title="הבלוג של הלם קלאב" subtitle="ידע מקצועי, חוויות אישיות, והשראה לחיים לצד הפוסט-טראומה. קריאה חופשית — בלי הרשמה." />
      <Section
        title={`${filtered.length} כתבות`}
        action={<Button to="/blog/submit" variant="primary">✍️ הגשת כתבה</Button>}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
          {domains.map((d) => (
            <Chip key={d} label={d} active={active.includes(d)} onClick={() => toggle(d)} />
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18, paddingBottom: 40 }}>
          {filtered.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

/** Single post page with body, engagement, related apps. */
export function PostPage() {
  const { slug } = useParams();
  const [signedIn, setSignedIn] = useState(false);
  const post = POSTS.find((p) => p.slug === slug);
  if (!post) return <NotContent label="הכתבה לא נמצאה" />;

  const relatedApps = APPS.filter((a) => a.tags.some((t) => post.domains.includes(t))).slice(0, 3);

  return (
    <PageShell>
      <Container style={{ padding: '32px 20px 60px', maxWidth: 820 }}>
        <Link to="/blog" style={{ color: theme.color.secondary, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← חזרה לבלוג</Link>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '18px 0 14px' }}>
          {post.domains.map((d) => (
            <Link key={d} to="/domains" style={{ textDecoration: 'none' }}>
              <Badge tone="info">{d}</Badge>
            </Link>
          ))}
          {post.membersOnly && <Badge tone="accent">🔒 לחברי קהילה</Badge>}
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: theme.color.primary, margin: '0 0 14px', lineHeight: 1.25 }}>{post.title}</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 22, color: theme.color.textMuted, fontSize: 14 }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', background: theme.color.surfaceAlt, display: 'grid', placeItems: 'center', fontWeight: 800, color: theme.color.secondary }}>
            {post.author.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: theme.color.primary }}>{post.author}</div>
            <div>{post.date} · {post.readTime} קריאה</div>
          </div>
        </div>
        <img src={post.cover} alt={post.title} style={{ width: '100%', borderRadius: theme.radius.md, marginBottom: 24 }} />

        <div style={{ fontSize: 17, lineHeight: 1.85, color: theme.color.black }}>
          <p>{post.excerpt}</p>
          <p>
            זהו טקסט הדגמה לגוף הכתבה. בגרסה המלאה כאן יופיע תוכן עשיר עם פסקאות, תמונות, ציטוטים,
            ובלוקי אפליקציה מוטמעים מארגז הכלים — כך שכל כתבה מחברת בין ידע לכלים מעשיים.
          </p>
          <blockquote style={{ borderInlineStart: `4px solid ${theme.color.accent}`, margin: '24px 0', padding: '4px 18px', color: theme.color.secondary, fontSize: 18, fontStyle: 'italic' }}>
            "השיתוף עצמו הוא חלק מהריפוי — כשמישהו אחר מרגיש פחות לבד, גם אנחנו."
          </blockquote>
          <p>
            בתחתית הכתבה מוצג אזור מעורבות (תגובות, לייק, שמירה ושיתוף) וכן אפליקציות שיכולות לעזור,
            לפי תגיות משותפות.
          </p>
        </div>

        {/* Engagement */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', margin: '30px 0', paddingBlock: 18, borderBlock: `1px solid ${theme.color.border}` }}>
          <EngageBtn icon="❤️" label="אהבתי · 42" />
          <EngageBtn icon="🔖" label="שמירה" />
          <EngageBtn icon="↗️" label="שיתוף" />
          <button
            onClick={() => setSignedIn((v) => !v)}
            style={{ marginInlineStart: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: signedIn ? theme.color.primary : theme.color.white, color: signedIn ? '#fff' : theme.color.secondary, border: `1px solid ${signedIn ? theme.color.primary : theme.color.border}`, borderRadius: theme.radius.pill, padding: '9px 16px', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
          >
            {signedIn ? 'דמו: מחובר ✓' : 'דמו: אורח'}
          </button>
        </div>

        {relatedApps.length > 0 && (
          <>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: theme.color.primary, margin: '10px 0 16px' }}>אפליקציות שיכולות לעזור</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
              {relatedApps.map((a) => (
                <AppCard key={a.id} app={a} />
              ))}
            </div>
          </>
        )}

        <CommentThread isAuthenticated={signedIn} />
      </Container>
    </PageShell>
  );
}

function EngageBtn({ icon, label }: { icon: string; label: string }) {
  return (
    <button style={{ display: 'flex', alignItems: 'center', gap: 6, background: theme.color.white, border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.pill, padding: '9px 16px', fontSize: 14, fontWeight: 600, color: theme.color.secondary, cursor: 'pointer', fontFamily: 'inherit' }}>
      <span>{icon}</span> {label}
    </button>
  );
}

/** Article submission form (community member). */
export function SubmitArticlePage() {
  return (
    <PageShell>
      <Container style={{ padding: '32px 20px 60px', maxWidth: 720 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: theme.color.primary, margin: '0 0 8px' }}>הגשת כתבה לבלוג</h1>
        <p style={{ color: theme.color.textMuted, fontSize: 15.5, lineHeight: 1.6, marginTop: 0 }}>
          מוזמנים לשתף ידע או חוויה אישית. הכתבה תעבור הגהה ואישור לפני פרסום. פרטי הקשר אינם מוצגים לציבור.
        </p>
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <Field label="כותרת הכתבה"><input style={inputStyle} placeholder="כותרת ברורה ומזמינה" /></Field>
          <Field label="תקציר"><textarea style={{ ...inputStyle, minHeight: 70 }} placeholder="שתי-שלוש שורות שמתארות את הכתבה" /></Field>
          <Field label="גוף הכתבה"><textarea style={{ ...inputStyle, minHeight: 180 }} placeholder="כתבו כאן..." /></Field>
          <Field label="תחומי התמודדות (תגיות)"><input style={inputStyle} placeholder="בחרו תגיות מתאימות" /></Field>
          <div style={{ background: theme.color.surface, borderRadius: theme.radius.md, padding: 18 }}>
            <div style={{ fontWeight: 800, color: theme.color.primary, marginBottom: 12 }}>פרטי מזהה (לא מוצגים לציבור)</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: 12 }}>
              <input style={inputStyle} placeholder="שם מלא" />
              <input style={inputStyle} placeholder="מייל" />
              <input style={inputStyle} placeholder="טלפון" />
              <input style={inputStyle} placeholder="קישור לפרופיל פייסבוק" />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: theme.color.secondary }}>
            <input type="checkbox" /> אני מעדיף/ה לפרסם בכינוי אנונימי
          </label>
          <Button variant="accent" size="lg">שליחה לאישור</Button>
        </div>
      </Container>
    </PageShell>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.sm,
  padding: '11px 14px',
  fontSize: 15,
  fontFamily: 'inherit',
  background: theme.color.white,
  color: theme.color.black,
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontWeight: 700, fontSize: 14, color: theme.color.primary, marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  );
}

/** Simple placeholder for missing content. */
export function NotContent({ label }: { label: string }) {
  return (
    <PageShell>
      <Container style={{ padding: '80px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 46, marginBottom: 12 }}>🤍</div>
        <h1 style={{ fontSize: 24, color: theme.color.primary }}>{label}</h1>
        <Button to="/" variant="primary">חזרה לבית</Button>
      </Container>
    </PageShell>
  );
}
