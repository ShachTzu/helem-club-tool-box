import { theme } from './theme.js';
import { PageShell, Hero, Section, Card, Badge } from './ui.js';
import { TAGS } from './mock.js';
import { POSTS, RECORDS, EVENTS, GALLERY } from './ecosystem-mock.js';
import { domainSlug } from './domain-page.js';

/** Count how many content items across the ecosystem carry a domain. */
function countForDomain(name: string) {
  const apps = TAGS.find((t) => t.name === name)?.count ?? 0;
  const posts = POSTS.filter((p) => p.domains.includes(name)).length;
  const records = RECORDS.filter((r) => r.domains.includes(name)).length;
  const events = EVENTS.filter((e) => e.domains.includes(name)).length;
  const gallery = GALLERY.filter((g) => g.domains.includes(name)).length;
  return { apps, posts, records, events, gallery, total: apps + posts + records + events + gallery };
}

/** Cross-cutting domains lobby — shows all 14 domains and their reach. */
export function DomainsPage() {
  return (
    <PageShell>
      <Hero
        eyebrow="שכבה רוחבית"
        title="תחומי התמודדות"
        subtitle="14 דומיינים שחוצים את כל האקוסיסטם. כל כתבה, כלי, אירוע ותוכן מתויגים לפיהם — כדי שתמצאו בדיוק את מה שרלוונטי לכם."
      />
      <Section title="הדומיינים" subtitle="לחצו על תחום כדי לראות את כל התוכן הקשור אליו">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, paddingBottom: 44 }}>
          {TAGS.map((t) => {
            const c = countForDomain(t.name);
            return (
              <Card key={t.name} to={`/domains/${domainSlug(t.name)}`} style={{ padding: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: theme.color.primary, lineHeight: 1.35 }}>{t.name}</h3>
                  <Badge tone="accent">{c.total}</Badge>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, fontSize: 12.5 }}>
                  <Stat icon="🧰" n={c.apps} label="כלים" />
                  <Stat icon="📝" n={c.posts} label="כתבות" />
                  <Stat icon="📚" n={c.records} label="תכנים" />
                  <Stat icon="📅" n={c.events} label="אירועים" />
                  <Stat icon="🎨" n={c.gallery} label="יצירות" />
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </PageShell>
  );
}

function Stat({ icon, n, label }: { icon: string; n: number; label: string }) {
  if (n === 0) return null;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, background: theme.color.surface, border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.pill, padding: '4px 10px', color: theme.color.secondary, fontWeight: 600 }}>
      {icon} {n} {label}
    </span>
  );
}
