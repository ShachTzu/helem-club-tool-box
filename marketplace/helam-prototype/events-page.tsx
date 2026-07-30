import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { theme } from './theme.js';
import { PageShell, Container, Hero, Section, Card, Badge, Button } from './ui.js';
import { EVENTS, type Event } from './ecosystem-mock.js';
import { NotContent } from './blog-page.js';

/** A single event card. */
export function EventCard({ event }: { event: Event }) {
  return (
    <Card to={`/events/${event.slug}`} style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img src={event.cover} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', top: 10, insetInlineStart: 10 }}>
          <Badge tone="accent">{event.type}</Badge>
        </span>
      </div>
      <div style={{ padding: 18, flex: 1 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 800, color: theme.color.primary, lineHeight: 1.35 }}>{event.title}</h3>
        <p style={{ margin: '0 0 14px', fontSize: 14, color: theme.color.textMuted, lineHeight: 1.5 }}>{event.description}</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 13.5, color: theme.color.secondary, fontWeight: 600 }}>
          <span>📅 {event.date} · {event.time}</span>
          <span>{event.isOnline ? '💻' : '📍'} {event.location}</span>
        </div>
      </div>
    </Card>
  );
}

/** Events listing with upcoming/past tabs. */
export function EventsPage() {
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');
  const list = useMemo(() => EVENTS.filter((e) => (tab === 'upcoming' ? !e.past : e.past)), [tab]);
  return (
    <PageShell>
      <Hero eyebrow="הלב הפועם של הקהילה" title="אירועים קהילתיים" subtitle="שולחנות עגולים, וובינרים ומפגשים — פיזיים ודיגיטליים. בעלי מקצוע תורמים ידע, והתכנים הופכים לחלק מהמאגר." />
      <Section>
        <div style={{ display: 'flex', gap: 8, marginBottom: 26 }}>
          {(['upcoming', 'past'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                background: tab === t ? theme.color.primary : theme.color.white,
                color: tab === t ? theme.color.white : theme.color.secondary,
                border: `1px solid ${tab === t ? theme.color.primary : theme.color.border}`,
                borderRadius: theme.radius.pill,
                padding: '9px 22px',
                fontWeight: 700,
                fontSize: 14.5,
                cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              {t === 'upcoming' ? 'אירועים קרובים' : 'אירועים שהיו'}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 18, paddingBottom: 40 }}>
          {list.map((e) => (
            <EventCard key={e.slug} event={e} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

/** Event detail page. */
export function EventPage() {
  const { slug } = useParams();
  const event = EVENTS.find((e) => e.slug === slug);
  if (!event) return <NotContent label="האירוע לא נמצא" />;
  return (
    <PageShell>
      <Container style={{ padding: '28px 20px 60px', maxWidth: 860 }}>
        <Link to="/events" style={{ color: theme.color.secondary, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← חזרה לאירועים</Link>
        <img src={event.cover} alt={event.title} style={{ width: '100%', aspectRatio: '21/9', objectFit: 'cover', borderRadius: theme.radius.md, margin: '18px 0' }} />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          <Badge tone="accent">{event.type}</Badge>
          {event.domains.map((d) => <Badge key={d} tone="info">{d}</Badge>)}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 800, color: theme.color.primary, margin: '0 0 14px' }}>{event.title}</h1>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 14, background: theme.color.white, border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.md, padding: 20, marginBottom: 22 }}>
          <Info label="תאריך" value={`${event.date}`} />
          <Info label="שעה" value={event.time} />
          <Info label="מיקום" value={event.location} />
          <Info label="פורמט" value={event.isOnline ? 'מקוון' : 'פרונטלי'} />
        </div>
        <p style={{ fontSize: 16.5, color: theme.color.black, lineHeight: 1.8 }}>{event.description}</p>
        <p style={{ fontSize: 15.5, color: theme.color.textMuted, lineHeight: 1.8 }}>
          המפגש פתוח לקהילה. בעלי מקצוע תורמים ידע, והתוכן מוקלט ומתועד — כך שהאירוע ממשיך להניב ערך גם אחרי שהסתיים.
        </p>
        {!event.past ? (
          <div style={{ marginTop: 24 }}>
            <Button variant="accent" size="lg">✅ אני מגיע/ה (RSVP)</Button>
          </div>
        ) : (
          <div style={{ marginTop: 24, background: theme.color.surface, borderRadius: theme.radius.md, padding: 20 }}>
            <strong style={{ color: theme.color.primary }}>🎬 הקלטת האירוע</strong>
            <p style={{ margin: '6px 0 12px', color: theme.color.textMuted, fontSize: 14 }}>ההקלטה נוספה למאגר הידע וזמינה לצפייה.</p>
            <Button to="/knowledge" variant="primary">צפייה במאגר</Button>
          </div>
        )}
      </Container>
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div style={{ fontSize: 12.5, color: theme.color.textMuted, fontWeight: 600, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 15.5, color: theme.color.primary, fontWeight: 700 }}>{value}</div>
    </div>
  );
}
