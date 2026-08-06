import { KnowledgePageRepository, normalizeTitle } from './knowledge-page-repository.js';

/**
 * these tests pin the hierarchy invariants: ancestorIds is computed from the
 * parent chain on create, re-parenting cascades to every descendant (not
 * just the moved page), cycles are rejected, and an invalid embed snippet is
 * refused at the repository (the single choke point both the admin form and
 * the CSV importer route through). fake models capture queries/updates, same
 * style as toolbox/toolbox/app-repository.spec.ts.
 */

function fakePage(overrides: Partial<{ id: string; ancestorIds: string[]; parentId: string | null }> = {}) {
  return {
    id: 'page-1',
    ancestorIds: [],
    parentId: null,
    ...overrides,
    toObject() {
      return { ...this };
    },
  };
}

it('normalizeTitle trims, collapses whitespace and lower-cases', () => {
  expect(normalizeTitle('  מה  זה\tפוסט טראומה?  ')).toBe('מה זה פוסט טראומה?');
  expect(normalizeTitle('Hello   World')).toBe('hello world');
});

it('createPage computes ancestorIds from the parent chain', async () => {
  let created: Record<string, unknown> = {};
  const model = {
    findOne: (query: Record<string, unknown>) => {
      if (query.id === 'parent-1') {
        return Promise.resolve(fakePage({ id: 'parent-1', ancestorIds: ['root-1'] }));
      }
      return Promise.resolve(null);
    },
    exists: () => Promise.resolve(false),
    create: (doc: Record<string, unknown>) => {
      created = doc;
      return Promise.resolve(fakePage({ id: doc.id as string }));
    },
  };
  const repo = new KnowledgePageRepository(model as never);

  await repo.createPage({ title: 'פרק א', body: 'טקסט', parentId: 'parent-1' });

  expect(created.ancestorIds).toEqual(['root-1', 'parent-1']);
  expect(created.authorName).toBe('הלם קלאב');
  expect(created.isStaffAuthor).toBe(true);
});

it('createPage defaults to an empty ancestor chain for a top-level page', async () => {
  let created: Record<string, unknown> = {};
  const model = {
    findOne: () => Promise.resolve(null),
    exists: () => Promise.resolve(false),
    create: (doc: Record<string, unknown>) => {
      created = doc;
      return Promise.resolve(fakePage());
    },
  };
  const repo = new KnowledgePageRepository(model as never);

  await repo.createPage({ title: 'עזרה ראשונה', body: '' });

  expect(created.ancestorIds).toEqual([]);
  expect(created.parentId).toBeNull();
});

it('createPage accepts a valid allowlisted embed and rejects an invalid one', async () => {
  const model = {
    findOne: () => Promise.resolve(null),
    exists: () => Promise.resolve(false),
    create: (doc: Record<string, unknown>) => Promise.resolve(fakePage({ id: doc.id as string })),
  };
  const repo = new KnowledgePageRepository(model as never);

  await expect(
    repo.createPage({
      title: 'x',
      body: '',
      videoEmbedHtml: '<iframe src="https://www.youtube.com/embed/abc"></iframe>',
    })
  ).resolves.toBeTruthy();

  await expect(
    repo.createPage({ title: 'x', body: '', videoEmbedHtml: '<script>alert(1)</script>' })
  ).rejects.toThrow(/allowed host/);
});

it('updatePage rejects setting a page as its own parent', async () => {
  const model = {
    findOne: (query: Record<string, unknown>) => {
      if (query.id === 'page-1') return Promise.resolve(fakePage({ id: 'page-1' }));
      return Promise.resolve(null);
    },
  };
  const repo = new KnowledgePageRepository(model as never);

  await expect(repo.updatePage('page-1', { parentId: 'page-1' })).rejects.toThrow(/its own parent/);
});

it('updatePage rejects moving a page under one of its own descendants', async () => {
  const model = {
    findOne: (query: Record<string, unknown>) => {
      if (query.id === 'page-1') return Promise.resolve(fakePage({ id: 'page-1' }));
      if (query.id === 'child-of-page-1') {
        return Promise.resolve(fakePage({ id: 'child-of-page-1', ancestorIds: ['page-1'] }));
      }
      return Promise.resolve(null);
    },
  };
  const repo = new KnowledgePageRepository(model as never);

  await expect(repo.updatePage('page-1', { parentId: 'child-of-page-1' })).rejects.toThrow(/own descendants/);
});

it('updatePage re-parenting cascades ancestorIds to every descendant, not just the moved page', async () => {
  const updates: { id: string; ancestorIds: string[] }[] = [];

  // tree before the move: page-1 (moving) -> child-a -> grandchild-a
  //                        new-parent (ancestorIds: [root])
  const model = {
    findOne: (query: Record<string, unknown>) => {
      if (query.id === 'page-1') return Promise.resolve(fakePage({ id: 'page-1', parentId: 'old-parent' }));
      if (query.id === 'new-parent') return Promise.resolve(fakePage({ id: 'new-parent', ancestorIds: ['root'] }));
      return Promise.resolve(null);
    },
    findOneAndUpdate: (_query: Record<string, unknown>, update: { $set: Record<string, unknown> }) => {
      return Promise.resolve(fakePage({ id: 'page-1', ancestorIds: update.$set.ancestorIds as string[] }));
    },
    find: (query: Record<string, unknown>) => {
      if (query.parentId === 'page-1') return Promise.resolve([fakePage({ id: 'child-a', parentId: 'page-1' })]);
      if (query.parentId === 'child-a') {
        return Promise.resolve([fakePage({ id: 'grandchild-a', parentId: 'child-a' })]);
      }
      return Promise.resolve([]);
    },
    updateOne: (query: { id: string }, update: { $set: { ancestorIds: string[] } }) => {
      updates.push({ id: query.id, ancestorIds: update.$set.ancestorIds });
      return Promise.resolve({ modifiedCount: 1 });
    },
  };
  const repo = new KnowledgePageRepository(model as never);

  await repo.updatePage('page-1', { parentId: 'new-parent' });

  expect(updates).toEqual([
    { id: 'child-a', ancestorIds: ['root', 'new-parent', 'page-1'] },
    { id: 'grandchild-a', ancestorIds: ['root', 'new-parent', 'page-1', 'child-a'] },
  ]);
});

it('findByNormalizedTitle looks up by the normalized form', async () => {
  let queried: Record<string, unknown> = {};
  const model = {
    findOne: (query: Record<string, unknown>) => {
      queried = query;
      return Promise.resolve(fakePage());
    },
  };
  const repo = new KnowledgePageRepository(model as never);

  await repo.findByNormalizedTitle('  מה  זה   פוסט טראומה?  ');
  expect(queried).toEqual({ normalizedTitle: 'מה זה פוסט טראומה?' });
});
