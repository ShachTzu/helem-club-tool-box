import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { buildWisdomFeed, type WisdomChannel, type WisdomItem } from '@helemclub/knowledge-domains.hooks.use-wisdom-feed';
import { useDomains, type UseDomainsOptions } from '@helemclub/knowledge-domains.hooks.use-domains';
import { TagChip } from '@helemclub/design.content.tag-chip';
import styles from './community-wisdom.module.scss';

const CHANNEL_META: Record<WisdomChannel, { label: string; icon: string; color: string }> = {
  app: { label: 'כלים', icon: '🧰', color: '#E89F4B' },
  post: { label: 'כתבות', icon: '📝', color: '#4F6D7A' },
  record: { label: 'ספריית הידע', icon: '📚', color: '#5B8A72' },
  event: { label: 'אירועים', icon: '📅', color: '#B0578D' },
  gallery: { label: 'גלריה', icon: '🎨', color: '#8367C7' },
};

type SortKey = 'relevant' | 'fresh';

export type CommunityWisdomProps = {
  /**
   * when true, renders a curated subset with a "see all" CTA — used to embed
   * the hub on the home page. when false, renders the full filterable feed.
   */
  compact?: boolean;

  /**
   * provide mock domains to the domain filter chips, useful for tests/previews.
   */
  mockDomains?: UseDomainsOptions['mockData'];

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * "חוכמת הקהילה" — the central unified knowledge hub. aggregates content from
 * every channel (tools, blog posts, knowledge-library pages, events, gallery)
 * into one normalized, ranked feed with elegant smart filters: channel chips,
 * coping-domain chips, free-text search and sort. mobile-first, RTL.
 */
export function CommunityWisdom({ compact = false, mockDomains, className, style }: CommunityWisdomProps) {
  const feed = useMemo(buildWisdomFeed, []);
  const [channels, setChannels] = useState<WisdomChannel[]>([]);
  const [domains, setDomains] = useState<string[]>([]);
  const [sort, setSort] = useState<SortKey>('relevant');
  const [query, setQuery] = useState('');

  const { domains: allDomains } = useDomains(mockDomains ? { mockData: mockDomains } : {});

  const toggleChannel = (c: WisdomChannel) =>
    setChannels((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]));
  const toggleDomain = (name: string) =>
    setDomains((prev) => (prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]));

  const filtered = useMemo(() => {
    let list = feed.filter((item) => {
      const okChannel = channels.length === 0 || channels.includes(item.channel);
      const okDomain = domains.length === 0 || domains.some((d) => item.domains.includes(d));
      const okQuery =
        query.trim() === '' ||
        item.title.includes(query.trim()) ||
        item.description.includes(query.trim());
      return okChannel && okDomain && okQuery;
    });
    if (sort === 'fresh') list = [...list].reverse();
    return compact ? list.slice(0, 8) : list;
  }, [feed, channels, domains, query, sort, compact]);

  const activeCount = channels.length + domains.length + (query ? 1 : 0);

  return (
    <section className={classNames(styles.wisdom, compact && styles.compact, className)} style={style}>
      <div className={styles.inner}>
        <header className={classNames(styles.header, compact && styles.headerCentered)}>
          <div className={styles.eyebrow}>🌿 הידע של כולנו, במקום אחד</div>
          <h2 className={styles.title}>חוכמת הקהילה</h2>
          <p className={styles.subtitle}>
            כל הידע מכל הערוצים — כלים, כתבות, סרטונים, אירועים ויצירה — מרוכז וניתן לסינון חכם לפי סוג תוכן ותחום התמודדות.
          </p>
        </header>

        <div className={styles.controls}>
          <div className={styles.searchWrap}>
            <span className={styles.searchIcon} aria-hidden>🔍</span>
            <input
              className={styles.search}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש בכל הידע של הקהילה..."
            />
          </div>
          <div className={styles.sortGroup}>
            {(['relevant', 'fresh'] as SortKey[]).map((k) => (
              <button
                key={k}
                type="button"
                className={classNames(styles.sortButton, sort === k && styles.sortButtonActive)}
                onClick={() => setSort(k)}
              >
                {k === 'relevant' ? '✨ מומלץ' : '🆕 חדש'}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.channels}>
          {(Object.keys(CHANNEL_META) as WisdomChannel[]).map((c) => {
            const active = channels.includes(c);
            const m = CHANNEL_META[c];
            return (
              <button
                key={c}
                type="button"
                className={classNames(styles.channelChip, active && styles.channelChipActive)}
                style={active ? { background: m.color, borderColor: m.color } : undefined}
                onClick={() => toggleChannel(c)}
              >
                <span aria-hidden>{m.icon}</span> {m.label}
              </button>
            );
          })}
        </div>

        <div className={styles.domains}>
          {allDomains.map((d) => (
            <TagChip
              key={d.slug}
              label={d.name}
              active={domains.includes(d.name)}
              onToggle={() => toggleDomain(d.name)}
            />
          ))}
        </div>

        <div className={styles.summary}>
          <span className={styles.count}>
            {filtered.length} פריטים{compact ? ' (מבחר)' : ''}
          </span>
          {activeCount > 0 && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => { setChannels([]); setDomains([]); setQuery(''); }}
            >
              ניקוי סינון ({activeCount}) ✕
            </button>
          )}
        </div>

        {filtered.length > 0 ? (
          <div className={styles.grid}>
            {filtered.map((item) => (
              <WisdomCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <div className={styles.emptyIcon} aria-hidden>🍃</div>
            לא נמצא תוכן שמתאים לסינון. נסו להסיר חלק מהמסננים.
          </div>
        )}

        {compact && (
          <div className={styles.ctaWrap}>
            <Link to="/wisdom" className={styles.cta}>לכל חוכמת הקהילה ←</Link>
          </div>
        )}
      </div>
    </section>
  );
}

function WisdomCard({ item }: { item: WisdomItem }) {
  const m = CHANNEL_META[item.channel];
  return (
    <Link to={item.to} className={styles.card}>
      <div
        className={styles.media}
        style={item.image ? undefined : { background: 'linear-gradient(140deg, #0B1A30, #12294a)' }}
      >
        {item.image ? (
          <img src={item.image} alt={item.title} className={styles.mediaImage} />
        ) : (
          <span className={styles.mediaEmoji} aria-hidden>{item.emoji}</span>
        )}
        <span className={styles.ribbon} style={{ background: m.color }}>{m.icon} {m.label}</span>
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{item.title}</h3>
        <p className={styles.cardDesc}>{item.description}</p>
        {item.domains.length > 0 && (
          <div className={styles.cardDomains}>
            {item.domains.slice(0, 2).map((d) => (
              <span key={d} className={styles.cardDomain}>{d}</span>
            ))}
          </div>
        )}
        <div className={styles.cardMeta}>{item.meta}</div>
      </div>
    </Link>
  );
}
