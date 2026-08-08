import { AppRepository } from './app-repository.js';
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

it('applyModerationDecision sets the status and appends an entry to the append-only history', async () => {
  let filter: Record<string, unknown> = {};
  let update: Record<string, unknown> = {};
  const model = {
    findOneAndUpdate: (f: Record<string, unknown>, u: Record<string, unknown>) => {
      filter = f;
      update = u;
      return Promise.resolve(fakeDoc());
    },
  };
  const repo = new AppRepository(model as never);

  await repo.applyModerationDecision(
    'a1',
    'changes_requested',
    'changes_requested',
    { id: 'mod-1', name: 'Dana' },
    'fix the icon'
  );

  expect(filter).toEqual({ id: 'a1', status: 'pending' });
  expect(update.$set).toEqual({ status: 'changes_requested' });
  const pushed = (update.$push as { moderationHistory: Record<string, unknown> }).moderationHistory;
  expect(pushed.action).toBe('changes_requested');
  expect(pushed.note).toBe('fix the icon');
  expect(pushed.moderatorId).toBe('mod-1');
  expect(pushed.moderatorName).toBe('Dana');
});

it('applyModerationDecision only matches an app that is currently pending (no re-deciding an already-approved app)', async () => {
  let filter: Record<string, unknown> = {};
  const model = {
    findOneAndUpdate: (f: Record<string, unknown>) => {
      filter = f;
      return Promise.resolve(null);
    },
  };
  const repo = new AppRepository(model as never);

  const result = await repo.applyModerationDecision('a1', 'rejected', 'reject', { id: 'mod-1', name: 'Dana' });

  expect(filter.status).toBe('pending');
  expect(result).toBeNull();
});

it('applyModerationDecision defaults the note to an empty string when omitted (never overwrites prior history entries)', async () => {
  let update: Record<string, unknown> = {};
  const model = {
    findOneAndUpdate: (_f: Record<string, unknown>, u: Record<string, unknown>) => {
      update = u;
      return Promise.resolve(fakeDoc());
    },
  };
  const repo = new AppRepository(model as never);

  await repo.applyModerationDecision('a1', 'approved', 'approve', { id: 'mod-1', name: 'Dana' });

  const pushed = (update.$push as { moderationHistory: Record<string, unknown> }).moderationHistory;
  expect(pushed.note).toBe('');
  expect((update.$set as { status: string }).status).toBe('approved');
});
