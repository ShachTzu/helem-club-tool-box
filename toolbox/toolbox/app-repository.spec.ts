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
