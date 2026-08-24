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

it('a manually-chosen top-anchor overrides the CSV parent-title column outright', async () => {
  const repo = fakeRepository();
  const importer = new KnowledgeLibraryImporter(repo as never);

  const rows: ImportRow[] = [
    chapterRow('איך נראים החיים שלך בזמן האחרון?'),
    chapterRow('לפעמים המוח פשוט קצת נדפק'),
  ];

  const summary = await importer.importRows(rows, {}, 'ezra-rishona-id');

  // the manual top-anchor choice wins for the whole batch — the CSV's own
  // "Parent page title" column (SERIES_TITLE) is ignored entirely, so no
  // series parent page gets created; every row is anchored directly under
  // the chosen top-anchor.
  expect(summary.createdParents).toEqual([]);
  expect(summary.rejected).toEqual([]);
  expect(summary.createdPageIds).toHaveLength(2);

  const chapter1 = repo.pages.find((page) => page.title === rows[0].currentPageTitle);
  const chapter2 = repo.pages.find((page) => page.title === rows[1].currentPageTitle);
  expect(chapter1?.parentId).toBe('ezra-rishona-id');
  expect(chapter2?.parentId).toBe('ezra-rishona-id');
});

it('without a manual top-anchor, the CSV parent-title column drives the hierarchy (auto-creating the series parent once)', async () => {
  const repo = fakeRepository();
  const importer = new KnowledgeLibraryImporter(repo as never);

  const rows: ImportRow[] = [
    chapterRow('איך נראים החיים שלך בזמן האחרון?'),
    chapterRow('לפעמים המוח פשוט קצת נדפק'),
  ];

  const summary = await importer.importRows(rows, {}, null);

  expect(summary.createdParents).toEqual([SERIES_TITLE]);
  expect(summary.rejected).toEqual([]);
  expect(summary.createdPageIds).toHaveLength(2);

  const seriesPage = repo.pages.find((page) => page.title === SERIES_TITLE);
  expect(seriesPage?.parentId).toBe(null);

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
