/**
 * plain, serializable shape of a knowledge-library page, returned by the
 * repository and served over GraphQL.
 */
export type PlainKnowledgePage = {
  id: string;
  slug: string;
  title: string;
  body: string;
  parentId: string | null;
  /**
   * cached root→parent id chain (not including this page's own id), kept in
   * sync on create/reparent so breadcrumbs/nav don't need a recursive lookup.
   */
  ancestorIds: string[];
  domains: string[];
  image?: string;
  videoUrl?: string;
  /**
   * only ever a value that has passed `validateEmbedHtml` — see embed-allowlist.ts.
   */
  videoEmbedHtml?: string;
  publishDate: string;
  authorName: string;
  isStaffAuthor: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * options accepted when listing / filtering knowledge-library pages.
 */
export type ListPagesOptions = {
  /**
   * list only the direct children of this page. pass null explicitly to list
   * top-level pages (no parent). omit to list all pages regardless of level.
   */
  parentId?: string | null;

  /**
   * filter pages tagged with any of the given coping domains.
   */
  domainIds?: string[];

  /**
   * free text search query, matched against title and body.
   */
  query?: string;

  /**
   * maximum number of pages to return.
   */
  limit?: number;
};

/**
 * the fixed display identity every knowledge-library page is authored under —
 * there is no real "הלם קלאב" user account, this is a display-only constant.
 */
export const HELEM_CLUB_AUTHOR_NAME = 'הלם קלאב';

/**
 * avatar shown next to HELEM_CLUB_AUTHOR_NAME wherever authorship is
 * displayed. undefined until the brand illustration is uploaded to
 * Cloudinary (or another host) and this constant is updated with the real
 * URL — no one on this task has the CLOUDINARY_URL credential, matching how
 * every other externally-hosted image in this codebase works (this app has
 * no bundled local image assets anywhere; every image is a URL). Until then,
 * the byline degrades gracefully to text-only. The resized source file is at
 * docs/assets/helem-club-author.png, ready for whoever uploads it.
 */
export const HELEM_CLUB_AVATAR_URL: string | undefined = undefined;

/**
 * input required to create a new knowledge-library page.
 */
export type CreatePageOptions = {
  title: string;
  body: string;
  parentId?: string | null;
  domains?: string[];
  image?: string;
  videoUrl?: string;
  /**
   * raw pasted embed code. validated against the embed allowlist by the
   * repository before being persisted — an invalid value is rejected, not
   * silently dropped.
   */
  videoEmbedHtml?: string;
  /**
   * optional slug. when omitted, a slug is derived from the title.
   */
  slug?: string;
  /**
   * optional ISO publish date. defaults to today. may be backdated.
   */
  publishDate?: string;
  isPublished?: boolean;
};

/**
 * input accepted to update an existing knowledge-library page. all fields
 * optional; `parentId` may be explicitly set to null to move a page to the
 * top level.
 */
export type UpdatePageOptions = {
  title?: string;
  body?: string;
  parentId?: string | null;
  domains?: string[];
  image?: string;
  videoUrl?: string;
  videoEmbedHtml?: string;
  publishDate?: string;
  isPublished?: boolean;
};
