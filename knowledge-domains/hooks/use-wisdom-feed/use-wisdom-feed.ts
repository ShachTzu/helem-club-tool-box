import { useMemo } from 'react';
import { mockApps } from '@helemclub/toolbox.entities.app';
import { mockPosts } from '@helemclub/blog.entities.post';
import { mockKnowledgePages } from '@helemclub/knowledge-library.entities.knowledge-page';
import { mockEvents } from '@helemclub/events.entities.event';
import { mockGalleryItems } from '@helemclub/gallery.entities.gallery-item';

/** A content channel a wisdom item can originate from. */
export type WisdomChannel = 'app' | 'post' | 'record' | 'event' | 'gallery';

/** Normalized item unifying every content type across the ecosystem. */
export type WisdomItem = {
  /**
   * unique id, prefixed by channel to avoid collisions across sources.
   */
  id: string;

  /**
   * the source channel of this item.
   */
  channel: WisdomChannel;

  /**
   * display title.
   */
  title: string;

  /**
   * short description or excerpt.
   */
  description: string;

  /**
   * optional cover/thumbnail image url.
   */
  image?: string;

  /**
   * optional emoji shown when there is no image.
   */
  emoji?: string;

  /**
   * route to the item's detail page.
   */
  to: string;

  /**
   * coping-domain names tagging the item.
   */
  domains: string[];

  /**
   * channel-specific meta line (e.g. rating, views, author).
   */
  meta: string;

  /**
   * relevance score used for the "recommended" sort.
   */
  score: number;
};

/** Filters applied to the aggregated wisdom feed. */
export type WisdomFeedFilters = {
  /**
   * restrict to these channels. empty/undefined means all channels.
   */
  channels?: WisdomChannel[];

  /**
   * restrict to items tagged with any of these coping-domain names.
   */
  domains?: string[];

  /**
   * free-text query matched against title and description.
   */
  query?: string;

  /**
   * sort order: by relevance (default) or freshness.
   */
  sort?: 'relevant' | 'fresh';

  /**
   * cap the number of returned items (e.g. for a compact home embed).
   */
  limit?: number;
};

/**
 * builds the normalized, ranked cross-channel feed from every content source.
 */
export function buildWisdomFeed(): WisdomItem[] {
  const apps = mockApps().map((a) => a.toObject());
  const posts = mockPosts().map((p) => p.toObject());
  const records = mockKnowledgePages();
  const events = mockEvents().map((e) => e.toObject());
  const gallery = mockGalleryItems().map((g) => g.toObject());

  const items: WisdomItem[] = [
    ...apps.map((a) => ({
      id: `app-${a.id}`,
      channel: 'app' as const,
      title: a.name,
      description: a.subtitle ?? a.fullDescription ?? '',
      emoji: a.icon,
      to: `/toolbox/${a.slug}`,
      domains: a.domains ?? [],
      meta: `⭐ ${a.avgRating ?? 0} · ${(a.clickCount ?? 0).toLocaleString('he-IL')} כניסות`,
      score: (a.clickCount ?? 0) + (a.avgRating ?? 0) * 200,
    })),
    ...posts.map((p) => ({
      id: `post-${p.id}`,
      channel: 'post' as const,
      title: p.title,
      description: p.excerpt,
      image: p.coverImage,
      to: `/blog/${p.slug}`,
      domains: p.domains ?? [],
      meta: `${p.authorName} · ${(p.viewCount ?? 0).toLocaleString('he-IL')} צפיות`,
      score: p.viewCount ?? 0,
    })),
    // the 'record' channel key is kept for compatibility with existing
    // domain-tag targetTypes; it now sources from the knowledge library,
    // which absorbed the retired knowledge-base scope.
    ...records.map((r) => ({
      id: `rec-${r.id}`,
      channel: 'record' as const,
      title: r.title,
      description: r.body,
      image: r.image,
      to: `/knowledge-library/${r.slug}`,
      domains: r.domains ?? [],
      meta: `${r.mediaType === 'audio' ? '🎧' : '🎬'} ${(r.viewCount ?? 0).toLocaleString('he-IL')} צפיות`,
      score: r.viewCount ?? 0,
    })),
    ...events.map((e) => ({
      id: `ev-${e.id}`,
      channel: 'event' as const,
      title: e.title,
      description: e.description,
      image: e.coverImage,
      to: `/events/${e.slug}`,
      domains: e.domains ?? [],
      meta: `${e.location ?? (e.isOnline ? 'אונליין' : '')} · ${e.rsvpCount ?? 0} נרשמו`,
      score: e.rsvpCount ?? 0,
    })),
    ...gallery.map((g) => ({
      id: `gal-${g.id}`,
      channel: 'gallery' as const,
      title: g.title,
      description: g.artistName ? `יצירה מאת ${g.artistName}` : (g.description ?? ''),
      image: g.thumbnailUrl ?? g.mediaUrl,
      to: `/gallery/${g.slug}`,
      domains: g.domains ?? [],
      meta: g.artistName ?? '',
      score: 300,
    })),
  ];

  return items.sort((a, b) => b.score - a.score);
}

/**
 * aggregates content from every feature channel (toolbox apps, blog posts,
 * knowledge-library pages, events, gallery works) into a single normalized,
 * ranked feed, then applies channel/domain/query filters and sorting. this is
 * the cross-cutting aggregation that powers the "חוכמת הקהילה" hub.
 */
export function useWisdomFeed(filters?: WisdomFeedFilters) {
  const all = useMemo(() => buildWisdomFeed(), []);

  const items = useMemo(() => {
    const channels = filters?.channels ?? [];
    const domains = filters?.domains ?? [];
    const query = filters?.query?.trim() ?? '';

    let list = all.filter((item) => {
      const okChannel = channels.length === 0 || channels.includes(item.channel);
      const okDomain = domains.length === 0 || domains.some((d) => item.domains.includes(d));
      const okQuery =
        query === '' || item.title.includes(query) || item.description.includes(query);
      return okChannel && okDomain && okQuery;
    });

    if (filters?.sort === 'fresh') list = [...list].reverse();
    if (filters?.limit) list = list.slice(0, filters.limit);
    return list;
  }, [all, filters?.channels, filters?.domains, filters?.query, filters?.sort, filters?.limit]);

  return { items, total: all.length };
}
