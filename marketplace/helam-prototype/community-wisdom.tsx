import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { theme } from './theme.js';
import { TAGS, APPS } from './mock.js';
import { POSTS, RECORDS, EVENTS, GALLERY } from './ecosystem-mock.js';

/** A content channel a wisdom item can come from. */
export type Channel = 'app' | 'post' | 'record' | 'event' | 'gallery';

/** Normalized item that unifies every content type in the ecosystem. */
export type WisdomItem = {
  id: string;
  channel: Channel;
  title: string;
  desc: string;
  image?: string;
  emoji?: string;
  to: string;
  domains: string[];
  meta: string;
  score: number;
};

const CHANNEL_META: Record<Channel, { label: string; icon: string; color: string }> = {
  app: { label: 'כלים', icon: '🧰', color: '#E89F4B' },
  post: { label: 'כתבות', icon: '📝', color: '#4F6D7A' },
  record: { label: 'מאגר ידע', icon: '📚', color: '#5B8A72' },
  event: { label: 'אירועים', icon: '📅', color: '#B0578D' },
  gallery: { label: 'גלריה', icon: '🎨', color: '#8367C7' },
};

/** Merge every content type into one normalized, ranked feed. */
function buildFeed(): WisdomItem[] {
  const items: WisdomItem[] = [
    ...APPS.map((a) => ({
      id: `app-${a.id}`,
      channel: 'app' as const,
      title: a.name,
      desc: a.subtitle,
      emoji: a.icon,
      to: `/app/${a.id}`,
      domains: a.tags,
      meta: `⭐ ${a.avgRating} · ${a.clickCount.toLocaleString('he-IL')} כניסות`,
      score: a.clickCount + a.avgRating * 200,
    })),
    ...POSTS.map((p) => ({
      id: `post-${p.slug}`,
      channel: 'post' as const,
      title: p.title,
      desc: p.excerpt,
      image: p.cover,
      to: `/blog/${p.slug}`,
      domains: p.domains,
      meta: `${p.author} · ${p.readTime}`,
      score: 700,
    })),
    ...RECORDS.map((r) => ({
      id: `rec-${r.slug}`,
      channel: 'record' as const,
      title: r.title,
      desc: r.description,
      image: r.thumbnail,
      to: `/knowledge/record/${r.slug}`,
      domains: r.domains,
      meta: `${r.mediaType === 'video' ? '🎬' : '🎧'} ${r.duration} · ${r.views.toLocaleString('he-IL')} צפיות`,
      score: r.views,
    })),
    ...EVENTS.map((e) => ({
      id: `ev-${e.slug}`,
      channel: 'event' as const,
      title: e.title,
      desc: e.description,
      image: e.cover,
      to: `/events/${e.slug}`,
      domains: e.domains,
      meta: `${e.date} · ${e.location}`,
      score: e.past ? 300 : 900,
    })),
    ...GALLERY.map((g) => ({
      id: `gal-${g.slug}`,
      channel: 'gallery' as const,
      title: g.title,
      desc: `יצירה מאת ${g.artist}`,
      image: g.url,
      to: '/gallery',
      domains: g.domains,
      meta: g.artist,
      score: 250,
    })),
  ];
  return items.sort((a, b) => b.score - a.score);
}

type SortKey = 'relevant' | 'fresh';

/**
 * "חוכמת הקהילה" — the central hub that unifies knowledge from every
 * channel (tools, articles, knowledge base, events, gallery) with
 * elegant smart filters by content type and coping domain.
 */
export function CommunityWisdom({ compact = false }: { compact?: boolean }) {
  const feed = useMemo(buildFeed, []);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('relevant');
  const [query, setQuery] = useState('');

  const toggleChannel = (c: Channel) =>
    setChannels((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  const toggleDomain = (d: string) =>
    setDomains((p) => (p.includes(d) ? p.filter((x) => x !== d) : [...p, d]));

  const filtered = useMemo(() => {
    let list = feed.filter((it) => {
      const okChannel = channels.length === 0 || channels.includes(it.channel);
      const okDomain = domains.length === 0 || domains.some((d) => it.domains.includes(d));
      const okQuery =
        query.trim() === '' ||
        it.title.includes(query.trim()) ||
        it.desc.includes(query.trim());
      return okChannel && okDomain && okQuery;
    });
    if (sort === 'fresh') list = [...list].reverse();
    return compact ? list.slice(0, 8) : list;
  }, [feed, channels, domains, query, sort, compact]);

  const activeCount = channels.length + domains.length + (query ? 1 : 0);

  return (
    <div style={{ background: compact ? theme.color.white : theme.color.surface, borderBlock: compact ? `1px solid ${theme.color.border}` : undefined }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: compact ? '44px 20px' : '36px 20px 64px' }}>
        {/* Header */}
        <div style={{ textAlign: compact ? 'center' : 'start', marginBottom: 22 }}>
          <div style={{ color: theme.color.accent, fontWeight: 700, fontSize: 14, marginBottom: 8 }}>
            🌿 הידע של כולנו, במקום אחד
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: 28, fontWeight: 800, color: theme.color.primary }}>
            חוכמת הקהילה
          </h2>
          <p style={{ margin: 0, color: theme.color.textMuted, fontSize: 15.5, lineHeight: 1.6, maxWidth: compact ? 620 : 720, marginInline: compact ? 'auto' : undefined }}>
            כל הידע מכל הערוצים — כלים, כתבות, סרטונים, אירועים ויצירה — מרוכז וניתן לסינון חכם לפי סוג תוכן ותחום התמודדות.
          </p>
        </div>

        {/* Search + sort */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', marginBottom: 16 }}>
          <div style={{ position: 'relative', flex: '1 1 260px' }}>
            <span style={{ position: 'absolute', insetInlineStart: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 15, opacity: 0.6 }}>🔍</span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש בכל הידע של הקהילה..."
              style={{
                width: '100%',
                boxSizing: 'border-box',
                border: `1px solid ${theme.color.border}`,
                borderRadius: theme.radius.pill,
                padding: '12px 42px',
                fontSize: 15,
                fontFamily: 'inherit',
                background: theme.color.white,
                color: theme.color.black,
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {(['relevant', 'fresh'] as SortKey[]).map((k) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                style={{
                  cursor: 'pointer',
                  border: `1px solid ${sort === k ? theme.color.accent : theme.color.border}`,
                  background: sort === k ? 'rgba(232,159,75,0.12)' : theme.color.white,
                  color: sort === k ? theme.color.primary : theme.color.textMuted,
                  fontWeight: 700,
                  fontSize: 13.5,
                  padding: '11px 16px',
                  borderRadius: theme.radius.pill,
                  fontFamily: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                {k === 'relevant' ? '✨ מומלץ' : '🆕 חדש'}
              </button>
            ))}
          </div>
        </div>

        {/* Channel filters */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
          {(Object.keys(CHANNEL_META) as Channel[]).map((c) => {
            const active = channels.includes(c);
            const m = CHANNEL_META[c];
            return (
              <button
                key={c}
                onClick={() => toggleChannel(c)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  border: `1.5px solid ${active ? m.color : theme.color.border}`,
                  background: active ? m.color : theme.color.white,
                  color: active ? theme.color.white : theme.color.secondary,
                  fontWeight: 700,
                  fontSize: 13.5,
                  padding: '8px 15px',
                  borderRadius: theme.radius.pill,
                  fontFamily: 'inherit',
                  transition: 'all .15s ease',
                }}
              >
                <span>{m.icon}</span> {m.label}
              </button>
            );
          })}
        </div>

        {/* Domain filters */}
        <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginBottom: 18 }}>
          {TAGS.map((t) => {
            const active = domains.includes(t.name);
            return (
              <button
                key={t.name}
                onClick={() => toggleDomain(t.name)}
                style={{
                  cursor: 'pointer',
                  border: `1px solid ${active ? theme.color.secondary : theme.color.border}`,
                  background: active ? theme.color.secondary : theme.color.white,
                  color: active ? theme.color.white : theme.color.secondary,
                  fontWeight: 600,
                  fontSize: 12.5,
                  padding: '6px 12px',
                  borderRadius: theme.radius.pill,
                  fontFamily: 'inherit',
                }}
              >
                {t.name}
              </button>
            );
          })}
        </div>

        {/* Result summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <span style={{ fontSize: 14.5, fontWeight: 700, color: theme.color.primary }}>
            {filtered.length} פריטים{compact ? ' (מציג מבחר)' : ''}
          </span>
          {activeCount > 0 && (
            <button
              onClick={() => { setChannels([]); setDomains([]); setQuery(''); }}
              style={{ background: 'transparent', border: 'none', color: theme.color.secondary, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: 'inherit' }}
            >
              ניקוי סינון ({activeCount}) ✕
            </button>
          )}
        </div>

        {/* Feed grid */}
        {filtered.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
            {filtered.map((it) => (
              <WisdomCard key={it.id} item={it} />
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '48px 20px', color: theme.color.textMuted }}>
            <div style={{ fontSize: 40, marginBottom: 10 }}>🍃</div>
            לא נמצא תוכן שמתאים לסינון. נסו להסיר חלק מהמסננים.
          </div>
        )}

        {compact && (
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link
              to="/wisdom"
              style={{
                display: 'inline-block',
                background: theme.color.primary,
                color: theme.color.white,
                fontWeight: 700,
                fontSize: 15,
                padding: '13px 28px',
                borderRadius: theme.radius.pill,
                textDecoration: 'none',
              }}
            >
              לכל חוכמת הקהילה ←
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

/** A single unified feed card with a channel ribbon. */
function WisdomCard({ item }: { item: WisdomItem }) {
  const m = CHANNEL_META[item.channel];
  return (
    <Link
      to={item.to}
      className="helam-card"
      style={{
        background: theme.color.white,
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.md,
        boxShadow: theme.shadow.card,
        textDecoration: 'none',
        color: 'inherit',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: 'transform .15s ease, box-shadow .15s ease',
      }}
    >
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden', background: `linear-gradient(140deg, ${theme.color.primary}, #12294a)` }}>
        {item.image ? (
          <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 52 }}>{item.emoji}</span>
        )}
        <span style={{ position: 'absolute', top: 10, insetInlineStart: 10, display: 'flex', alignItems: 'center', gap: 5, background: m.color, color: '#fff', fontSize: 12, fontWeight: 700, padding: '4px 10px', borderRadius: theme.radius.pill }}>
          {m.icon} {m.label}
        </span>
      </div>
      <div style={{ padding: 16, display: 'flex', flexDirection: 'column', flex: 1 }}>
        <h3 style={{ margin: '0 0 6px', fontSize: 16.5, fontWeight: 800, color: theme.color.primary, lineHeight: 1.35 }}>{item.title}</h3>
        <p style={{ margin: '0 0 12px', fontSize: 13.5, color: theme.color.textMuted, lineHeight: 1.5, flex: 1 }}>{item.desc}</p>
        {item.domains.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 10 }}>
            {item.domains.slice(0, 2).map((d) => (
              <span key={d} style={{ fontSize: 11, color: theme.color.secondary, background: theme.color.surface, border: `1px solid ${theme.color.border}`, padding: '2px 8px', borderRadius: theme.radius.pill }}>{d}</span>
            ))}
          </div>
        )}
        <div style={{ fontSize: 12, color: theme.color.textMuted, fontWeight: 600 }}>{item.meta}</div>
      </div>
    </Link>
  );
}
