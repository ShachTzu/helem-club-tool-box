import { useMemo, useState } from 'react';
import { theme } from './theme.js';
import { APPS, TAGS } from './mock.js';
import { AppCard } from './app-card.js';

type SortKey = 'rating' | 'clicks';

/** Marketplace home — hero, filter bar, and the app grid. */
export function HomePage() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('rating');

  // Only show tags that have at least one published app (spec rule).
  const visibleTags = useMemo(() => TAGS.filter((t) => t.count > 0), []);

  const filtered = useMemo(() => {
    let list = APPS.filter((a) =>
      activeTags.length === 0 ? true : activeTags.every((t) => a.tags.includes(t))
    );
    list = [...list].sort((a, b) =>
      sort === 'rating' ? b.avgRating - a.avgRating : b.clickCount - a.clickCount
    );
    return list;
  }, [activeTags, sort]);

  const toggleTag = (name: string) =>
    setActiveTags((prev) => (prev.includes(name) ? prev.filter((t) => t !== name) : [...prev, name]));

  return (
    <div style={{ background: theme.color.surface, minHeight: '100vh' }}>
      {/* Hero */}
      <section
        style={{
          background: `linear-gradient(160deg, ${theme.color.primary} 0%, #12294a 100%)`,
          color: theme.color.white,
          padding: '56px 20px 64px',
        }}
      >
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <h1 style={{ fontSize: 38, fontWeight: 800, margin: '0 0 14px', lineHeight: 1.2 }}>
            אפליקציות שעוזרות באמת להתמודד
          </h1>
          <p style={{ fontSize: 18, opacity: 0.85, margin: 0, lineHeight: 1.6 }}>
            קטלוג מדורג ומסונן של אפליקציות התמודדות, שנבחרו ומדורגות ע"י קהילת הלם קלאב.
            גלישה חופשית לגמרי — בלי הרשמה.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '24px 20px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: theme.color.primary }}>
            {filtered.length} אפליקציות
          </h2>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['rating', 'clicks'] as SortKey[]).map((key) => (
              <button
                key={key}
                onClick={() => setSort(key)}
                style={{
                  cursor: 'pointer',
                  border: `1px solid ${sort === key ? theme.color.accent : theme.color.border}`,
                  background: sort === key ? 'rgba(232,159,75,0.12)' : theme.color.white,
                  color: sort === key ? theme.color.primary : theme.color.textMuted,
                  fontWeight: 700,
                  fontSize: 13.5,
                  padding: '9px 16px',
                  borderRadius: theme.radius.pill,
                }}
              >
                {key === 'rating' ? '⭐ לפי דירוג' : '👆 לפי קליקים'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 26 }}>
          {visibleTags.map((t) => {
            const active = activeTags.includes(t.name);
            return (
              <button
                key={t.name}
                onClick={() => toggleTag(t.name)}
                style={{
                  cursor: 'pointer',
                  border: `1px solid ${active ? theme.color.secondary : theme.color.border}`,
                  background: active ? theme.color.secondary : theme.color.white,
                  color: active ? theme.color.white : theme.color.secondary,
                  fontWeight: 600,
                  fontSize: 13,
                  padding: '7px 14px',
                  borderRadius: theme.radius.pill,
                  transition: 'all .15s ease',
                }}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 20px 64px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}
        >
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </div>
    </div>
  );
}
