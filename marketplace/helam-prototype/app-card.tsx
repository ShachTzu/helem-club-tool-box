import { Link } from 'react-router-dom';
import type { App } from './types.js';
import { theme } from './theme.js';
import { Stars } from './stars.js';

/** A single marketplace app card in the grid. */
export function AppCard({ app }: { app: App }) {
  return (
    <Link
      to={`/app/${app.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        background: theme.color.white,
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadow.card,
        overflow: 'hidden',
        transition: 'transform .18s ease, box-shadow .18s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = theme.shadow.cardHover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = theme.shadow.card;
      }}
    >
      <div style={{ padding: 18, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
        <div
          style={{
            width: 58,
            height: 58,
            borderRadius: 16,
            background: theme.color.surfaceAlt,
            display: 'grid',
            placeItems: 'center',
            fontSize: 30,
            flexShrink: 0,
          }}
        >
          {app.icon}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: theme.color.primary }}>
              {app.name}
            </h3>
            {app.isFeatured && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: theme.color.accent,
                  background: 'rgba(232,159,75,0.12)',
                  padding: '2px 8px',
                  borderRadius: theme.radius.pill,
                }}
              >
                מומלץ ע"י הקהילה
              </span>
            )}
          </div>
          <p
            style={{
              margin: '4px 0 0',
              fontSize: 13.5,
              color: theme.color.textMuted,
              lineHeight: 1.4,
            }}
          >
            {app.subtitle}
          </p>
        </div>
      </div>

      <div style={{ padding: '0 18px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {app.tags.slice(0, 3).map((t) => (
          <span
            key={t}
            style={{
              fontSize: 12,
              color: theme.color.secondary,
              background: theme.color.surface,
              border: `1px solid ${theme.color.border}`,
              padding: '3px 10px',
              borderRadius: theme.radius.pill,
            }}
          >
            {t}
          </span>
        ))}
      </div>

      <div
        style={{
          marginTop: 'auto',
          padding: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {app.ratingCount > 0 ? (
            <>
              <Stars value={app.avgRating} />
              <span style={{ fontSize: 13, color: theme.color.textMuted }}>
                {app.avgRating.toFixed(1)} ({app.ratingCount})
              </span>
            </>
          ) : (
            <span style={{ fontSize: 12.5, color: theme.color.textMuted }}>
              אין עדיין ביקורות — היו הראשונים
            </span>
          )}
        </div>
        <span style={{ fontSize: 12.5, color: theme.color.textMuted }}>
          👆 {app.clickCount.toLocaleString('he-IL')}
        </span>
      </div>
    </Link>
  );
}
