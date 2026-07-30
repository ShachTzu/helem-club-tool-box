import { useParams, Link } from 'react-router-dom';
import { theme } from './theme.js';
import { PageShell, Hero, Section } from './ui.js';
import { APPS, TAGS } from './mock.js';
import { POSTS, RECORDS, EVENTS, GALLERY } from './ecosystem-mock.js';
import { AppCard } from './app-card.js';
import { PostCard } from './blog-page.js';
import { RecordCard } from './knowledge-page.js';
import { EventCard } from './events-page.js';
import { NotContent } from './blog-page.js';

/** Decode a domain slug back to its Hebrew name (slug = encoded name). */
export function domainSlug(name: string) {
  return encodeURIComponent(name);
}

/** Aggregated view of ALL ecosystem content tagged with a single domain. */
export function DomainPage() {
  const { slug } = useParams();
  const name = slug ? decodeURIComponent(slug) : '';
  const exists = TAGS.some((t) => t.name === name);
  if (!exists) return <NotContent label="התחום לא נמצא" />;

  const apps = APPS.filter((a) => a.tags.includes(name));
  const posts = POSTS.filter((p) => p.domains.includes(name));
  const records = RECORDS.filter((r) => r.domains.includes(name));
  const events = EVENTS.filter((e) => e.domains.includes(name));
  const gallery = GALLERY.filter((g) => g.domains.includes(name));
  const total = apps.length + posts.length + records.length + events.length + gallery.length;

  return (
    <PageShell>
      <Hero
        eyebrow="תחום התמודדות"
        title={name}
        subtitle={`כל התוכן באקוסיסטם שמתויג בתחום זה — ${total} פריטים מכל חלקי הלם קלאב.`}
      />

      <div style={{ background: theme.color.white, borderBottom: `1px solid ${theme.color.border}` }}>
        <div style={{ maxWidth: 1180, margin: '0 auto', padding: '14px 20px', display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 14, fontWeight: 700, color: theme.color.secondary }}>
          <Link to="/domains" style={{ color: theme.color.secondary, textDecoration: 'none' }}>← כל התחומים</Link>
          {apps.length > 0 && <span>🧰 {apps.length} כלים</span>}
          {posts.length > 0 && <span>📝 {posts.length} כתבות</span>}
          {records.length > 0 && <span>📚 {records.length} תכני מאגר</span>}
          {events.length > 0 && <span>📅 {events.length} אירועים</span>}
          {gallery.length > 0 && <span>🎨 {gallery.length} יצירות</span>}
        </div>
      </div>

      {apps.length > 0 && (
        <Section title="🧰 כלים מארגז הכלים">
          <Grid>{apps.map((a) => <AppCard key={a.id} app={a} />)}</Grid>
        </Section>
      )}
      {posts.length > 0 && (
        <Section title="📝 כתבות מהבלוג">
          <Grid>{posts.map((p) => <PostCard key={p.slug} post={p} />)}</Grid>
        </Section>
      )}
      {records.length > 0 && (
        <Section title="📚 תכנים ממאגר הידע">
          <Grid>{records.map((r) => <RecordCard key={r.slug} record={r} />)}</Grid>
        </Section>
      )}
      {events.length > 0 && (
        <Section title="📅 אירועים">
          <Grid>{events.map((e) => <EventCard key={e.slug} event={e} />)}</Grid>
        </Section>
      )}
      {gallery.length > 0 && (
        <Section title="🎨 גלריית PTSDART" style={{ paddingBottom: 56 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {gallery.map((g) => (
              <div key={g.slug} style={{ borderRadius: theme.radius.md, overflow: 'hidden', boxShadow: theme.shadow.card }}>
                <img src={g.url} alt={g.title} style={{ width: '100%', display: 'block', aspectRatio: '1', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
        </Section>
      )}

      {total === 0 && <NotContent label="אין עדיין תוכן בתחום זה" />}
    </PageShell>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
      {children}
    </div>
  );
}
