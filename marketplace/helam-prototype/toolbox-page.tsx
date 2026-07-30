import { useMemo, useState } from 'react';
import { theme } from './theme.js';
import { APPS, TAGS } from './mock.js';
import { AppCard } from './app-card.js';
import { PageShell, Hero, Container, Button } from './ui.js';

type SortKey = 'rating' | 'clicks';

/** Toolbox catalog — the evolved coping-apps marketplace. */
export function ToolboxPage() {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('rating');

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
    <PageShell>
      <Hero
        eyebrow="ארגז הכלים"
        title="אפליקציות שעוזרות באמת להתמודד"
        subtitle="קטלוג מדורג ומסונן של אפליקציות התמודדות, שנבחרו ומדורגות ע״י קהילת הלם קלאב. גלישה חופשית — בלי הרשמה."
      >
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button to="/toolbox/submit" variant="accent">➕ הגשת כלי</Button>
          <Button to="/toolbox/wishlist" variant="ghost">💡 רשימת משאלות</Button>
        </div>
      </Hero>

      <Container style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: theme.color.primary }}>{filtered.length} אפליקציות</h2>
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
                  fontFamily: 'inherit',
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
                  fontFamily: 'inherit',
                }}
              >
                {t.name}
              </button>
            );
          })}
        </div>
      </Container>

      <Container style={{ padding: '0 20px 64px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
          {filtered.map((app) => (
            <AppCard key={app.id} app={app} />
          ))}
        </div>
      </Container>
    </PageShell>
  );
}
