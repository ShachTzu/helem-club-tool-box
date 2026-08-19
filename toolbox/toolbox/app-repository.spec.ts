import { AppRepository } from './app-repository.js';

/**
 * deletion is ownership-scoped in the query. an empty userId must never be
 * treated as a wildcard: anonymised submissions carry submittedBy '', so a
 * blank owner would match every one of them.
 */
it('deleteOwnedApp refuses an empty userId instead of matching anonymised rows', async () => {
  const calls: unknown[] = [];
  const model = {
    deleteOne: async (filter: unknown) => {
      calls.push(filter);
      return { deletedCount: 1 };
    },
  };

  const removed = await new AppRepository(model as never).deleteOwnedApp('a1', '');

  expect(removed).toBe(false);
  expect(calls).toHaveLength(0);
});

it('anonymizeApp refuses an empty userId', async () => {
  const calls: unknown[] = [];
  const model = {
    findOneAndUpdate: async (filter: unknown) => {
      calls.push(filter);
      return null;
    },
  };

  const result = await new AppRepository(model as never).anonymizeApp('a1', '');

  expect(result).toBeNull();
  expect(calls).toHaveLength(0);
});

it('anonymizeApp clears the uploaded images, whose urls carry the member id', async () => {
  let update: { $set: Record<string, unknown> } | undefined;
  const model = {
    findOneAndUpdate: async (_filter: unknown, next: { $set: Record<string, unknown> }) => {
      update = next;
      return { toObject: () => ({ id: 'a1' }) };
    },
  };

  await new AppRepository(model as never).anonymizeApp('a1', 'user-1');

  expect(update?.$set.screenshots).toEqual([]);
  expect(update?.$set.icon).toBe('🧩');
  expect(update?.$set.contactEmail).toBe('');
  expect(update?.$set.submittedBy).toBe('');
  expect(update?.$set.moderationHistory).toEqual([]);
});
import type { SubmitAppInput } from './toolbox-options.js';

/**
 * these tests pin the ownership guard on drafts: every draft read/write must
 * filter by submittedBy in the query itself, so a member can never touch or
 * read another member's record (no IDOR). a fake model captures the query.
 */

const input: SubmitAppInput = { name: 'Test Tool', externalLink: 'https://example.com' };

function fakeDoc() {
  return { toObject: () => ({ id: 'a1', submittedBy: 'user-1', status: 'draft' }) };
}

it('getOwnedApp filters by id AND submittedBy (no IDOR)', async () => {
  let captured: Record<string, unknown> = {};
  const model = {
    findOne: (query: Record<string, unknown>) => {
      captured = query;
      return Promise.resolve(fakeDoc());
    },
  };
  const repo = new AppRepository(model as never);

  await repo.getOwnedApp('a1', 'user-1');
  expect(captured).toEqual({ id: 'a1', submittedBy: 'user-1' });
});

it('saveDraft with a draftId only updates an owned draft/changes-requested app', async () => {
  let filter: Record<string, unknown> = {};
  const model = {
    findOneAndUpdate: (f: Record<string, unknown>) => {
      filter = f;
      return Promise.resolve(fakeDoc());
    },
  };
  const repo = new AppRepository(model as never);

  await repo.saveDraft(input, 'user-1', 'a1');
  expect(filter.id).toBe('a1');
  expect(filter.submittedBy).toBe('user-1');
  expect(filter.status).toEqual({ $in: ['draft', 'changes_requested'] });
});

it('saveDraft without a draftId creates a new record with status draft', async () => {
  let createdStatus: unknown;
  const model = {
    findOne: () => Promise.resolve(null), // slug is free
    create: (doc: { status: string }) => {
      createdStatus = doc.status;
      return Promise.resolve(fakeDoc());
    },
  };
  const repo = new AppRepository(model as never);

  await repo.saveDraft(input, 'user-1');
  expect(createdStatus).toBe('draft');
});

it('submitDraft flips an owned draft to pending, ownership-filtered', async () => {
  let filter: Record<string, unknown> = {};
  let update: { $set: { status: string } } = { $set: { status: '' } };
  const model = {
    findOneAndUpdate: (f: Record<string, unknown>, u: { $set: { status: string } }) => {
      filter = f;
      update = u;
      return Promise.resolve(fakeDoc());
    },
  };
  const repo = new AppRepository(model as never);

  await repo.submitDraft('a1', input, 'user-1');
  expect(filter.submittedBy).toBe('user-1');
  expect(update.$set.status).toBe('pending');
});

it('createApp caps screenshots at 5 regardless of how many the client sends', async () => {
  let createdScreenshots: string[] = [];
  const model = {
    findOne: () => Promise.resolve(null), // slug is free
    create: (doc: { screenshots: string[] }) => {
      createdScreenshots = doc.screenshots;
      return Promise.resolve(fakeDoc());
    },
  };
  const repo = new AppRepository(model as never);

  const withTooManyScreenshots: SubmitAppInput = {
    ...input,
    screenshots: ['1', '2', '3', '4', '5', '6', '7'].map(
      (n) => `https://res.cloudinary.com/demo/image/upload/${n}.png`
    ),
  };
  await repo.createApp(withTooManyScreenshots, 'user-1');
  expect(createdScreenshots).toHaveLength(5);
});

it('createApp drops icon/screenshots urls not hosted on Cloudinary (the signed upload can never produce them)', async () => {
  let created: { icon: string; screenshots: string[] } = { icon: '', screenshots: [] };
  const model = {
    findOne: () => Promise.resolve(null),
    create: (doc: { icon: string; screenshots: string[] }) => {
      created = doc;
      return Promise.resolve(fakeDoc());
    },
  };
  const repo = new AppRepository(model as never);

  const withOffPlatformUrls: SubmitAppInput = {
    ...input,
    icon: 'https://evil.example.com/tracker.png',
    screenshots: [
      'https://evil.example.com/tracker2.png',
      'https://res.cloudinary.com/demo/image/upload/real.png',
    ],
  };
  await repo.createApp(withOffPlatformUrls, 'user-1');

  expect(created.icon).toBe('🧩'); // fell back — the off-platform url was dropped
  expect(created.screenshots).toEqual(['https://res.cloudinary.com/demo/image/upload/real.png']);
});

it('createApp keeps an emoji icon as-is', async () => {
  let created: { icon: string } = { icon: '' };
  const model = {
    findOne: () => Promise.resolve(null),
    create: (doc: { icon: string }) => {
      created = doc;
      return Promise.resolve(fakeDoc());
    },
  };
  const repo = new AppRepository(model as never);

  await repo.createApp({ ...input, icon: '🌙' }, 'user-1');
  expect(created.icon).toBe('🌙');
});
