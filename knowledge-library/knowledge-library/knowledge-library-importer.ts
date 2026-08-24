import type { KnowledgePageRepository } from './knowledge-page-repository.js';
import { normalizeTitle } from './knowledge-page-repository.js';

/**
 * one row of the CSV bulk-import format: Text, Image filename, Video HTML
 * embed, Video URL (YouTube/Spotify), Date, Current page title, Current page
 * URL, Parent page title (hierarchy). `currentPageUrl` is accepted but never
 * used — it's the legacy site's URL, kept only for the admin's own reference,
 * the new site generates its own slugs.
 */
export type ImportRow = {
  text?: string;
  imageFilename?: string;
  videoHtmlEmbed?: string;
  videoUrl?: string;
  date?: string;
  currentPageTitle: string;
  currentPageUrl?: string;
  parentPageTitle?: string;
};

export type ImportRejection = { currentPageTitle: string; reason: string };

export type ImportSummary = {
  createdPageIds: string[];
  /**
   * titles of parent pages the batch matched to an already-existing page,
   * surfaced so a near-miss (a title that should have matched but didn't,
   * due to a real difference rather than whitespace/casing noise) is visible
   * rather than silently creating an unwanted duplicate.
   */
  matchedExistingParents: string[];
  /**
   * titles of empty parent/series pages the batch had to auto-create.
   */
  createdParents: string[];
  rejected: ImportRejection[];
};

export class KnowledgeLibraryImporter {
  constructor(private knowledgePageRepository: KnowledgePageRepository) {}

  /**
   * import a CSV-derived batch of rows as knowledge-library pages. rows are
   * processed sequentially, not in parallel — when several rows reference
   * the same not-yet-existing parent title, only the first row creates it
   * and every later row in the same batch reuses it, avoiding a race that
   * would otherwise fork duplicate parent pages.
   *
   * parent resolution priority: when the caller manually picks a top-anchor
   * page, that choice wins outright and every row is anchored under it —
   * the CSV's own "Parent page title" column is ignored for the whole batch.
   * only when no top-anchor is chosen does the per-row CSV column drive the
   * hierarchy (matching an existing page by title, or auto-creating one).
   */
  async importRows(
    rows: ImportRow[],
    imagesByFilename: Record<string, string>,
    topAnchorParentId: string | null
  ): Promise<ImportSummary> {
    const summary: ImportSummary = {
      createdPageIds: [],
      matchedExistingParents: [],
      createdParents: [],
      rejected: [],
    };

    // normalized parent title -> page id, resolved so far in this batch.
    const resolvedParentIds = new Map<string, string>();

    // eslint-disable-next-line no-restricted-syntax
    for (const row of rows) {
      try {
        // a manually-picked top-anchor overrides the CSV's own per-row parent
        // column outright — the community manager's explicit choice always
        // wins over whatever hierarchy the CSV happens to encode.
        // eslint-disable-next-line no-await-in-loop
        const parentId = topAnchorParentId
          ? topAnchorParentId
          : await this.resolveParentId(row.parentPageTitle, null, resolvedParentIds, summary);
        const image = row.imageFilename ? imagesByFilename[row.imageFilename] : undefined;

        // eslint-disable-next-line no-await-in-loop
        const page = await this.knowledgePageRepository.createPage({
          title: row.currentPageTitle,
          body: row.text || '',
          parentId,
          image,
          videoUrl: row.videoUrl || undefined,
          videoEmbedHtml: row.videoHtmlEmbed || undefined,
          publishDate: row.date || undefined,
        });

        summary.createdPageIds.push(page.id);
      } catch (err) {
        summary.rejected.push({ currentPageTitle: row.currentPageTitle, reason: (err as Error).message });
      }
    }

    return summary;
  }

  private async resolveParentId(
    parentPageTitle: string | undefined,
    fallbackParentId: string | null,
    resolvedParentIds: Map<string, string>,
    summary: ImportSummary
  ): Promise<string | null> {
    if (!parentPageTitle || !parentPageTitle.trim()) return fallbackParentId;

    const normalized = normalizeTitle(parentPageTitle);
    const alreadyResolvedId = resolvedParentIds.get(normalized);
    if (alreadyResolvedId) return alreadyResolvedId;

    const existing = await this.knowledgePageRepository.findByNormalizedTitle(parentPageTitle);
    if (existing) {
      resolvedParentIds.set(normalized, existing.id);
      summary.matchedExistingParents.push(existing.title);
      return existing.id;
    }

    const created = await this.knowledgePageRepository.createPage({
      title: parentPageTitle.trim(),
      body: '',
      parentId: fallbackParentId,
    });
    resolvedParentIds.set(normalized, created.id);
    summary.createdParents.push(created.title);
    return created.id;
  }
}
