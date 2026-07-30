import { useMemo, useState } from 'react';
import { theme } from './theme.js';
import { PageShell, Hero, Section, Chip, Badge } from './ui.js';
import { GALLERY, type GalleryItem } from './ecosystem-mock.js';

/** PTSDART visual gallery — masonry discovery + lightbox. */
export function GalleryPage() {
  const [active, setActive] = useState<string[]>([]);
  const [selected, setSelected] = useState<GalleryItem | null>(null);
  const domains = useMemo(() => Array.from(new Set(GALLERY.flatMap((g) => g.domains))), []);
  const items = GALLERY.filter((g) => (active.length === 0 ? true : active.some((d) => g.domains.includes(d))));
  const toggle = (d: string) => setActive((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));

  return (
    <PageShell>
      <Hero eyebrow="גלריית PTSDART" title="אמנות מתוך החוויה" subtitle="גילוי של תמונות ויצירות מהקהילה — ביטוי אישי של ההתמודדות, מתויג לפי תחום." />
      <Section title={`${items.length} יצירות`}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {domains.map((d) => (
            <Chip key={d} label={d} active={active.includes(d)} onClick={() => toggle(d)} tone="amber" />
          ))}
        </div>
        <div style={{ columnWidth: 240, columnGap: 16, paddingBottom: 44 }}>
          {items.map((g) => (
            <button
              key={g.slug}
              onClick={() => setSelected(g)}
              style={{ display: 'block', width: '100%', marginBottom: 16, border: 'none', padding: 0, background: 'none', cursor: 'pointer', breakInside: 'avoid', borderRadius: theme.radius.md, overflow: 'hidden', boxShadow: theme.shadow.card }}
            >
              <div style={{ position: 'relative' }}>
                <img src={g.url} alt={g.title} style={{ width: '100%', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 12, background: 'linear-gradient(0deg, rgba(11,26,48,0.7), transparent 55%)', color: '#fff', textAlign: 'start' }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{g.title}</div>
                  <div style={{ fontSize: 12.5, opacity: 0.85 }}>{g.artist}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Section>

      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(11,26,48,0.86)', zIndex: 100, display: 'grid', placeItems: 'center', padding: 20 }}
        >
          <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720, width: '100%', background: theme.color.white, borderRadius: theme.radius.md, overflow: 'hidden' }}>
            <img src={selected.url} alt={selected.title} style={{ width: '100%', maxHeight: '65vh', objectFit: 'cover' }} />
            <div style={{ padding: 20 }}>
              <h2 style={{ margin: '0 0 4px', color: theme.color.primary, fontSize: 22 }}>{selected.title}</h2>
              <p style={{ margin: '0 0 12px', color: theme.color.textMuted }}>{selected.artist}</p>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selected.domains.map((d) => <Badge key={d} tone="info">{d}</Badge>)}
              </div>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
