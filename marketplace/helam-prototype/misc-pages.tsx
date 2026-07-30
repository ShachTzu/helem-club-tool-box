import { useNavigate } from 'react-router-dom';
import { theme } from './theme.js';
import { PageShell, Container, Hero, Section, Card, Button, Badge } from './ui.js';

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.sm,
  padding: '12px 14px',
  fontSize: 15,
  fontFamily: 'inherit',
  background: theme.color.white,
  color: theme.color.black,
};

/** Login / signup page — email OTP + Google. New users continue to onboarding. */
export function LoginPage() {
  const navigate = useNavigate();
  return (
    <PageShell>
      <Container style={{ padding: '48px 20px', maxWidth: 440 }}>
        <div style={{ background: theme.color.white, border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.lg, padding: 32, boxShadow: theme.shadow.card }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: theme.color.primary, margin: '0 0 6px', textAlign: 'center' }}>ברוכים הבאים</h1>
          <p style={{ color: theme.color.textMuted, fontSize: 14.5, textAlign: 'center', margin: '0 0 24px', lineHeight: 1.6 }}>
            הקריאה תמיד חופשית. חשבון פותח גישה לתוכן חברי-קהילה, שמירת מועדפים והגשת תוכן.
          </p>
          <button onClick={() => navigate('/onboarding')} style={{ ...btn, background: theme.color.white, color: theme.color.black, border: `1px solid ${theme.color.border}`, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>🔵</span> התחברות עם Google
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: theme.color.textMuted, fontSize: 13, margin: '4px 0 16px' }}>
            <span style={{ flex: 1, height: 1, background: theme.color.border }} /> או <span style={{ flex: 1, height: 1, background: theme.color.border }} />
          </div>
          <label style={{ display: 'block', fontWeight: 700, fontSize: 14, color: theme.color.primary, marginBottom: 7 }}>כתובת מייל</label>
          <input style={{ ...inputStyle, marginBottom: 14 }} placeholder="name@example.com" type="email" />
          <button onClick={() => navigate('/onboarding')} style={{ ...btn, background: theme.color.accent, color: theme.color.primary }}>המשך להרשמה</button>
          <p style={{ color: theme.color.textMuted, fontSize: 12.5, textAlign: 'center', marginTop: 18, lineHeight: 1.6 }}>
            נשלח קוד חד-פעמי למייל — ללא סיסמה. לאחר האימות נשלים כמה פרטים קצרים.
          </p>
        </div>
      </Container>
    </PageShell>
  );
}

const btn: React.CSSProperties = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '13px',
  borderRadius: theme.radius.pill,
  fontWeight: 700,
  fontSize: 15,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

/** Saved items page (local per device). */
export function SavedPage() {
  return (
    <PageShell>
      <Hero eyebrow="שמור למאוחר" title="השמורים שלי" subtitle="תוכן ששמרתם לקריאה או צפייה מאוחרת — נשמר על המכשיר שלכם, גם בלי חשבון." />
      <Container style={{ padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 14 }}>🔖</div>
        <h2 style={{ color: theme.color.primary, fontSize: 22, margin: '0 0 8px' }}>עדיין לא שמרתם תוכן</h2>
        <p style={{ color: theme.color.textMuted, fontSize: 15.5, maxWidth: 420, margin: '0 auto 22px', lineHeight: 1.6 }}>
          בכל כתבה, כלי או תוכן תמצאו כפתור שמירה. מה שתשמרו יופיע כאן.
        </p>
        <Button to="/toolbox" variant="accent">לגלות תוכן</Button>
      </Container>
    </PageShell>
  );
}

const ADMIN_SECTIONS = [
  { icon: '👥', title: 'ניהול משתמשים', desc: 'תפקידים: חבר, כותב, מודרטור, אדמין' },
  { icon: '🧰', title: 'ניהול כלים', desc: 'אישור הגשות, עריכה ותיוג' },
  { icon: '📚', title: 'ניהול מאגר ידע', desc: 'פרויקטים ותכני וידאו/אודיו' },
  { icon: '📝', title: 'ניהול בלוג', desc: 'אישור כתבות, כותבים ודשבורד' },
  { icon: '📅', title: 'ניהול אירועים', desc: 'יצירה, RSVP והקלטות' },
  { icon: '🎨', title: 'ניהול גלריה', desc: 'יצירות PTSDART' },
  { icon: '🧭', title: 'ניהול דומיינים', desc: '14 תחומי ההתמודדות' },
  { icon: '🛡️', title: 'מודרציה', desc: 'תור תגובות שדווחו' },
];

/** Admin overview page — shows the CRUD surface for every feature. */
export function AdminPage() {
  return (
    <PageShell>
      <Hero eyebrow="אזור ניהול" title="לוח בקרה" subtitle="ניהול מלא של האקוסיסטם — משתמשים, תוכן, אירועים ומודרציה. גישה למודרטורים ואדמינים." />
      <Section title="מדדים מרכזיים">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px,1fr))', gap: 14, marginBottom: 34 }}>
          <Metric n="1,248" label="מבקרים החודש" />
          <Metric n="86" label="כתבות שפורסמו" />
          <Metric n="312" label="תגובות" />
          <Metric n="47" label="חברי קהילה מאומתים" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 16, paddingBottom: 44 }}>
          {ADMIN_SECTIONS.map((s) => (
            <Card key={s.title} style={{ padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 10 }}>{s.icon}</div>
              <h3 style={{ margin: '0 0 5px', fontSize: 16.5, fontWeight: 800, color: theme.color.primary }}>{s.title}</h3>
              <p style={{ margin: 0, fontSize: 13.5, color: theme.color.textMuted, lineHeight: 1.5 }}>{s.desc}</p>
            </Card>
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

function Metric({ n, label }: { n: string; label: string }) {
  return (
    <div style={{ background: theme.color.white, border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.md, padding: 20, textAlign: 'center' }}>
      <div style={{ fontSize: 30, fontWeight: 900, color: theme.color.primary }}>{n}</div>
      <div style={{ fontSize: 13, color: theme.color.textMuted, marginTop: 4 }}>{label}</div>
    </div>
  );
}

/** Tool submission page (registered member submits an app). */
export function SubmitToolPage() {
  return (
    <PageShell>
      <Container style={{ padding: '32px 20px 60px', maxWidth: 680 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: theme.color.primary, margin: '0 0 8px' }}>הגשת כלי חדש</h1>
        <p style={{ color: theme.color.textMuted, fontSize: 15.5, lineHeight: 1.6, marginTop: 0 }}>
          מכירים אפליקציה שעוזרת בהתמודדות? הגישו אותה לארגז הכלים. ההגשה תעבור אישור של מודרטור לפני פרסום.
        </p>
        <div style={{ marginBottom: 20 }}><Badge tone="info">דרוש חשבון מחובר</Badge></div>
        <div style={{ display: 'grid', gap: 16 }}>
          <input style={inputStyle} placeholder="שם האפליקציה" />
          <input style={inputStyle} placeholder="משפט תיאור קצר" />
          <textarea style={{ ...inputStyle, minHeight: 120 }} placeholder="תיאור מלא" />
          <input style={inputStyle} placeholder="קישור לאפליקציה" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: 12 }}>
            <input style={inputStyle} placeholder="עלות (חינם / בתשלום)" />
            <input style={inputStyle} placeholder="פלטפורמות" />
          </div>
          <input style={inputStyle} placeholder="תחומי התמודדות (תגיות)" />
          <Button variant="accent" size="lg">שליחה לאישור</Button>
        </div>
      </Container>
    </PageShell>
  );
}
