import { Link } from 'react-router-dom';
import { theme } from './theme.js';
import { PageShell, Container, Hero, Section, Card, Button } from './ui.js';
import { LABELS, POSTS, EVENTS } from './ecosystem-mock.js';
import { PostCard } from './blog-page.js';
import { EventCard } from './events-page.js';
import { CommunityWisdom } from './community-wisdom.js';

const PILLARS = [
  { icon: '🧰', title: 'ארגז כלים', desc: 'קטלוג אפליקציות התמודדות מדורג ומסונן.', to: '/toolbox' },
  { icon: '📚', title: 'מאגר ידע', desc: 'סדרות וידאו, הקלטות והרצאות לפי נושא.', to: '/knowledge' },
  { icon: '📝', title: 'בלוג', desc: 'ידע מקצועי ושיתופים אישיים מהקהילה.', to: '/blog' },
  { icon: '📅', title: 'אירועים קהילתיים', desc: 'שולחנות עגולים, וובינרים ומפגשים.', to: '/events' },
  { icon: '🎨', title: 'גלריית PTSDART', desc: 'אמנות ויצירה מתוך החוויה האישית.', to: '/gallery' },
  { icon: '🧭', title: 'תחומי התמודדות', desc: '14 דומיינים שחוצים את כל התוכן.', to: '/domains' },
];

/** Ecosystem landing page — the Mother Ship home. */
export function LandingPage() {
  return (
    <PageShell>
      <Hero
        eyebrow="האקוסיסטם הדיגיטלי של הלם קלאב"
        title="מקום אחד, מסודר ונגיש — לכל מי שמתמודד"
        subtitle="חממה שמאגדת ידע, כלים וחוויות אישיות, ומזמינה השתתפות פעילה שמקדמת תהליכי שיקום אמיתיים."
      >
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button to="/toolbox" variant="accent" size="lg">גלו את ארגז הכלים</Button>
          <Button to="/knowledge" variant="ghost" size="lg">למאגר הידע</Button>
        </div>
      </Hero>

      {/* Pillars */}
      <Section title="האקוסיסטם" subtitle="חמישה רכיבים שנבנים על בסיס ידע מרכזי אחד">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 18,
          }}
        >
          {PILLARS.map((p) => (
            <Card key={p.to} to={p.to} style={{ padding: 22 }}>
              <div style={{ fontSize: 34, marginBottom: 12 }}>{p.icon}</div>
              <h3 style={{ margin: '0 0 6px', fontSize: 19, fontWeight: 800, color: theme.color.primary }}>
                {p.title}
              </h3>
              <p style={{ margin: 0, color: theme.color.textMuted, fontSize: 14.5, lineHeight: 1.5 }}>
                {p.desc}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Community wisdom — the central unified knowledge hub */}
      <CommunityWisdom compact />

      {/* Knowledge labels preview */}
      <Section
        title="מאגר הידע"
        subtitle="הסדרות והפרויקטים המרכזיים"
        action={<Link to="/knowledge" style={{ color: theme.color.secondary, fontWeight: 700, textDecoration: 'none' }}>לכל המאגר ←</Link>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {LABELS.slice(0, 5).map((l) => (
            <Card key={l.slug} to={`/knowledge/${l.slug}`} style={{ padding: 20, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>{l.icon}</div>
              <h3 style={{ margin: '0 0 6px', fontSize: 17, fontWeight: 800, color: theme.color.primary }}>{l.name}</h3>
              <p style={{ margin: 0, fontSize: 13, color: theme.color.textMuted }}>{l.recordCount} תכנים</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Latest blog */}
      <Section
        title="מהבלוג"
        subtitle="ידע מקצועי ושיתופים אישיים"
        action={<Link to="/blog" style={{ color: theme.color.secondary, fontWeight: 700, textDecoration: 'none' }}>לכל הכתבות ←</Link>}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {POSTS.slice(0, 3).map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </Section>

      {/* Upcoming events */}
      <Section
        title="אירועים קרובים"
        action={<Link to="/events" style={{ color: theme.color.secondary, fontWeight: 700, textDecoration: 'none' }}>לכל האירועים ←</Link>}
        style={{ paddingBottom: 64 }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
          {EVENTS.filter((e) => !e.past).slice(0, 3).map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
