import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { theme } from './theme.js';
import { PageShell, Container, Button } from './ui.js';
import { TAGS } from './mock.js';

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

type Role = 'מתמודד/ת' | 'בן/בת משפחה' | 'איש/אשת מקצוע' | 'אחר';

const ROLES: Role[] = ['מתמודד/ת', 'בן/בת משפחה', 'איש/אשת מקצוע', 'אחר'];
const STEPS = ['פרטים אישיים', 'ההקשר שלך', 'תחומי עניין'];

/**
 * Post-signup onboarding wizard. A new user MUST complete this form
 * before continuing into the platform as a fully-registered member.
 */
export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [role, setRole] = useState<Role | null>(null);
  const [about, setAbout] = useState('');
  const [interests, setInterests] = useState<string[]>([]);
  const [notify, setNotify] = useState(true);
  const [anon, setAnon] = useState(false);

  const toggleInterest = (name: string) =>
    setInterests((prev) => (prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]));

  const canNext = useMemo(() => {
    if (step === 0) return name.trim().length > 1;
    if (step === 1) return role !== null;
    if (step === 2) return interests.length > 0;
    return true;
  }, [step, name, role, interests]);

  const isLast = step === STEPS.length - 1;
  const next = () => (isLast ? navigate('/') : setStep((s) => s + 1));
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <PageShell>
      <Container style={{ padding: '40px 20px 64px', maxWidth: 620 }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>🌱</div>
          <h1 style={{ fontSize: 27, fontWeight: 800, color: theme.color.primary, margin: '0 0 6px' }}>
            כמה פרטים לפני שמתחילים
          </h1>
          <p style={{ color: theme.color.textMuted, fontSize: 15, lineHeight: 1.6, margin: 0 }}>
            נשמח להכיר אתכם קצת יותר — כדי להתאים לכם תוכן, כלים והמלצות רלוונטיים.
          </p>
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
          {STEPS.map((label, i) => (
            <div key={label} style={{ flex: 1 }}>
              <div
                style={{
                  height: 6,
                  borderRadius: 4,
                  background: i <= step ? theme.color.accent : theme.color.border,
                  transition: 'background .2s ease',
                }}
              />
              <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6, textAlign: 'center', color: i <= step ? theme.color.primary : theme.color.textMuted }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: theme.color.white, border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.lg, padding: 28, boxShadow: theme.shadow.card }}>
          {step === 0 && (
            <div style={{ display: 'grid', gap: 16 }}>
              <Field label="שם מלא">
                <input style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="איך קוראים לך?" />
              </Field>
              <Field label="כינוי לתצוגה בקהילה (אופציונלי)">
                <input style={inputStyle} value={nickname} onChange={(e) => setNickname(e.target.value)} placeholder="השם שיוצג לצד תגובות ושיתופים" />
              </Field>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: theme.color.secondary }}>
                <input type="checkbox" checked={anon} onChange={(e) => setAnon(e.target.checked)} />
                אני מעדיף/ה להישאר אנונימי/ת בפעילות הציבורית
              </label>
            </div>
          )}

          {step === 1 && (
            <div style={{ display: 'grid', gap: 18 }}>
              <div>
                <span style={{ display: 'block', fontWeight: 700, fontSize: 14, color: theme.color.primary, marginBottom: 10 }}>מה מתאר אותך?</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {ROLES.map((r) => (
                    <button
                      key={r}
                      onClick={() => setRole(r)}
                      style={{
                        cursor: 'pointer',
                        border: `1px solid ${role === r ? theme.color.secondary : theme.color.border}`,
                        background: role === r ? theme.color.secondary : theme.color.white,
                        color: role === r ? theme.color.white : theme.color.secondary,
                        fontWeight: 700,
                        fontSize: 14,
                        padding: '10px 18px',
                        borderRadius: theme.radius.pill,
                        fontFamily: 'inherit',
                      }}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <Field label="קצת על מה מביא אותך לכאן (אופציונלי)">
                <textarea style={{ ...inputStyle, minHeight: 110 }} value={about} onChange={(e) => setAbout(e.target.value)} placeholder="נשמח לשמוע — אבל רק אם מתאים לך לשתף" />
              </Field>
            </div>
          )}

          {step === 2 && (
            <div style={{ display: 'grid', gap: 18 }}>
              <div>
                <span style={{ display: 'block', fontWeight: 700, fontSize: 14, color: theme.color.primary, marginBottom: 4 }}>
                  אילו תחומים הכי רלוונטיים לך כרגע?
                </span>
                <p style={{ margin: '0 0 12px', fontSize: 13, color: theme.color.textMuted }}>
                  בחרו לפחות תחום אחד — נשתמש בזה כדי להתאים לכם תוכן והמלצות.
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {TAGS.map((t) => {
                    const active = interests.includes(t.name);
                    return (
                      <button
                        key={t.name}
                        onClick={() => toggleInterest(t.name)}
                        style={{
                          cursor: 'pointer',
                          border: `1px solid ${active ? theme.color.accent : theme.color.border}`,
                          background: active ? 'rgba(232,159,75,0.14)' : theme.color.white,
                          color: active ? theme.color.primary : theme.color.secondary,
                          fontWeight: 600,
                          fontSize: 13,
                          padding: '8px 14px',
                          borderRadius: theme.radius.pill,
                          fontFamily: 'inherit',
                        }}
                      >
                        {active ? '✓ ' : ''}{t.name}
                      </button>
                    );
                  })}
                </div>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: theme.color.secondary }}>
                <input type="checkbox" checked={notify} onChange={(e) => setNotify(e.target.checked)} />
                עדכנו אותי על תוכן ואירועים חדשים בתחומים שבחרתי
              </label>
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 26, gap: 12 }}>
            {step > 0 ? (
              <button onClick={back} style={{ background: 'transparent', border: 'none', color: theme.color.secondary, fontWeight: 700, fontSize: 14.5, cursor: 'pointer', fontFamily: 'inherit' }}>
                → חזרה
              </button>
            ) : <span />}
            <div style={{ opacity: canNext ? 1 : 0.5, pointerEvents: canNext ? 'auto' : 'none' }}>
              <Button onClick={next} variant="accent" size="lg">
                {isLast ? 'סיום וכניסה 🎉' : 'המשך'}
              </Button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontSize: 13, color: theme.color.textMuted, marginTop: 18 }}>
          השלמת הפרטים נדרשת פעם אחת בלבד — אפשר לעדכן הכל בהמשך מהפרופיל.
        </p>
      </Container>
    </PageShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label style={{ display: 'block' }}>
      <span style={{ display: 'block', fontWeight: 700, fontSize: 14, color: theme.color.primary, marginBottom: 7 }}>{label}</span>
      {children}
    </label>
  );
}
