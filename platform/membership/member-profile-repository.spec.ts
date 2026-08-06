import { MemberProfileRepository, type ProfileOwner } from './member-profile-repository.js';
import type { SubmitMemberProfileInput } from './membership-options.js';

/**
 * these tests pin the two things that must not regress: the owner of a profile
 * row always comes from the session and is part of the Mongo filter itself
 * (no IDOR), and an already-approved member is not silently demoted when they
 * edit their details.
 */

const owner: ProfileOwner = {
  userId: 'user-1',
  email: 'Member@Example.com',
  displayName: 'רותם',
  provider: 'google',
};

const input: SubmitMemberProfileInput = { fullName: 'רותם לוי', phone: '050-0000000' };

function fakeDoc(overrides: Record<string, unknown> = {}) {
  return { toObject: () => ({ userId: 'user-1', status: 'pending', ...overrides }) };
}

it('ensureProfile matches on the session user id and defaults to status none', async () => {
  let filter: Record<string, unknown> = {};
  let update: any = {};
  const model = {
    findOneAndUpdate: (f: Record<string, unknown>, u: any) => {
      filter = f;
      update = u;
      return Promise.resolve(fakeDoc({ status: 'none' }));
    },
  };

  await new MemberProfileRepository(model as never).ensureProfile(owner);

  expect(filter).toEqual({ userId: 'user-1' });
  expect(update.$setOnInsert.status).toBe('none');
  expect(update.$set.accountEmail).toBe('member@example.com');
});

it('submitProfile writes onto the session user row only, as pending', async () => {
  let filter: Record<string, unknown> = {};
  let update: any = {};
  const model = {
    findOne: () => Promise.resolve(null),
    findOneAndUpdate: (f: Record<string, unknown>, u: any) => {
      filter = f;
      update = u;
      return Promise.resolve(fakeDoc());
    },
  };

  await new MemberProfileRepository(model as never).submitProfile(owner, input);

  expect(filter).toEqual({ userId: 'user-1' });
  expect(update.$set.status).toBe('pending');
  expect(update.$set.fullName).toBe('רותם לוי');
});

it('submitProfile keeps an approved member approved when they edit details', async () => {
  let update: any = {};
  const model = {
    findOne: () => Promise.resolve(fakeDoc({ status: 'approved' })),
    findOneAndUpdate: (_f: unknown, u: any) => {
      update = u;
      return Promise.resolve(fakeDoc({ status: 'approved' }));
    },
  };

  await new MemberProfileRepository(model as never).submitProfile(owner, input);

  expect(update.$set.status).toBe('approved');
});

it('setStatus records who decided and when', async () => {
  let filter: Record<string, unknown> = {};
  let update: any = {};
  const model = {
    findOneAndUpdate: (f: Record<string, unknown>, u: any) => {
      filter = f;
      update = u;
      return Promise.resolve(fakeDoc({ status: 'approved' }));
    },
  };

  await new MemberProfileRepository(model as never).setStatus(
    'user-1',
    'approved',
    'admin-9',
    'אושר בישיבת צוות'
  );

  expect(filter).toEqual({ userId: 'user-1' });
  expect(update.$set.status).toBe('approved');
  expect(update.$set.decidedBy).toBe('admin-9');
  expect(update.$set.decidedAt).toBeTruthy();
});

it('listProfiles escapes the search term instead of running it as a pattern', async () => {
  let filter: any = {};
  const model = {
    find: (f: any) => {
      filter = f;
      return { sort: () => Promise.resolve([]) };
    },
  };

  await new MemberProfileRepository(model as never).listProfiles({ query: 'a.*b' });

  expect(filter.$or[0].fullName.source).toBe('a\\.\\*b');
});

it('listProfiles filters by status when one is given', async () => {
  let filter: any = {};
  const model = {
    find: (f: any) => {
      filter = f;
      return { sort: () => Promise.resolve([]) };
    },
  };

  await new MemberProfileRepository(model as never).listProfiles({ status: 'pending' });

  expect(filter.status).toBe('pending');
});
