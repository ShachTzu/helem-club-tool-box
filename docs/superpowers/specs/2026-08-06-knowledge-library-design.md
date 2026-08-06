# Knowledge Library (ספריית הידע) — Design

## What

A new hierarchical, taggable text/article content system for Helam Club, with:
1. A public "knowledge library" section — landing page → sub-topic landing pages (e.g. "עזרה ראשונה") → series → chapter pages, unlimited nesting depth.
2. An admin content-management page to create/edit that content, either one page at a time (manual form) or in bulk (CSV + image batch import).

This is requested directly by the organization (עמותה), not a speculative feature.

## For whom

- **Community manager** — primary content author, uses the admin form and CSV import to publish real recovery-education content.
- **Site visitors** — read the knowledge library pages, navigate via breadcrumb/nav panel between series and chapters.
- **Additional internal testers** — will exercise the public-facing pages once the first real content batch (the sample "מה זה פוסט טראומה והאם יש לי כזו?" series, 6 chapters, under "עזרה ראשונה") is live.

## Not doing

- Not extending or modifying the existing `knowledge-base` scope (video/audio catalog) or `knowledge-domains` scope (14-domain taxonomy) — this is a new sibling scope. `knowledge-base` stays exactly as it is.
- No scheduling/future-dated publishing.
- No draft → review → publish moderation workflow — a single `isPublished` on/off flag is the only visibility lever.
- No rich-text/WYSIWYG editor — body is plain multi-line text (rendered with preserved line breaks), matching how the source CSV content is actually formatted (plain paragraphs, no markup).
- No arbitrary raw-HTML embed. Only a strict YouTube/Spotify iframe allowlist (see Security below) — this is a deliberate narrowing of the original ask, agreed with the user, to avoid an XSS hole from admin-pasted HTML.
- No new "system user" account/login for הלם קלאב — content authorship is a display-only flag, not a real authenticated identity.

## Shape chosen, and what was rejected

**Chosen: new sibling scope** (`knowledge-library/`), own entity (`KnowledgePage`), own Mongo collection, own GraphQL schema, own admin + public routes — alongside `knowledge-base` and `knowledge-domains`, not touching them.

**Rejected: extend `knowledge-base`** to add a text body + `parentId` to its existing `MediaRecord`/`Label` entities. Rejected because `knowledge-base` is a fully-built, already-shipped video/audio catalog with its own admin panels in active use; bolting an unrelated content shape (hierarchical text pages) onto it risks destabilizing working code for no shared benefit — the two content types don't actually share fields beyond "has a title."

**Data model borrowed from `blog`'s `Post` entity** (title, body, domains, publishDate, isStaffAuthor) rather than invented fresh — it's the closest existing shape in the codebase to what's needed here, closer even than `knowledge-base`. Not reusing `Post` directly, though: it carries a moderation pipeline (`status: draft|pending|published|rejected`), a `members_only` visibility gate, an `excerpt`, and `embeddedApps` (toolbox-app references) — none of which apply to a chapter tree, and bolting tree semantics (`parentId`/`ancestorIds`) onto `blog`'s own entity would drag hierarchy concepts into a flat blog feed that never needed them. A new entity with the same shape, minus the blog-specific baggage, is cleaner than repurposing `Post`.

**Hierarchy: adjacency list (`parentId`)** rather than a nested-set/materialized-path structure. Simplest correct representation of an unlimited-depth tree; a cached `ancestorIds: string[]` (recomputed on save) avoids recursive queries for breadcrumbs/nav without the complexity of a full materialized-path scheme.

**Access control: a small editor-allowlist owned inside `knowledge-library` itself** (a `KnowledgeLibraryEditor` collection storing just granted user IDs) rather than a `canManageKnowledgeLibrary` flag on the shared `User` entity, and rather than reusing the existing global `writer` role. Rejected reusing `writer` because it also grants blog-authoring rights. Rejected a flag on `User` because `platform/entities/user` and `platform/helam-platform/user.model.ts` are hopeAI's exclusive-ownership files (per the established auth-hardening ownership split) — this keeps the new feature's authorization data entirely inside its own scope, checked by user ID against the existing session (`id`/`role` already flow through the GraphQL context today), with zero edits to platform/auth files and no cross-team coordination needed for this piece.

## Data model — `KnowledgePage`

New entity, new Mongo collection, in `knowledge-library/entities/knowledge-page/`:

| Field | Type | Notes |
|---|---|---|
| `id` | string | |
| `title` | string | |
| `slug` | string | auto-derived from title, editable, unique |
| `body` | string | plain text, line breaks preserved on render |
| `parentId` | string \| null | null = top-level landing page |
| `ancestorIds` | string[] | cached root→parent chain, recomputed on save, for breadcrumbs/nav without recursive lookups. Re-parenting a page cascades: all of its descendants' `ancestorIds` are recomputed too, not just the moved page's own |
| `domains` | string[] | reuses existing 14-domain taxonomy via `DomainSelector` (`knowledge-domains` aspect) |
| `image` | string? | Cloudinary URL (uploaded) or a plain image URL |
| `videoUrl` | string? | YouTube/Spotify link, auto-embedded via existing `getMediaEmbedInfo` (from `knowledge-base/ui/media-player`) |
| `videoEmbedHtml` | string? | only accepted if it matches the strict iframe allowlist (see Security) |
| `publishDate` | ISO date string | defaults to today; editable to backdate; drives both displayed date and chronological sort order everywhere (lobbies, series listings, sibling nav) |
| `authorName` | string | hardcoded `'הלם קלאב'` |
| `isStaffAuthor` | boolean | hardcoded `true`, mirrors `blog`'s existing `Post.isStaffAuthor` pattern |
| `isPublished` | boolean | default `true`; single on/off visibility toggle |
| `createdAt` / `updatedAt` | timestamp | |

No `authorRef`/real user record — authorship is a fixed display value, not an authenticated identity, per the "not doing" section above.

## Media

- **Image**: drag-and-drop file upload via a new, knowledge-library-scoped Cloudinary signed-upload mutation (mirrors `toolbox`'s existing pattern in `cloudinary-signature.ts` — same HMAC-SHA1 signing approach, own mutation name, own folder `knowledge-library/pages/{userId}`) — *or* a plain image URL text field, admin's choice.
- **Video**: a URL field (YouTube/Spotify link), auto-detected and embedded via the existing `getMediaEmbedInfo` utility — *or* a restricted embed-code field.

### Security: embed-code allowlist

The original ask included "paste raw HTML to embed media." This is narrowed, with the user's agreement, to: the pasted string is validated against a strict pattern that only matches a single `<iframe>` whose `src` resolves to `youtube.com`, `youtube-nocookie.com`, or `open.spotify.com`. Anything else is rejected outright at submit time (both client-side for UX and server-side as the actual gate) — no partial sanitization of arbitrary tags, no HTML parser/sanitizer library needed for this narrow case. This closes an XSS hole (a page editor pasting a `<script>` or an `onerror` handler that runs in every visitor's browser) while still covering the actual stated need.

## Hierarchy & tagging

- **Hierarchy**: `parentId` + cached `ancestorIds`. Unlimited nesting depth, as required (series → chapters is the two-level case for the first batch, but the model doesn't cap depth).
- **Tagging**: reuses the existing 14 fixed "coping domain" tags and the existing `DomainSelector` UI component — no new tag vocabulary.

## Admin capabilities

Two entry points under a new admin section (`admin/manage-knowledge-pages`), gated by membership in the `KnowledgeLibraryEditor` allowlist (or existing `moderator`/`admin` roles). An `admin`-only screen manages the allowlist (add/remove a user by ID) within `knowledge-library`'s own admin section — no changes to the platform's shared user-management screen.

### 1. Manual form
Title, date (defaults today, editable/backdatable), body (plain textarea), parent-page picker (searchable dropdown of existing pages, or "none" = top-level), domain tag selector, image (upload or URL), video (URL or restricted embed code), publish toggle.

### 2. CSV bulk import
One screen: drop the CSV (columns: `Text, Image filename, Video HTML embed, Video URL, Date, Current page title, Current page URL, Parent page title`), drop the batch of referenced image files (matched to rows by the `Image filename` column), and pick an optional top-anchor parent page for the whole batch.

Per row:
- `Current page title` → `title` (+ auto slug)
- `Text` → `body`
- `Image filename` → matched against the uploaded image batch by filename, uploaded to Cloudinary, becomes `image`
- `Video HTML embed` → validated against the iframe allowlist; rejected rows are flagged in the import summary, not silently dropped
- `Video URL` → `videoUrl` (used if no valid embed HTML)
- `Date` → `publishDate`
- `Current page URL` → stored nowhere / ignored for routing (legacy site reference only — the new site generates its own slugs)
- `Parent page title` → resolved by trimmed, whitespace-collapsed, case-insensitive title match against existing pages (not raw exact-string match — real CSV exports carry stray whitespace/quoting noise, as the sample file does). If no match exists, an empty series/landing page is auto-created with that title, anchored under the batch's chosen top-anchor parent. The import summary lists which parent titles matched an existing page vs. were newly created, so a near-miss (typo producing an unwanted duplicate) is visible immediately rather than silent.

**First real content batch** (already scoped): admin manually creates "עזרה ראשונה" as a top-level landing page once; the sample CSV (`מה זה פוסט טראומה והאם יש לי כזו?`, 6 chapters) is imported with "עזרה ראשונה" selected as the top-anchor, auto-creating the series page as its child and the 6 chapters as the series' children.

## Public site

- Knowledge library root landing page — lists top-level sub-topics (e.g. "עזרה ראשונה" as one tile).
- Sub-topic landing page — lists its child series/pages.
- Series landing page — lists its chapter pages, ordered by `publishDate`.
- Chapter (leaf) page — title, date, body, media, domain tags, breadcrumb (from `ancestorIds`), previous/next chapter links, and a nav panel showing siblings/children.

## Authorship display

No real user record for "הלם קלאב." Wherever authorship is shown (chapter pages, series listings), render the fixed `authorName` + a fixed avatar image asset (the existing brand illustration — night-mountain silhouettes carrying a boulder, `Big plate HC BG image.png`, cropped/sized for avatar use) as a static constant, not a database-backed profile.

## Which system does content go in?

Three content systems now exist for a non-technical admin: `blog` (single dated posts/announcements), `knowledge-base` (single video/audio recordings), `knowledge-library` (hierarchical text series). The admin dashboard's "content" section groups all three "create content" entry points together with a one-line rule of thumb next to each: "פוסט בודד ← בלוג · הקלטת וידאו/שמע בודדת ← מאגר הידע · סדרת פרקים עם טקסט ← ספריית הידע." This isn't a new system, just shared placement + copy so the choice isn't left implicit.

## Testing

- Unit tests for: slug generation, `ancestorIds` recomputation on parent change, the embed-allowlist validator (accept/reject cases), CSV row → `KnowledgePage` mapping (including the auto-create-missing-parent path), and the Cloudinary signature helper (mirroring `toolbox`'s existing spec).
- No end-to-end test infra exists in this codebase for any feature — consistent with the rest of the project, manual verification (community manager + additional testers, per the request) is the acceptance gate, same as every other feature shipped so far.

## Open items

- **Avatar needs a real hosted URL.** The illustration is resized and committed at `docs/assets/helem-club-author.png` (480px wide, down from the 4000×2000 source), ready to upload — but this codebase has no local/bundled image assets anywhere; every image everywhere is an externally-hosted URL (mostly Cloudinary). Nobody on this task holds the `CLOUDINARY_URL` credential (same reason Claude never has it for the toolbox uploads), so `HELEM_CLUB_AVATAR_URL` in `knowledge-page-options.ts` is `undefined` until whoever holds that credential uploads the file and the constant is updated. Until then the byline degrades gracefully to initials (the `Avatar` component's existing fallback), not a broken image.
- Exact admin UI copy/labels (Hebrew) to be written during implementation, following the brand type system (RAG Sans weights) and palette already on file.
