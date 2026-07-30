import { useParams, Link } from 'react-router-dom';
import { theme } from './theme.js';
import { APPS, REVIEWS } from './mock.js';
import { Stars } from './stars.js';

/** App Store–style detail page: header CTA, gallery, description, ratings. */
export function AppDetailPage() {
  const { id } = useParams();
  const app = APPS.find((a) => a.id === id);
  if (!app) {
    return (
      <div style={{ maxWidth: 700, margin: '80px auto', textAlign: 'center', padding: 20 }}>
        <h2 style={{ color: theme.color.primary }}>האפליקציה לא נמצאה</h2>
        <Link to="/" style={{ color: theme.color.secondary }}>
          חזרה לעמוד הבית
        </Link>
      </div>
    );
  }

  const reviews = REVIEWS.filter((r) => r.appId === app.id).sort((a, b) => b.helpfulCount - a.helpfulCount);
  const helpfulPct = Math.round((app.helpfulYes / (app.helpfulYes + app.helpfulNo)) * 100);
  const maxHist = Math.max(...app.ratingHistogram, 1);

  const ctaButton = (
    <a
      href={app.externalLink}
      target="_blank"
      rel="noreferrer"
      style={{
        background: theme.color.accent,
        color: theme.color.primary,
        padding: '13px 30px',
        borderRadius: theme.radius.pill,
        fontWeight: 800,
        fontSize: 16,
        textDecoration: 'none',
        boxShadow: '0 4px 14px rgba(232,159,75,0.4)',
        whiteSpace: 'nowrap',
      }}
    >
      לאפליקציה ↗
    </a>
  );

  return (
    <div style={{ background: theme.color.surface, minHeight: '100vh' }}>
      <div style={{ maxWidth: 980, margin: '0 auto', padding: '24px 20px 64px' }}>
        <Link to="/toolbox" style={{ color: theme.color.secondary, fontSize: 14, textDecoration: 'none' }}>
          → חזרה לארגז הכלים
        </Link>

        {/* Header */}
        <section
          style={{
            background: theme.color.white,
            border: `1px solid ${theme.color.border}`,
            borderRadius: theme.radius.lg,
            boxShadow: theme.shadow.card,
            padding: 26,
            marginTop: 14,
            display: 'flex',
            gap: 22,
            alignItems: 'center',
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: 24,
              background: theme.color.surfaceAlt,
              display: 'grid',
              placeItems: 'center',
              fontSize: 52,
              flexShrink: 0,
            }}
          >
            {app.icon}
          </div>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: 30, fontWeight: 800, color: theme.color.primary }}>
                {app.name}
              </h1>
              {app.isFeatured && (
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: theme.color.accent,
                    background: 'rgba(232,159,75,0.12)',
                    padding: '3px 10px',
                    borderRadius: theme.radius.pill,
                  }}
                >
                  מומלץ ע"י הקהילה
                </span>
              )}
            </div>
            <p style={{ margin: '6px 0 12px', fontSize: 16, color: theme.color.textMuted }}>
              {app.subtitle}
            </p>
            <div
              style={{
                display: 'flex',
                gap: 16,
                flexWrap: 'wrap',
                alignItems: 'center',
                fontSize: 13.5,
                color: theme.color.textMuted,
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Stars value={app.avgRating} /> {app.avgRating.toFixed(1)} · {app.ratingCount} מדרגים
              </span>
              <span>· 👆 {app.clickCount.toLocaleString('he-IL')} קליקים</span>
              <span>· {app.costType}</span>
            </div>
          </div>
          {ctaButton}
        </section>

        {/* Credits */}
        <section style={cardStyle}>
          <h3 style={sectionTitle}>הקרדיטים של הקהילה</h3>
          <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap' }}>
            <div>
              <div style={metaLabel}>פותח ע"י</div>
              <div style={{ fontWeight: 700, color: theme.color.primary }}>{app.developerName}</div>
            </div>
            {app.originatorName && (
              <div>
                <div style={metaLabel}>הרעיון של</div>
                <div style={{ fontWeight: 700, color: theme.color.secondary }}>
                  {app.originatorName} <span style={{ fontSize: 12 }}>(מה-Wishlist)</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Gallery */}
        <section style={cardStyle}>
          <h3 style={sectionTitle}>גלריה</h3>
          <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 6 }}>
            {app.screenshots.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${app.name} צילום מסך ${i + 1}`}
                style={{
                  height: 340,
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.color.border}`,
                  flexShrink: 0,
                }}
              />
            ))}
          </div>
        </section>

        {/* Description */}
        <section style={cardStyle}>
          <h3 style={sectionTitle}>על האפליקציה</h3>
          <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.75, color: theme.color.black }}>
            {app.fullDescription}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {app.tags.map((t) => (
              <Link
                key={t}
                to="/"
                style={{
                  fontSize: 13,
                  color: theme.color.secondary,
                  background: theme.color.surface,
                  border: `1px solid ${theme.color.border}`,
                  padding: '5px 12px',
                  borderRadius: theme.radius.pill,
                  textDecoration: 'none',
                }}
              >
                {t}
              </Link>
            ))}
          </div>
        </section>

        {/* Suitable for */}
        <section style={cardStyle}>
          <h3 style={sectionTitle}>מתאים ל…</h3>
          <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', fontSize: 14 }}>
            <div>
              <div style={metaLabel}>פלטפורמה</div>
              <div style={{ color: theme.color.primary, fontWeight: 600 }}>{app.platform.join(' · ')}</div>
            </div>
            <div>
              <div style={metaLabel}>שפה</div>
              <div style={{ color: theme.color.primary, fontWeight: 600 }}>{app.language}</div>
            </div>
            <div>
              <div style={metaLabel}>נדרשת הרשמה</div>
              <div style={{ color: theme.color.primary, fontWeight: 600 }}>
                {app.requiresSignup ? 'כן' : 'לא'}
              </div>
            </div>
          </div>
        </section>

        {/* Result signal */}
        <section
          style={{
            ...cardStyle,
            background: 'rgba(79,109,122,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
          }}
        >
          <div>
            <h3 style={{ ...sectionTitle, marginBottom: 4 }}>עזר לך?</h3>
            <p style={{ margin: 0, fontSize: 13.5, color: theme.color.textMuted }}>
              {helpfulPct}% מהמשתמשים דיווחו שהאפליקציה עזרה להם
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button style={helpfulBtn}>👍 כן</button>
            <button style={{ ...helpfulBtn, borderColor: theme.color.border }}>👎 לא</button>
          </div>
        </section>

        {/* Ratings */}
        <section style={cardStyle}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 18,
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            <h3 style={{ ...sectionTitle, marginBottom: 0 }}>דירוגים וביקורות</h3>
            <button
              style={{
                cursor: 'pointer',
                border: `1.5px solid ${theme.color.accent}`,
                background: theme.color.white,
                color: theme.color.primary,
                fontWeight: 700,
                fontSize: 14,
                padding: '9px 20px',
                borderRadius: theme.radius.pill,
              }}
            >
              כתבו ביקורת
            </button>
          </div>

          <div style={{ display: 'flex', gap: 30, flexWrap: 'wrap', marginBottom: 22 }}>
            <div style={{ textAlign: 'center', minWidth: 120 }}>
              <div style={{ fontSize: 46, fontWeight: 800, color: theme.color.primary }}>
                {app.avgRating.toFixed(1)}
              </div>
              <Stars value={app.avgRating} size={18} />
              <div style={{ fontSize: 13, color: theme.color.textMuted, marginTop: 4 }}>
                {app.ratingCount} מדרגים
              </div>
            </div>
            <div style={{ flex: 1, minWidth: 220 }}>
              {[5, 4, 3, 2, 1].map((star) => {
                const c = app.ratingHistogram[star - 1];
                return (
                  <div key={star} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12, color: theme.color.textMuted, width: 30 }}>{star} ★</span>
                    <div style={{ flex: 1, height: 8, background: theme.color.surfaceAlt, borderRadius: 4 }}>
                      <div
                        style={{
                          width: `${(c / maxHist) * 100}%`,
                          height: '100%',
                          background: theme.color.accent,
                          borderRadius: 4,
                        }}
                      />
                    </div>
                    <span style={{ fontSize: 12, color: theme.color.textMuted, width: 28 }}>{c}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {reviews.length === 0 && (
              <p style={{ color: theme.color.textMuted, fontSize: 14 }}>
                אין עדיין ביקורות — היו הראשונים לשתף.
              </p>
            )}
            {reviews.map((r) => (
              <div
                key={r.id}
                style={{
                  border: `1px solid ${theme.color.border}`,
                  borderRadius: theme.radius.md,
                  padding: 16,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Stars value={r.stars} size={14} />
                  <span style={{ fontSize: 13, color: theme.color.textMuted }}>
                    {r.displayName || 'אנונימי'}
                  </span>
                </div>
                {r.comment && (
                  <p style={{ margin: '0 0 8px', fontSize: 14.5, lineHeight: 1.6, color: theme.color.black }}>
                    {r.comment}
                  </p>
                )}
                <button
                  style={{
                    cursor: 'pointer',
                    border: 'none',
                    background: 'transparent',
                    color: theme.color.secondary,
                    fontSize: 13,
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  👍 עזר לי ({r.helpfulCount})
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Trust footer */}
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            marginTop: 22,
            flexWrap: 'wrap',
          }}
        >
          <button style={reportBtn}>🚩 דווחו על בעיה / קישור שבור</button>
        </div>
      </div>
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #DDE4E9',
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.card,
  padding: 24,
  marginTop: 18,
};

const sectionTitle: React.CSSProperties = {
  margin: '0 0 14px',
  fontSize: 18,
  fontWeight: 800,
  color: theme.color.primary,
};

const metaLabel: React.CSSProperties = {
  fontSize: 12,
  color: theme.color.textMuted,
  marginBottom: 3,
};

const helpfulBtn: React.CSSProperties = {
  cursor: 'pointer',
  border: `1.5px solid ${theme.color.accent}`,
  background: '#fff',
  color: theme.color.primary,
  fontWeight: 700,
  fontSize: 14,
  padding: '9px 22px',
  borderRadius: theme.radius.pill,
};

const reportBtn: React.CSSProperties = {
  cursor: 'pointer',
  border: `1px solid ${theme.color.border}`,
  background: '#fff',
  color: theme.color.textMuted,
  fontWeight: 600,
  fontSize: 13.5,
  padding: '9px 20px',
  borderRadius: theme.radius.pill,
};
