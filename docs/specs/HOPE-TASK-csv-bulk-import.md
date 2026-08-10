# TASK — Add the CSV bulk import to the Knowledge Library

**To hopeAI. This document is self-contained** — the full spec and every line
of source are included below, so nothing here depends on GitHub access.

## Situation

You implemented the Knowledge Library **without the CSV bulk-import flow**.
That flow is the organisation's actual requirement: the community manager has
to load a whole series at once from a spreadsheet, not page by page.

A complete, working implementation of it already exists. It was built, tested,
security-reviewed, and **run against the live dev database** — the
organisation's real CSV imported cleanly (5 rows → 5 chapters plus one
auto-created parent, correct hierarchy, backdated 2023 dates, validated
YouTube embeds). It lives on branch `claude/knowledge-library-admin-19b540`
(PR #3) and every file is reproduced verbatim in Appendix A.

**Your task is to bring this flow into your implementation.** Reuse the code
below rather than rewriting it — it already encodes fixes for bugs that only
surfaced against a live database and a real, messy CSV.

## Two things to be careful about

**1. Divergence.** Your version is not on GitHub; mine is. If you export your
version to the Bit lane as-is, the lane and the repo will disagree, and
whichever is pulled last wins. Reconcile *before* exporting, not after.

**2. Do not silently rewrite.** Every non-obvious choice below has a written
reason. If you think one is wrong, say which, why, and what you would do
instead — then wait for a decision. A reason being wrong is worth knowing;
working tested code being replaced without discussion is not.

## Four rules that are load-bearing

Not style. Each one, if changed, reintroduces a specific bug.

1. **Rows import sequentially, never in parallel.** `importRows` uses `for` +
   `await` on purpose. Under `Promise.all`, N rows sharing one
   not-yet-existing parent title each miss the lookup and each create their
   own parent — N duplicates. The `resolvedParentIds` map only works because
   writes are ordered. The `eslint-disable no-await-in-loop` comments mark
   this as deliberate.

2. **Parent titles match NORMALIZED; image filenames match EXACTLY.**
   `normalizeTitle()` (trim → collapse whitespace → lowercase) for parents,
   because real exports carry title noise. Strict equality for filenames,
   because a typo should fail visibly rather than bind to the wrong image.
   The asymmetry is intentional.

3. **`validateEmbedHtml` is a hard security gate.** Only a single `<iframe>`
   with an https `src` on youtube.com / www.youtube.com /
   www.youtube-nocookie.com / open.spotify.com. It rejects `on*` handlers,
   `srcdoc`, `data:`/`javascript:` URIs, userinfo tricks
   (`https://youtube.com@evil.com`), lookalike hosts
   (`youtube.com.evil.com`), and multiple iframes. 17 adversarial tests in
   Appendix B. **Touch this file → re-run all 17 before merging.** It is the
   one place where a mistake becomes stored XSS on trauma-support content.

4. **All of an aspect's routes go in ONE `registerRoute` call.** The
   platform's route slot is keyed by aspect id, so a second call from the
   same aspect *replaces* the first. No error, no warning — the earlier
   routes silently stop existing. This already cost real debugging time.

## Known gaps — flagged, not hidden

Ranked by likelihood of biting. None are fixed:

- **Re-importing the same CSV creates duplicates.** Pages are not idempotent;
  only parents dedupe.
- **A row naming an image that was not uploaded fails silently** — the page is
  created without it. Only the inverse case warns.
- **The import is not atomic.** Per-row failures are recorded and the batch
  continues; a partial batch is a real outcome.

A dry-run/preview step before committing would address all three at once.
Recommended, not built.

## One environment gotcha

A UTF-8 BOM at the start of the CSV corrupts the **first** header key, so
every row silently gets an empty body — no error, content just vanishes.
`papaparse` handles it; any server-side or Python re-parse must use
`encoding='utf-8-sig'`. This actually happened.

---

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


---

# APPENDIX A — Full source
Verbatim from branch `claude/knowledge-library-admin-19b540` @ `497a9b4`.

## 1. CSV → row mapping (browser)

`knowledge-library/admin/manage-knowledge-library/csv-row-mapping.ts`

```ts
import type { ImportRowInput } from '@helemclub/knowledge-library.hooks.use-knowledge-pages';

/**
 * exact CSV column headers this feature's semi-automatic import expects, per
 * the design doc's sample export.
 */
const COLUMN = {
  text: 'Text',
  imageFilename: 'Image filename',
  videoHtmlEmbed: 'Video HTML embed',
  videoUrl: 'Video URL (YouTube/Spotify)',
  date: 'Date',
  currentPageTitle: 'Current page title',
  currentPageUrl: 'Current page URL',
  parentPageTitle: 'Parent page title (hierarchy)',
} as const;

/**
 * map one parsed CSV record (header -> cell value, as papaparse's
 * header:true mode produces) into an import row. returns null for a row
 * with no page title — nothing to create.
 */
export function mapCsvRecordToRow(record: Record<string, string>): ImportRowInput | null {
  const currentPageTitle = (record[COLUMN.currentPageTitle] || '').trim();
  if (!currentPageTitle) return null;

  return {
    text: record[COLUMN.text] || undefined,
    imageFilename: record[COLUMN.imageFilename]?.trim() || undefined,
    videoHtmlEmbed: record[COLUMN.videoHtmlEmbed] || undefined,
    videoUrl: record[COLUMN.videoUrl] || undefined,
    date: record[COLUMN.date] || undefined,
    currentPageTitle,
    currentPageUrl: record[COLUMN.currentPageUrl] || undefined,
    parentPageTitle: record[COLUMN.parentPageTitle] || undefined,
  };
}
```

## 2. Import screen (browser)

`knowledge-library/admin/manage-knowledge-library/import-tab.tsx`

```tsx
import React, { useMemo, useState } from 'react';
import Papa from 'papaparse';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { SelectList } from '@helemclub/design.inputs.select-list';
import {
  useKnowledgePages,
  useImportKnowledgePages,
  useUploadKnowledgeLibraryImage,
} from '@helemclub/knowledge-library.hooks.use-knowledge-pages';
import type { ImportRowInput, ImportSummaryResult } from '@helemclub/knowledge-library.hooks.use-knowledge-pages';
import { mapCsvRecordToRow } from './csv-row-mapping.js';
import styles from './manage-knowledge-library.module.scss';

function dropZoneProps(onFiles: (files: FileList) => void, isDragging: boolean, setIsDragging: (v: boolean) => void) {
  return {
    onDragOver: (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      if (event.dataTransfer.files.length) onFiles(event.dataTransfer.files);
    },
  };
}

export function ImportTab() {
  const { pages } = useKnowledgePages();
  const { importPages, loading: importing } = useImportKnowledgePages();
  const { uploadImage, uploading } = useUploadKnowledgeLibraryImage();

  const [csvFile, setCsvFile] = useState<File | undefined>(undefined);
  const [csvRows, setCsvRows] = useState<ImportRowInput[]>([]);
  const [csvError, setCsvError] = useState<string | undefined>(undefined);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [topAnchorParentId, setTopAnchorParentId] = useState<string>('');
  const [summary, setSummary] = useState<ImportSummaryResult | undefined>(undefined);
  const [isCsvDragging, setIsCsvDragging] = useState(false);
  const [isImagesDragging, setIsImagesDragging] = useState(false);

  const topAnchorOptions = useMemo(
    () => [{ value: '', label: 'ללא (עמוד עליון)' }, ...pages.map((page) => ({ value: page.id, label: page.title }))],
    [pages]
  );

  const referencedImageFilenames = useMemo(
    () => new Set(csvRows.map((row) => row.imageFilename).filter(Boolean) as string[]),
    [csvRows]
  );

  const handleCsvFiles = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    setCsvFile(file);
    setCsvError(undefined);
    setSummary(undefined);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const rows = results.data.map(mapCsvRecordToRow).filter((row): row is ImportRowInput => row !== null);
        if (!rows.length) {
          setCsvError('לא נמצאו שורות עם כותרת עמוד בקובץ ה-CSV.');
          return;
        }
        setCsvRows(rows);
      },
      error: (err: Error) => setCsvError(`קריאת קובץ ה-CSV נכשלה: ${err.message}`),
    });
  };

  const handleImageFiles = (files: FileList) => {
    setImageFiles((prev) => [...prev, ...Array.from(files)]);
  };

  const removeImageFile = (name: string) => {
    setImageFiles((prev) => prev.filter((file) => file.name !== name));
  };

  const handleRunImport = async () => {
    setSummary(undefined);
    setCsvError(undefined);

    const imagesByFilename: { filename: string; url: string }[] = [];
    // eslint-disable-next-line no-restricted-syntax
    for (const file of imageFiles) {
      // eslint-disable-next-line no-await-in-loop
      const url = await uploadImage(file);
      if (url) imagesByFilename.push({ filename: file.name, url });
    }

    const result = await importPages(csvRows, imagesByFilename, topAnchorParentId || null);
    if (result) setSummary(result);
  };

  return (
    <div>
      <div className={styles.headerRow}>
        <div>
          <h2 className={styles.title}>ייבוא מקובץ CSV</h2>
          <p className={styles.subtitle}>
            העלאה חצי-אוטומטית של סדרת עמודים: קובץ CSV + קבצי התמונות שהוא מפנה אליהם, ועמוד-אב עליון לכל האצווה.
          </p>
        </div>
      </div>

      <div className={styles.formField}>
        <span className={styles.formLabel}>עמוד-אב עליון לכל האצווה</span>
        <SelectList
          searchable
          options={topAnchorOptions}
          value={topAnchorParentId}
          onChange={(value) => setTopAnchorParentId(value as string)}
        />
      </div>

      <div
        className={classNames(styles.dropZone, isCsvDragging && styles.dropZoneActive)}
        {...dropZoneProps(handleCsvFiles, isCsvDragging, setIsCsvDragging)}
      >
        {csvFile ? (
          <p>
            📄 {csvFile.name} — {csvRows.length} שורות
          </p>
        ) : (
          <p>גררו לכאן את קובץ ה-CSV, או</p>
        )}
        <input
          type="file"
          accept=".csv,text/csv"
          className={styles.hiddenFileInput}
          id="knowledge-library-csv-input"
          onChange={(event) => event.target.files && handleCsvFiles(event.target.files)}
        />
        <label htmlFor="knowledge-library-csv-input" className={styles.dropZoneButton}>
          בחירת קובץ CSV
        </label>
      </div>
      {csvError && <div className={styles.errorBanner}>{csvError}</div>}

      <div
        className={classNames(styles.dropZone, isImagesDragging && styles.dropZoneActive)}
        {...dropZoneProps(handleImageFiles, isImagesDragging, setIsImagesDragging)}
      >
        <p>גררו לכאן את קבצי התמונות (יותאמו לפי שם הקובץ בעמודת Image filename), או</p>
        <input
          type="file"
          accept="image/*"
          multiple
          className={styles.hiddenFileInput}
          id="knowledge-library-images-input"
          onChange={(event) => event.target.files && handleImageFiles(event.target.files)}
        />
        <label htmlFor="knowledge-library-images-input" className={styles.dropZoneButton}>
          בחירת קבצי תמונה
        </label>
        {imageFiles.length > 0 && (
          <ul className={styles.fileList}>
            {imageFiles.map((file) => {
              const isReferenced = referencedImageFilenames.has(file.name);
              return (
                <li key={file.name} className={styles.fileListItem}>
                  {isReferenced ? '🖼️' : '⚠️'} {file.name}
                  {!isReferenced && <span className={styles.fileListWarning}> — לא מוזכר בשום שורה ב-CSV</span>}
                  <button type="button" onClick={() => removeImageFile(file.name)} className={styles.fileRemoveButton}>
                    הסרה
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className={styles.formActions}>
        <Button
          variant="primary"
          disabled={!csvRows.length}
          loading={importing || uploading}
          onClick={() => handleRunImport()}
        >
          הרצת ייבוא ({csvRows.length} שורות)
        </Button>
      </div>

      {summary && (
        <div className={styles.importSummary}>
          <h3 className={styles.formTitle}>סיכום ייבוא</h3>
          <p>✅ {summary.createdPageIds.length} עמודים נוצרו</p>
          {summary.matchedExistingParents.length > 0 && (
            <p>🔗 שויכו לעמודי-אב קיימים: {summary.matchedExistingParents.join(', ')}</p>
          )}
          {summary.createdParents.length > 0 && (
            <p>🆕 נוצרו עמודי-אב חדשים: {summary.createdParents.join(', ')}</p>
          )}
          {summary.rejected.length > 0 && (
            <div className={styles.errorBanner}>
              <p>❌ {summary.rejected.length} שורות נדחו:</p>
              <ul>
                {summary.rejected.map((rejection) => (
                  <li key={rejection.currentPageTitle}>
                    {rejection.currentPageTitle} — {rejection.reason}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

## 3. Apollo mutation hook (browser)

`knowledge-library/hooks/use-knowledge-pages/use-import-knowledge-pages.ts`

```ts
import { gql } from '@apollo/client';
import { useMutation } from '@apollo/client/react';

export type ImportRowInput = {
  text?: string;
  imageFilename?: string;
  videoHtmlEmbed?: string;
  videoUrl?: string;
  date?: string;
  currentPageTitle: string;
  currentPageUrl?: string;
  parentPageTitle?: string;
};

export type ImageMappingInput = { filename: string; url: string };

export type ImportSummaryResult = {
  createdPageIds: string[];
  matchedExistingParents: string[];
  createdParents: string[];
  rejected: { currentPageTitle: string; reason: string }[];
};

export const IMPORT_KNOWLEDGE_PAGES_MUTATION = gql`
  mutation ImportKnowledgeLibraryPages(
    $rows: [KnowledgeLibraryImportRow!]!
    $images: [KnowledgeLibraryImageMapping!]
    $topAnchorParentId: String
  ) {
    importKnowledgeLibraryPages(rows: $rows, images: $images, topAnchorParentId: $topAnchorParentId) {
      createdPageIds
      matchedExistingParents
      createdParents
      rejected {
        currentPageTitle
        reason
      }
    }
  }
`;

/**
 * bulk-imports a CSV-derived batch of rows as knowledge-library pages,
 * anchored under an optional top-level parent for the whole batch.
 */
export function useImportKnowledgePages() {
  const [mutate, results] = useMutation<{ importKnowledgeLibraryPages: ImportSummaryResult }>(
    IMPORT_KNOWLEDGE_PAGES_MUTATION
  );

  const importPages = async (
    rows: ImportRowInput[],
    images: ImageMappingInput[],
    topAnchorParentId: string | null
  ) => {
    const result = await mutate({ variables: { rows, images, topAnchorParentId } });
    return result.data?.importKnowledgeLibraryPages;
  };

  return {
    importPages,
    loading: results.loading,
    error: results.error?.message,
  };
}
```

## 4. Import engine (server)

`knowledge-library/knowledge-library/knowledge-library-importer.ts`

```ts
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
   * import a CSV-derived batch of rows as knowledge-library pages, anchored
   * under an optional top-level parent for the whole batch. rows are
   * processed sequentially, not in parallel — when several rows reference
   * the same not-yet-existing parent title, only the first row creates it
   * and every later row in the same batch reuses it, avoiding a race that
   * would otherwise fork duplicate parent pages.
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
        // eslint-disable-next-line no-await-in-loop
        const parentId = await this.resolveParentId(row.parentPageTitle, topAnchorParentId, resolvedParentIds, summary);
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
    topAnchorParentId: string | null,
    resolvedParentIds: Map<string, string>,
    summary: ImportSummary
  ): Promise<string | null> {
    if (!parentPageTitle || !parentPageTitle.trim()) return topAnchorParentId;

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
      parentId: topAnchorParentId,
    });
    resolvedParentIds.set(normalized, created.id);
    summary.createdParents.push(created.title);
    return created.id;
  }
}
```

## 5. Page writes + validation (server)

`knowledge-library/knowledge-library/knowledge-page-repository.ts`

```ts
import { ReturnModelType } from '@typegoose/typegoose';
import { KnowledgePageModel } from './knowledge-page.model.js';
import { validateEmbedHtml } from './embed-allowlist.js';
import { HELEM_CLUB_AUTHOR_NAME } from '@helemclub/knowledge-library.entities.knowledge-page';
import type { ListPagesOptions, CreatePageOptions, UpdatePageOptions } from '@helemclub/knowledge-library.entities.knowledge-page';

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
      mediaType: options.mediaType,
      durationSec: options.durationSec,
      viewCount: 0,
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
    if (options.mediaType !== undefined) update.mediaType = options.mediaType;
    if (options.durationSec !== undefined) update.durationSec = options.durationSec;
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
   * atomically bump a page's view counter. deliberately NOT gated by
   * isPublished/auth: an unpublished page is already unreachable through the
   * read resolvers, so there is nothing to count against it.
   */
  async incrementView(id: string): Promise<boolean> {
    const result = await this.knowledgePageModel.updateOne({ id }, { $inc: { viewCount: 1 } });
    return result.modifiedCount > 0;
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
```

## 6. Embed security gate (server)

`knowledge-library/knowledge-library/embed-allowlist.ts`

```ts
/**
 * validates a pasted "embed code" string for a knowledge-library page. only a
 * single, well-formed `<iframe>` whose `src` resolves to an allowed YouTube or
 * Spotify embed host is accepted — everything else is rejected outright. this
 * is a deliberate narrowing (agreed in the design) of "paste any embed HTML"
 * to prevent an admin-pasted `<script>`/`onerror` handler from running in
 * every visitor's browser. no HTML sanitizer library is used: the input is
 * either exactly this one safe shape, or it is refused, not partially cleaned.
 */

const ALLOWED_EMBED_HOSTS = new Set(['www.youtube.com', 'youtube.com', 'www.youtube-nocookie.com', 'open.spotify.com']);

const SINGLE_IFRAME_PATTERN = /^\s*<iframe\b[^>]*>\s*<\/iframe>\s*$/i;
const SRC_ATTRIBUTE_PATTERN = /\bsrc\s*=\s*"([^"]*)"|\bsrc\s*=\s*'([^']*)'/i;
const DISALLOWED_ATTRIBUTE_PATTERN = /\b(on\w+|srcdoc)\s*=/i;

/**
 * true if the given src resolves to an allowed embed host over https, with no
 * userinfo (`https://user@host` tricks) and no lookalike subdomain
 * (`youtube.com.evil.com` fails: its hostname is `youtube.com.evil.com`, not
 * `youtube.com`, so it never matches the exact allowlist below).
 */
function isAllowedEmbedSrc(src: string): boolean {
  let url: URL;
  try {
    url = new URL(src);
  } catch {
    return false;
  }
  if (url.protocol !== 'https:') return false;
  if (url.username || url.password) return false;
  return ALLOWED_EMBED_HOSTS.has(url.hostname.toLowerCase());
}

/**
 * validate an admin-pasted embed snippet. returns the trimmed, accepted
 * snippet on success, or null if it doesn't match the strict allowed shape.
 */
export function validateEmbedHtml(rawHtml: string | undefined | null): string | null {
  if (!rawHtml) return null;
  const html = rawHtml.trim();
  if (!html) return null;

  if (!SINGLE_IFRAME_PATTERN.test(html)) return null;
  if (DISALLOWED_ATTRIBUTE_PATTERN.test(html)) return null;

  const srcMatch = SRC_ATTRIBUTE_PATTERN.exec(html);
  const src = srcMatch?.[1] ?? srcMatch?.[2];
  if (!src || !isAllowedEmbedSrc(src)) return null;

  return html;
}
```

---

# APPENDIX B — Tests

## Importer tests

`knowledge-library/knowledge-library/knowledge-library-importer.spec.ts`

```ts
import { KnowledgeLibraryImporter } from './knowledge-library-importer.js';
import { normalizeTitle } from './knowledge-page-repository.js';
import type { ImportRow } from './knowledge-library-importer.js';

/**
 * a fake repository that behaves like the real one for the importer's
 * purposes: createPage assigns a sequential id and title, findByNormalizedTitle
 * looks up previously created pages by normalized title.
 */
function fakeRepository() {
  const pages: { id: string; title: string; normalizedTitle: string; parentId: string | null }[] = [];
  let nextId = 1;

  return {
    pages,
    createPage: async (options: { title: string; parentId?: string | null }) => {
      const page = {
        id: `page-${nextId++}`,
        title: options.title,
        normalizedTitle: normalizeTitle(options.title),
        parentId: options.parentId ?? null,
      };
      pages.push(page);
      return page;
    },
    findByNormalizedTitle: async (title: string) => {
      const normalized = normalizeTitle(title);
      return pages.find((page) => page.normalizedTitle === normalized) || null;
    },
  };
}

const SERIES_TITLE = 'מה זה פוסט טראומה והאם יש לי כזו?';

function chapterRow(title: string, overrides: Partial<ImportRow> = {}): ImportRow {
  return {
    text: 'טקסט לדוגמה',
    currentPageTitle: title,
    parentPageTitle: SERIES_TITLE,
    ...overrides,
  };
}

it('auto-creates a missing parent once and anchors it under the batch top-anchor', async () => {
  const repo = fakeRepository();
  const importer = new KnowledgeLibraryImporter(repo as never);

  const rows: ImportRow[] = [
    chapterRow('איך נראים החיים שלך בזמן האחרון?'),
    chapterRow('לפעמים המוח פשוט קצת נדפק'),
  ];

  const summary = await importer.importRows(rows, {}, 'ezra-rishona-id');

  expect(summary.createdParents).toEqual([SERIES_TITLE]);
  expect(summary.rejected).toEqual([]);
  expect(summary.createdPageIds).toHaveLength(2);

  const seriesPage = repo.pages.find((page) => page.title === SERIES_TITLE);
  expect(seriesPage?.parentId).toBe('ezra-rishona-id');

  const chapter1 = repo.pages.find((page) => page.title === rows[0].currentPageTitle);
  const chapter2 = repo.pages.find((page) => page.title === rows[1].currentPageTitle);
  expect(chapter1?.parentId).toBe(seriesPage?.id);
  expect(chapter2?.parentId).toBe(seriesPage?.id);
});

it('reuses the same auto-created parent across every row in the batch instead of creating it twice', async () => {
  const repo = fakeRepository();
  const importer = new KnowledgeLibraryImporter(repo as never);

  const rows: ImportRow[] = Array.from({ length: 6 }, (_, i) => chapterRow(`פרק ${i + 1}`));
  await importer.importRows(rows, {}, null);

  const seriesPages = repo.pages.filter((page) => page.title === SERIES_TITLE);
  expect(seriesPages).toHaveLength(1);
});

it('matches an already-existing parent instead of creating a duplicate, tolerating whitespace/casing noise', async () => {
  const repo = fakeRepository();
  await repo.createPage({ title: SERIES_TITLE, parentId: 'ezra-rishona-id' });
  const importer = new KnowledgeLibraryImporter(repo as never);

  const summary = await importer.importRows(
    [chapterRow('פרק חדש', { parentPageTitle: `  ${SERIES_TITLE}   ` })],
    {},
    null
  );

  expect(summary.createdParents).toEqual([]);
  expect(summary.matchedExistingParents).toEqual([SERIES_TITLE]);
  expect(repo.pages.filter((page) => page.title === SERIES_TITLE)).toHaveLength(1);
});

it('a row with no parent title is anchored directly under the top-anchor', async () => {
  const repo = fakeRepository();
  const importer = new KnowledgeLibraryImporter(repo as never);

  await importer.importRows([{ currentPageTitle: 'עמוד ללא הורה', text: '' }], {}, 'top-id');

  expect(repo.pages[0].parentId).toBe('top-id');
});

it('maps an image filename to its uploaded URL via the provided mapping', async () => {
  const repo = fakeRepository();
  let capturedImage: string | undefined;
  const repoWithImageCapture = {
    ...repo,
    createPage: async (options: { title: string; image?: string; parentId?: string | null }) => {
      capturedImage = options.image;
      return repo.createPage(options);
    },
  };
  const importer = new KnowledgeLibraryImporter(repoWithImageCapture as never);

  await importer.importRows(
    [{ currentPageTitle: 'x', imageFilename: 'photo.png' }],
    { 'photo.png': 'https://res.cloudinary.com/demo/photo.png' },
    null
  );

  expect(capturedImage).toBe('https://res.cloudinary.com/demo/photo.png');
});

it('collects a rejection with reason instead of throwing, when a row has an invalid embed', async () => {
  const repo = fakeRepository();
  const failingRepo = {
    ...repo,
    createPage: async () => {
      throw new Error('videoEmbedHtml must be a single iframe embed from an allowed host (YouTube or Spotify)');
    },
  };
  const importer = new KnowledgeLibraryImporter(failingRepo as never);

  const summary = await importer.importRows(
    [{ currentPageTitle: 'עמוד עם embed לא תקין', videoHtmlEmbed: '<script>alert(1)</script>' }],
    {},
    null
  );

  expect(summary.createdPageIds).toEqual([]);
  expect(summary.rejected).toEqual([
    { currentPageTitle: 'עמוד עם embed לא תקין', reason: expect.stringContaining('allowed host') },
  ]);
});

it('one rejected row does not stop the rest of the batch from importing', async () => {
  const repo = fakeRepository();
  let callCount = 0;
  const flakyRepo = {
    ...repo,
    createPage: async (options: { title: string; parentId?: string | null }) => {
      callCount += 1;
      if (callCount === 1) throw new Error('bad row');
      return repo.createPage(options);
    },
  };
  const importer = new KnowledgeLibraryImporter(flakyRepo as never);

  const summary = await importer.importRows(
    [{ currentPageTitle: 'עמוד פגום' }, { currentPageTitle: 'עמוד תקין' }],
    {},
    null
  );

  expect(summary.rejected).toHaveLength(1);
  expect(summary.createdPageIds).toHaveLength(1);
});
```

## CSV mapping tests

`knowledge-library/admin/manage-knowledge-library/csv-row-mapping.spec.ts`

```ts
import { mapCsvRecordToRow } from './csv-row-mapping.js';

const SAMPLE_RECORD = {
  Text: 'טקסט לדוגמה',
  'Image filename': '',
  'Video HTML embed': '<iframe src="https://www.youtube.com/embed/abc"></iframe>',
  'Video URL (YouTube/Spotify)': 'https://www.youtube.com/watch?v=abc',
  Date: '2023-09-11',
  'Current page title': 'איך נראים החיים שלך בזמן האחרון?',
  'Current page URL': 'https://helem.club/home/start/',
  'Parent page title (hierarchy)': 'מה זה פוסט טראומה והאם יש לי כזו?',
};

it('maps every CSV column to its corresponding import row field', () => {
  expect(mapCsvRecordToRow(SAMPLE_RECORD)).toEqual({
    text: 'טקסט לדוגמה',
    imageFilename: undefined,
    videoHtmlEmbed: '<iframe src="https://www.youtube.com/embed/abc"></iframe>',
    videoUrl: 'https://www.youtube.com/watch?v=abc',
    date: '2023-09-11',
    currentPageTitle: 'איך נראים החיים שלך בזמן האחרון?',
    currentPageUrl: 'https://helem.club/home/start/',
    parentPageTitle: 'מה זה פוסט טראומה והאם יש לי כזו?',
  });
});

it('returns null for a row with no page title — nothing to create', () => {
  expect(mapCsvRecordToRow({ ...SAMPLE_RECORD, 'Current page title': '' })).toBeNull();
  expect(mapCsvRecordToRow({ ...SAMPLE_RECORD, 'Current page title': '   ' })).toBeNull();
});

it('maps a populated image filename', () => {
  const row = mapCsvRecordToRow({ ...SAMPLE_RECORD, 'Image filename': 'photo.png' });
  expect(row?.imageFilename).toBe('photo.png');
});

it('leaves optional empty columns undefined rather than empty strings', () => {
  const row = mapCsvRecordToRow({
    ...SAMPLE_RECORD,
    'Video HTML embed': '',
    'Video URL (YouTube/Spotify)': '',
    'Parent page title (hierarchy)': '',
  });
  expect(row?.videoHtmlEmbed).toBeUndefined();
  expect(row?.videoUrl).toBeUndefined();
  expect(row?.parentPageTitle).toBeUndefined();
});
```

## Embed allowlist tests (17 adversarial cases)

`knowledge-library/knowledge-library/embed-allowlist.spec.ts`

```ts
import { validateEmbedHtml } from './embed-allowlist.js';

it('accepts a plain YouTube iframe embed', () => {
  const html = '<iframe width="773" height="360" src="https://www.youtube.com/embed/GpndsBhe2mQ?rel=0"></iframe>';
  expect(validateEmbedHtml(html)).toEqual(html.trim());
});

it('accepts a Spotify iframe embed', () => {
  const html = '<iframe src="https://open.spotify.com/embed/episode/abc123"></iframe>';
  expect(validateEmbedHtml(html)).toEqual(html);
});

it('accepts youtube-nocookie.com', () => {
  const html = '<iframe src="https://www.youtube-nocookie.com/embed/abc"></iframe>';
  expect(validateEmbedHtml(html)).toEqual(html);
});

it('rejects empty or missing input', () => {
  expect(validateEmbedHtml('')).toBeNull();
  expect(validateEmbedHtml(undefined)).toBeNull();
  expect(validateEmbedHtml(null)).toBeNull();
  expect(validateEmbedHtml('   ')).toBeNull();
});

it('rejects a script tag', () => {
  expect(validateEmbedHtml('<script>alert(1)</script>')).toBeNull();
});

it('rejects an iframe with an inline event handler', () => {
  expect(validateEmbedHtml('<iframe src="https://www.youtube.com/embed/x" onload="alert(1)"></iframe>')).toBeNull();
});

it('rejects an iframe using srcdoc instead of src', () => {
  expect(validateEmbedHtml('<iframe srcdoc="<script>alert(1)</script>"></iframe>')).toBeNull();
});

it('rejects a non-allowlisted host', () => {
  expect(validateEmbedHtml('<iframe src="https://evil.com/embed"></iframe>')).toBeNull();
});

it('rejects a lookalike host (youtube.com.evil.com)', () => {
  expect(validateEmbedHtml('<iframe src="https://www.youtube.com.evil.com/embed/x"></iframe>')).toBeNull();
});

it('rejects a lookalike host as a path, not a hostname (evil.com/youtube.com)', () => {
  expect(validateEmbedHtml('<iframe src="https://evil.com/youtube.com/embed/x"></iframe>')).toBeNull();
});

it('rejects a non-https protocol', () => {
  expect(validateEmbedHtml('<iframe src="http://www.youtube.com/embed/x"></iframe>')).toBeNull();
});

it('rejects a data: URI src', () => {
  expect(validateEmbedHtml('<iframe src="data:text/html,<script>alert(1)</script>"></iframe>')).toBeNull();
});

it('rejects a javascript: URI src', () => {
  expect(validateEmbedHtml('<iframe src="javascript:alert(1)"></iframe>')).toBeNull();
});

it('rejects userinfo tricks in the src (https://youtube.com@evil.com)', () => {
  expect(validateEmbedHtml('<iframe src="https://www.youtube.com@evil.com/embed/x"></iframe>')).toBeNull();
});

it('rejects more than one iframe', () => {
  const html =
    '<iframe src="https://www.youtube.com/embed/a"></iframe><iframe src="https://www.youtube.com/embed/b"></iframe>';
  expect(validateEmbedHtml(html)).toBeNull();
});

it('rejects an iframe followed by trailing markup', () => {
  expect(validateEmbedHtml('<iframe src="https://www.youtube.com/embed/x"></iframe><script>alert(1)</script>')).toBeNull();
});

it('rejects an iframe with no src at all', () => {
  expect(validateEmbedHtml('<iframe width="100"></iframe>')).toBeNull();
});
```

---

# APPENDIX C — GraphQL contract

`knowledge-library/knowledge-library/knowledge-library.graphql.ts` (relevant slices)

## Schema

```graphql
      input KnowledgeLibraryImportRow {
        text: String
        imageFilename: String
        videoHtmlEmbed: String
        videoUrl: String
        date: String
        currentPageTitle: String!
        currentPageUrl: String
        parentPageTitle: String
      }

      input KnowledgeLibraryImageMapping {
        filename: String!
        url: String!
      }

      type KnowledgeLibraryImportRejection {
        currentPageTitle: String!
        reason: String!
      }

      type KnowledgeLibraryImportSummary {
        createdPageIds: [String]
        matchedExistingParents: [String]
        createdParents: [String]
        rejected: [KnowledgeLibraryImportRejection]
      }
```

Mutation signature:

```graphql
importKnowledgeLibraryPages(
  rows: [KnowledgeLibraryImportRow!]!
  images: [KnowledgeLibraryImageMapping!]
  topAnchorParentId: String
): KnowledgeLibraryImportSummary
```

## Resolver

```ts
        importKnowledgeLibraryPages: async (
          _req: unknown,
          {
            rows,
            images,
            topAnchorParentId,
          }: { rows: ImportRow[]; images?: { filename: string; url: string }[]; topAnchorParentId?: string },
          context: ResolverContext
        ) => {
          await assertCanManage(context, knowledgeLibrary);
          const imagesByFilename = Object.fromEntries((images || []).map((image) => [image.filename, image.url]));
          return knowledgeLibrary.importPages(rows, imagesByFilename, topAnchorParentId || null);
        },
```

## Authorization helpers used above

```ts
const STAFF_ROLES = ['moderator', 'admin'];

/**
 * a caller may manage knowledge-library content if they hold a staff role
 * (moderator/admin) OR are on this feature's own editor allowlist — the
 * allowlist check is a DB lookup, so this is async, unlike knowledge-base's
 * role-only assertCanManage.
 */
async function canManage(context: ResolverContext, knowledgeLibrary: KnowledgeLibraryNode): Promise<boolean> {
  const user = context?.session?.user;
  if (!user) return false;
  if (user.role && STAFF_ROLES.includes(user.role)) return true;
  return knowledgeLibrary.isEditor(user.id);
}

async function assertCanManage(context: ResolverContext, knowledgeLibrary: KnowledgeLibraryNode): Promise<void> {
  if (!(await canManage(context, knowledgeLibrary))) throw new AccessDenied();
}

/**
 * granting/revoking editor access is admin-only — an editor themselves
 * can't add other editors.
 */
function assertIsAdmin(context: ResolverContext): void {
  if (context?.session?.user?.role !== 'admin') {
    throw new AccessDenied();
  }
}
```
