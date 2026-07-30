import { useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { theme } from './theme.js';
import { PageShell, Container, Hero, Section, Card, Chip, Badge } from './ui.js';
import { LABELS, RECORDS, type KbRecord } from './ecosystem-mock.js';
import { NotContent } from './blog-page.js';

/** A media record card. */
export function RecordCard({ record }: { record: KbRecord }) {
  return (
    <Card to={`/knowledge/record/${record.slug}`} style={{ overflow: 'hidden' }}>
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <img src={record.thumbnail} alt={record.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(11,26,48,0.28)', fontSize: 40, color: '#fff' }}>
          {record.mediaType === 'video' ? '▶' : '🎧'}
        </span>
        <span style={{ position: 'absolute', bottom: 8, insetInlineEnd: 8, background: 'rgba(11,26,48,0.8)', color: '#fff', fontSize: 12, fontWeight: 700, padding: '3px 8px', borderRadius: 6 }}>
          {record.duration}
        </span>
      </div>
      <div style={{ padding: 16 }}>
        <div style={{ marginBottom: 8 }}>
          <Badge tone={record.mediaType === 'video' ? 'info' : 'accent'}>
            {record.mediaType === 'video' ? '🎬 וידאו' : '🎧 אודיו'}
          </Badge>
        </div>
        <h3 style={{ margin: '0 0 6px', fontSize: 16.5, fontWeight: 800, color: theme.color.primary, lineHeight: 1.35 }}>{record.title}</h3>
        <p style={{ margin: '0 0 8px', fontSize: 13.5, color: theme.color.textMuted, lineHeight: 1.5 }}>{record.description}</p>
        <div style={{ fontSize: 12, color: theme.color.textMuted }}>{record.views.toLocaleString('he-IL')} צפיות</div>
      </div>
    </Card>
  );
}

/** Knowledge base lobby — labels + recent records. */
export function KnowledgePage() {
  return (
    <PageShell>
      <Hero eyebrow="ה-Mother Ship" title="מאגר הידע" subtitle="סדרות וידאו, הקלטות והרצאות — מאורגנות בפרויקטים ומתויגות לפי תחום. הכל במקום אחד, נגיש בכל רגע." />
      <Section title="הפרויקטים" subtitle="חמש הסדרות המרכזיות של הלם קלאב">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 18 }}>
          {LABELS.map((l) => (
            <Card key={l.slug} to={`/knowledge/${l.slug}`} style={{ overflow: 'hidden' }}>
              <div style={{ position: 'relative', aspectRatio: '16/10', overflow: 'hidden' }}>
                <img src={l.cover} alt={l.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(11,26,48,0.75), rgba(11,26,48,0.1))' }} />
                <div style={{ position: 'absolute', bottom: 12, insetInline: 14, color: '#fff' }}>
                  <div style={{ fontSize: 26 }}>{l.icon}</div>
                  <div style={{ fontSize: 18, fontWeight: 800 }}>{l.name}</div>
                </div>
              </div>
              <div style={{ padding: 16 }}>
                <p style={{ margin: '0 0 8px', fontSize: 13.5, color: theme.color.textMuted, lineHeight: 1.5 }}>{l.description}</p>
                <span style={{ fontSize: 12.5, fontWeight: 700, color: theme.color.secondary }}>{l.recordCount} תכנים ←</span>
              </div>
            </Card>
          ))}
        </div>
      </Section>
      <Section title="נוסף לאחרונה" style={{ paddingTop: 0, paddingBottom: 56 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18 }}>
          {RECORDS.slice(0, 6).map((r) => (
            <RecordCard key={r.slug} record={r} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

/** A label lobby — one project and its records. */
export function LabelPage() {
  const { labelSlug } = useParams();
  const label = LABELS.find((l) => l.slug === labelSlug);
  const [active, setActive] = useState<string[]>([]);
  const records = useMemo(() => RECORDS.filter((r) => r.labelSlug === labelSlug), [labelSlug]);
  const domains = useMemo(() => Array.from(new Set(records.flatMap((r) => r.domains))), [records]);
  const filtered = records.filter((r) => (active.length === 0 ? true : active.some((d) => r.domains.includes(d))));
  if (!label) return <NotContent label="הפרויקט לא נמצא" />;

  const toggle = (d: string) => setActive((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));

  return (
    <PageShell>
      <Hero eyebrow={`${label.icon} פרויקט`} title={label.name} subtitle={label.description} />
      <Section title={`${filtered.length} תכנים`}>
        {domains.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
            {domains.map((d) => (
              <Chip key={d} label={d} active={active.includes(d)} onClick={() => toggle(d)} />
            ))}
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 18, paddingBottom: 40 }}>
          {filtered.map((r) => (
            <RecordCard key={r.slug} record={r} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}

/** Record detail with embedded player + engagement. */
export function RecordPage() {
  const { slug } = useParams();
  const record = RECORDS.find((r) => r.slug === slug);
  if (!record) return <NotContent label="התוכן לא נמצא" />;
  const label = LABELS.find((l) => l.slug === record.labelSlug);
  const related = RECORDS.filter((r) => r.slug !== record.slug && r.domains.some((d) => record.domains.includes(d))).slice(0, 3);

  return (
    <PageShell>
      <Container style={{ padding: '28px 20px 60px', maxWidth: 900 }}>
        <Link to={`/knowledge/${record.labelSlug}`} style={{ color: theme.color.secondary, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>← {label?.name}</Link>
        <div style={{ aspectRatio: '16/9', background: theme.color.primary, borderRadius: theme.radius.md, overflow: 'hidden', margin: '18px 0', position: 'relative' }}>
          <img src={record.thumbnail} alt={record.title} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.55 }} />
          <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 64, color: '#fff' }}>
            {record.mediaType === 'video' ? '▶' : '🎧'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
          {record.domains.map((d) => <Badge key={d} tone="info">{d}</Badge>)}
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: theme.color.primary, margin: '0 0 10px' }}>{record.title}</h1>
        <p style={{ fontSize: 16, color: theme.color.textMuted, lineHeight: 1.7 }}>{record.description}</p>
        <div style={{ fontSize: 13, color: theme.color.textMuted }}>{record.views.toLocaleString('he-IL')} צפיות · {record.duration}</div>

        {related.length > 0 && (
          <>
            <h2 style={{ fontSize: 21, fontWeight: 800, color: theme.color.primary, margin: '34px 0 16px' }}>תכנים קשורים</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
              {related.map((r) => <RecordCard key={r.slug} record={r} />)}
            </div>
          </>
        )}
      </Container>
    </PageShell>
  );
}
