import { ReturnModelType } from '@typegoose/typegoose';
import { KnowledgePageModel } from './knowledge-page.model.js';
import { validateEmbedHtml } from './embed-allowlist.js';
import { HELEM_CLUB_AUTHOR_NAME } from './knowledge-page-options.js';
import type { ListPagesOptions, CreatePageOptions, UpdatePageOptions } from './knowledge-page-options.js';

/**
 * derive a url-friendly slug from an arbitrary string, preserving Hebrew
 * characters and collapsing whitespace into single dashes.
 */
function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9֐-׿\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * normalize a title for equality lookups: trim, collapse internal whitespace,
 * lower-case. real CSV exports carry whitespace/casing noise (the sample
 * export does), so parent-title matching can't rely on raw exact strings.
 */
export function normalizeTitle(title: string): string {
  return title.trim().replace(/\s+/g, ' ').toLowerCase();
}

export class KnowledgePageRepository {
  constructor(private knowledgePageModel: ReturnModelType<typeof KnowledgePageModel>) {}

  /**
   * list and filter knowledge-library pages by parent, coping domains and
   * free text, ordered by publish date (newest first) — publishDate is the
   * one field that drives chronological order everywhere, including for a
   * backdated page.
   *
   * `includeUnpublished` must be derived from the caller's session by the
   * resolver (canManage), never taken from client input — this is the
   * actual enforcement of the "hide without deleting" flag. Without it, a
   * hidden page's full content is still readable by anyone querying the
   * public API directly, regardless of what the UI chooses to render.
   */
  async listPages(options?: ListPagesOptions, includeUnpublished = false): Promise<KnowledgePageModel[]> {
    const filter: Record<string, unknown> = {};

    if (!includeUnpublished) {
      filter.isPublished = true;
    }

    if (options?.parentId !== undefined) {
      filter.parentId = options.parentId;
    }

    if (options?.domainIds && options.domainIds.length > 0) {
      filter.domains = { $in: options.domainIds };
    }

    if (options?.query) {
      const escaped = options.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { body: { $regex: escaped, $options: 'i' } },
        { slug: { $regex: escaped, $options: 'i' } },
      ];
    }

    // same-date tiebreaker is ascending (_id: 1, oldest-created first), not
    // descending: a CSV batch import creates same-day chapters sequentially,
    // and they should read back in that original order (chapter 1..N), not
    // reversed.
    const query = this.knowledgePageModel.find(filter).sort({ publishDate: -1, _id: 1 });
    if (options?.limit && options.limit > 0) {
      query.limit(options.limit);
    }

    const pages = await query.exec();
    return pages.map((page) => page.toObject());
  }

  /**
   * resolve a single page by its id or slug.
   */
  async getPage(idOrSlug: string): Promise<KnowledgePageModel | null> {
    const page = await this.knowledgePageModel.findOne({ $or: [{ id: idOrSlug }, { slug: idOrSlug }] });
    return page ? page.toObject() : null;
  }

  /**
   * find a page by normalized title — used by the CSV importer to resolve a
   * "Parent page title" against an existing page, tolerant of whitespace and
   * casing noise (see normalizeTitle above).
   */
  async findByNormalizedTitle(title: string): Promise<KnowledgePageModel | null> {
    const page = await this.knowledgePageModel.findOne({ normalizedTitle: normalizeTitle(title) });
    return page ? page.toObject() : null;
  }

  /**
   * create a new page. an invalid videoEmbedHtml is rejected here — the
   * repository is the single choke point both the admin form and the CSV
   * importer route through, so this is the one place the allowlist actually
   * gets enforced, not a per-caller guard.
   */
  async createPage(options: CreatePageOptions): Promise<KnowledgePageModel> {
    const videoEmbedHtml = this.resolveEmbedHtml(options.videoEmbedHtml);

    const id = crypto.randomUUID();
    const baseSlug = options.slug ? slugify(options.slug) : slugify(options.title) || id;
    const slug = await this.ensureUniqueSlug(baseSlug);
    const ancestorIds = await this.computeAncestorIds(options.parentId ?? null);
    const now = new Date().toISOString();

    const created = await this.knowledgePageModel.create({
      id,
      slug,
      title: options.title,
      normalizedTitle: normalizeTitle(options.title),
      body: options.body,
      parentId: options.parentId ?? null,
      ancestorIds,
      domains: options.domains || [],
      image: options.image,
      videoUrl: options.videoUrl,
      videoEmbedHtml,
      publishDate: options.publishDate || now,
      authorName: HELEM_CLUB_AUTHOR_NAME,
      isStaffAuthor: true,
      isPublished: options.isPublished ?? true,
      createdAt: now,
      updatedAt: now,
    });

    return created.toObject();
  }

  /**
   * update an existing page by its id, only touching provided fields.
   * re-parenting cascades: every descendant's cached ancestorIds is
   * recomputed too, not just the moved page's own.
   */
  async updatePage(id: string, options: UpdatePageOptions): Promise<KnowledgePageModel | null> {
    const existing = await this.knowledgePageModel.findOne({ id });
    if (!existing) return null;

    const update: Record<string, unknown> = { updatedAt: new Date().toISOString() };

    if (options.title !== undefined) {
      update.title = options.title;
      update.normalizedTitle = normalizeTitle(options.title);
    }
    if (options.body !== undefined) update.body = options.body;
    if (options.domains !== undefined) update.domains = options.domains;
    if (options.image !== undefined) update.image = options.image;
    if (options.videoUrl !== undefined) update.videoUrl = options.videoUrl;
    if (options.videoEmbedHtml !== undefined) update.videoEmbedHtml = this.resolveEmbedHtml(options.videoEmbedHtml);
    if (options.publishDate !== undefined) update.publishDate = options.publishDate;
    if (options.isPublished !== undefined) update.isPublished = options.isPublished;

    let newAncestorIds: string[] | undefined;
    if (options.parentId !== undefined && options.parentId !== existing.parentId) {
      await this.assertNotCyclicParent(id, options.parentId);
      newAncestorIds = await this.computeAncestorIds(options.parentId);
      update.parentId = options.parentId;
      update.ancestorIds = newAncestorIds;
    }

    const page = await this.knowledgePageModel.findOneAndUpdate({ id }, { $set: update }, { new: true });
    if (!page) return null;

    if (newAncestorIds) {
      await this.cascadeAncestorIds(id, newAncestorIds);
    }

    return page.toObject();
  }

  /**
   * delete a page by its id. does not touch its children — orphaning
   * descendants under a deleted parent is a content-authoring mistake the
   * admin UI should warn about, not something the repository silently
   * cascades away (a bulk delete-descendants is a much more dangerous
   * default than leaving them in place with a dangling parentId).
   */
  async deletePage(id: string): Promise<boolean> {
    const result = await this.knowledgePageModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  /**
   * count how many pages have this page as their direct parent.
   */
  async countChildren(parentId: string): Promise<number> {
    return this.knowledgePageModel.countDocuments({ parentId });
  }

  private resolveEmbedHtml(rawEmbedHtml: string | undefined): string | undefined {
    if (rawEmbedHtml === undefined) return undefined;
    const validated = validateEmbedHtml(rawEmbedHtml);
    if (!validated) {
      throw new Error('videoEmbedHtml must be a single iframe embed from an allowed host (YouTube or Spotify)');
    }
    return validated;
  }

  private async computeAncestorIds(parentId: string | null): Promise<string[]> {
    if (!parentId) return [];
    const parent = await this.knowledgePageModel.findOne({ id: parentId });
    if (!parent) return [];
    return [...(parent.ancestorIds || []), parent.id];
  }

  /**
   * a page can't become its own parent, and can't become the child of one of
   * its own descendants (that would create a cycle in the tree).
   */
  private async assertNotCyclicParent(id: string, newParentId: string | null): Promise<void> {
    if (!newParentId) return;
    if (newParentId === id) {
      throw new Error('a page cannot be its own parent');
    }
    const newParent = await this.knowledgePageModel.findOne({ id: newParentId });
    if (newParent && (newParent.ancestorIds || []).includes(id)) {
      throw new Error('cannot move a page under one of its own descendants');
    }
  }

  /**
   * recompute ancestorIds for every descendant after a re-parent, walking
   * down the tree level by level. admin-authored trees are small, so the
   * per-level query here is not a performance concern.
   */
  private async cascadeAncestorIds(parentPageId: string, parentAncestorIds: string[]): Promise<void> {
    const children = await this.knowledgePageModel.find({ parentId: parentPageId });
    const childAncestorIds = [...parentAncestorIds, parentPageId];
    for (const child of children) {
      // guards against infinite recursion if the tree ever contained a cycle
      // despite assertNotCyclicParent (e.g. a manual DB edit) — not reachable
      // through this API today, but the cost of the check is one .includes().
      if (childAncestorIds.includes(child.id)) continue;
      // eslint-disable-next-line no-await-in-loop
      await this.knowledgePageModel.updateOne({ id: child.id }, { $set: { ancestorIds: childAncestorIds } });
      // eslint-disable-next-line no-await-in-loop
      await this.cascadeAncestorIds(child.id, childAncestorIds);
    }
  }

  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let candidate = baseSlug;
    let suffix = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await this.knowledgePageModel.exists({ slug: candidate })) {
      suffix += 1;
      candidate = `${baseSlug}-${suffix}`;
    }
    return candidate;
  }
}
