# Spec — Knowledge Library bulk CSV import

**Audience:** hopeAI (implementation reference / review).
**Status:** implemented and run against the live dev DB on 2026-08-07.
Branch `claude/knowledge-library-admin-19b540`, PR #3.
This documents **what the code actually does**, written from the code, not from intent.

Files:

| Layer | File |
|---|---|
| CSV → row mapping (browser) | `knowledge-library/admin/manage-knowledge-library/csv-row-mapping.ts` |
| Import screen | `knowledge-library/admin/manage-knowledge-library/import-tab.tsx` |
| Apollo mutation hook | `knowledge-library/hooks/use-knowledge-pages/use-import-knowledge-pages.ts` |
| GraphQL resolver | `knowledge-library/knowledge-library/knowledge-library.graphql.ts` |
| Import engine (server) | `knowledge-library/knowledge-library/knowledge-library-importer.ts` |
| Page writes + validation | `knowledge-library/knowledge-library/knowledge-page-repository.ts` |

---

## 1. CSV contract

Parsed in the **browser** with `papaparse` (`header: true`, `skipEmptyLines: true`).

Headers must match **exactly** — they are used as object keys, not fuzzy-matched:

```
Text
Image filename
Video HTML embed
Video URL (YouTube/Spotify)
Date
Current page title
Current page URL
Parent page title (hierarchy)
```

Mapping (`mapCsvRecordToRow`):

| CSV column | Row field | Notes |
|---|---|---|
| `Text` | `text` → page `body` | empty → `undefined` → stored as `''` |
| `Image filename` | `imageFilename` | trimmed; matched against uploaded files by **exact filename** |
| `Video HTML embed` | `videoHtmlEmbed` | must pass the embed allowlist or the **row is rejected** |
| `Video URL (YouTube/Spotify)` | `videoUrl` | stored as-is, rendered through `MediaPlayer` |
| `Date` | `date` → `publishDate` | may be backdated; drives display **and** sort order |
| `Current page title` | `currentPageTitle` | **required.** blank/whitespace → row dropped before submit |
| `Current page URL` | `currentPageUrl` | **accepted and ignored.** Legacy-site URL kept for the operator's reference only; slugs are generated fresh |
| `Parent page title (hierarchy)` | `parentPageTitle` | see §3 |

Rows whose title is blank are filtered out client-side (`mapCsvRecordToRow` returns `null`). If **no** row survives, the screen shows an error and nothing is submitted.

### ⚠️ BOM gotcha (cost real time)

A UTF-8 BOM at the start of the file corrupts the **first** header key (`Text` becomes `﻿Text`), so every row silently gets an empty body — no error, content just vanishes. `papaparse` handles this; a naïve server-side/Python re-parse must use `encoding='utf-8-sig'`.

---

## 2. Images

Images are **not** read from the CSV. The operator drops the image files onto a second drop zone.

Flow in `handleRunImport`:

1. Each dropped file is uploaded to Cloudinary **first**, sequentially, via the existing signed-upload flow (`useUploadKnowledgeLibraryImage` → `createKnowledgeLibraryUploadSignature`). The API secret never reaches the browser; the folder is pinned server-side to `knowledge-library/pages/{userId}`.
2. This yields `[{ filename, url }]` pairs keyed on `file.name`.
3. Only then is the import mutation called.

Matching is **exact filename equality** (`imagesByFilename[row.imageFilename]`). No fuzzy matching, no extension normalisation. A mismatch is silent: the page is created without an image.

The UI does flag the inverse case — an uploaded file that no CSV row references is marked `⚠️ לא מוזכר בשום שורה ב-CSV`. There is **no** warning for the more dangerous direction (a CSV row naming a file that was not uploaded). **Worth adding.**

---

## 3. Parent resolution — the core logic

Per row, in `KnowledgeLibraryImporter.resolveParentId`:

```
no parentPageTitle (or blank)   → parent = topAnchorParentId  (may be null = top level)
already resolved in this batch  → reuse that id
matches an existing page        → use it, record in matchedExistingParents
otherwise                       → create an empty page with that title,
                                  parented to topAnchorParentId,
                                  record in createdParents
```

Three deliberate properties:

**a. Matching is normalised, not exact.** `normalizeTitle()` = trim → collapse internal whitespace → lowercase. Real exports carry whitespace and casing noise; exact string matching would fork duplicate parents. Contrast with image matching, which *is* exact — different tradeoff, because a filename typo should fail loudly rather than bind to the wrong file.

**b. Rows are processed sequentially, never in parallel.** This is load-bearing, not laziness. With `Promise.all`, N rows sharing one not-yet-existing parent title would each miss the lookup and each create a parent — N duplicates. The in-batch `resolvedParentIds` map only works because writes are ordered. **Do not "optimise" this into a parallel map.**

**c. Only one level is auto-created.** An auto-created parent is always attached to `topAnchorParentId`. The CSV cannot express a grandparent. Deeper trees need either a pre-existing parent or a second pass.

### Worked example (the real first import)

5 rows, all with `Parent page title = "מה זה פוסט טראומה והאם יש לי כזו?"`, top-anchor = the manually created `עזרה ראשונה`:

```
עזרה ראשונה                          (pre-existing, chosen as top-anchor)
└── מה זה פוסט טראומה והאם יש לי כזו?   (auto-created once, by row 1)
    ├── איך נראים החיים שלך בזמן האחרון?
    ├── לפעמים המוח פשוט קצת נדפק
    ├── החרא הזה נשמע מוכר?
    ├── הקול הפנימי שלך שונא אותך
    └── אז מה עכשיו?
```

Summary returned: `createdPageIds: 5`, `createdParents: ["מה זה פוסט טראומה והאם יש לי כזו?"]`, `matchedExistingParents: []`, `rejected: []`.

---

## 4. Per-page writes

Each row goes through `KnowledgePageRepository.createPage` — the **same** entry point the manual admin form uses. There is no import-only write path, deliberately: validation cannot drift between the two.

Applied per page:

- **slug** — derived from the title, Hebrew preserved, whitespace → dashes; uniqueness enforced by appending `-2`, `-3`… (`ensureUniqueSlug`).
- **normalizedTitle** — stored alongside, so later imports can match this page as a parent.
- **ancestorIds** — computed from the parent chain at write time (cached; avoids recursive lookups for breadcrumbs).
- **authorName** — always `הלם קלאב`, `isStaffAuthor: true`. Not settable from the CSV.
- **isPublished** — defaults `true`. Imported content is live immediately.
- **viewCount** — `0`.
- **publishDate** — the CSV `Date`, else now.

### Embed validation is a hard gate

`videoEmbedHtml` passes through `validateEmbedHtml`. It accepts **only** a single `<iframe>` whose `src` resolves over https to `youtube.com`, `www.youtube.com`, `www.youtube-nocookie.com` or `open.spotify.com`. Everything else throws — including `on*` handlers, `srcdoc`, `data:`/`javascript:` URIs, userinfo tricks (`https://youtube.com@evil.com`), lookalike hosts (`youtube.com.evil.com`), and more than one iframe. 17 adversarial tests cover this.

This is the one place in the feature where a mistake becomes stored XSS on trauma-support content. **Any change here must re-run those tests** — do not trust a small-looking diff.

---

## 5. Failure model

Per-row `try/catch` inside the loop. A rejected row is recorded and **the batch continues**:

```ts
rejected: [{ currentPageTitle, reason }]
```

Consequences to be aware of:

- **The import is not atomic.** A partial batch is a real outcome. There is no transaction and no rollback.
- **Re-running the same CSV creates duplicates.** Rows are not idempotent — there is no upsert on title or slug; a second run produces `title-2`, `title-3`. Parents *are* deduped (they match by normalized title), pages are not.
- The mutation itself only fails wholesale on auth (`AccessDenied`).

---

## 6. Authorization

`importKnowledgeLibraryPages` calls `assertCanManage` before anything else — staff role (`moderator`/`admin`) **or** membership in this feature's own `KnowledgeLibraryEditor` allowlist. Same gate as every other write in the scope.

Note the import runs **server-side under the caller's authority** but writes pages authored as `הלם קלאב` — authorship is a display constant, not the acting user.

---

## 7. Known gaps / recommended follow-ups

Ranked by how likely they are to bite:

1. **No re-import protection.** The most likely real-world mistake is running the same file twice. Cheapest fix: warn when a row's normalized title already exists, and offer skip-or-create.
2. **No warning for a CSV row naming a missing image file** (only the inverse is flagged). Silent data loss.
3. **No row-count cap.** Acceptable today because the endpoint is editor-gated, not public — a huge file is a slow admin action, not a DoS vector. Worth a UI warning past ~100 rows.
4. **Not atomic.** If all-or-nothing matters, this needs a transaction or a dry-run/preview step. A preview showing "will create X pages, Y parents, reject Z" before committing would address 1, 2 and 4 at once — **this is the single highest-value addition.**
5. **`Current page URL` is dropped.** If old→new URL redirects are ever wanted, that column already carries the data; it just isn't stored.
6. **Depth limited to one auto-created level** (§3c).

---

## 8. Verification status

**Verified live** against the dev DB with the organisation's real CSV: 5 rows → 5 chapters + 1 auto-created parent, correct `ancestorIds`, full body text, validated YouTube embeds, `הלם קלאב` byline, and backdated `publishDate` 2023-09-11 rendering correctly on the public page.

**Unit tests** (`knowledge-library-importer.spec.ts`, `csv-row-mapping.spec.ts`) cover: auto-create-once across multiple rows, matching an existing parent through whitespace/casing noise, top-anchor fallback, image mapping, rejection capture, and batch continuation after a rejection.

**Not covered by any test:** the Cloudinary upload leg of `handleRunImport` (it is UI-level and needs a real credential), and re-import/duplicate behaviour.
