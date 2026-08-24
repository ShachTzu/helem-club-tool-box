import { User } from './user.js';
import { mockUser, mockUsers } from './user.mock.js';

it('has a User.from() method', () => {
  expect(User.from).toBeTruthy();
});

it('creates a User instance from a plain object', () => {
  const user = User.from({
    id: 'u1',
    email: 'sam.doe@example.com',
    displayName: 'Sam Doe',
    role: 'member',
    provider: 'email',
    createdAt: '2024-01-15T09:30:00.000Z',
  });

  expect(user).toBeInstanceOf(User);
  expect(user.id).toEqual('u1');
  expect(user.email).toEqual('sam.doe@example.com');
  expect(user.displayName).toEqual('Sam Doe');
  expect(user.role).toEqual('member');
  expect(user.provider).toEqual('email');
});

it('serializes a User into a plain object including the id', () => {
  const user = mockUser({ id: 'u2' });
  const plain = user.toObject();

  expect(plain.id).toEqual('u2');
  expect(plain).toEqual({
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
    role: user.role,
    provider: user.provider,
    createdAt: user.createdAt,
    onboardingCompleted: user.onboardingCompleted,
    interests: user.interests,
    membershipStatus: user.membershipStatus,
    contentAdmin: user.contentAdmin,
  });
});

describe('membership status', () => {
  it('defaults a user with no explicit status to pending', () => {
    const user = User.from({
      id: 'u3',
      email: 'new.signup@example.com',
      displayName: 'New Signup',
      role: 'member',
      provider: 'email',
      createdAt: '2024-01-15T09:30:00.000Z',
    });

    expect(user.membershipStatus).toEqual('pending');
    expect(user.isPendingApproval).toBe(true);
    expect(user.isApprovedMember).toBe(false);
  });

  it('marks an approved member as able to participate', () => {
    const user = mockUser({ membershipStatus: 'approved' });
    expect(user.isApprovedMember).toBe(true);
    expect(user.isPendingApproval).toBe(false);
  });

  it('keeps a rejected member out of participation', () => {
    const user = mockUser({ membershipStatus: 'rejected' });
    expect(user.isApprovedMember).toBe(false);
    expect(user.isPendingApproval).toBe(false);
  });

  it('round-trips the membership status through serialization', () => {
    const user = mockUser({ membershipStatus: 'pending' });
    expect(User.from(user.toObject()).membershipStatus).toEqual('pending');
  });
});

describe('canManageContent()', () => {
  it('allows full admins regardless of the contentAdmin flag', () => {
    expect(mockUser({ role: 'admin', contentAdmin: false }).canManageContent()).toBe(true);
  });

  it('allows a moderator scoped in as a content admin', () => {
    expect(mockUser({ role: 'moderator', contentAdmin: true }).canManageContent()).toBe(true);
  });

  it('denies a moderator without the contentAdmin flag', () => {
    expect(mockUser({ role: 'moderator', contentAdmin: false }).canManageContent()).toBe(false);
  });
});

describe('canModerateMembers()', () => {
  it('allows moderators and admins to hold the membership gate', () => {
    expect(mockUser({ role: 'moderator' }).canModerateMembers()).toBe(true);
    expect(mockUser({ role: 'admin' }).canModerateMembers()).toBe(true);
  });

  it('denies members and writers', () => {
    expect(mockUser({ role: 'member' }).canModerateMembers()).toBe(false);
    expect(mockUser({ role: 'writer' }).canModerateMembers()).toBe(false);
  });
});

describe('isAtLeast()', () => {
  it('returns true when the role meets the required privilege level', () => {
    const admin = mockUser({ role: 'admin' });
    expect(admin.isAtLeast('member')).toBe(true);
    expect(admin.isAtLeast('writer')).toBe(true);
    expect(admin.isAtLeast('moderator')).toBe(true);
    expect(admin.isAtLeast('admin')).toBe(true);
  });

  it('returns false when the role does not meet the required privilege level', () => {
    const member = mockUser({ role: 'member' });
    expect(member.isAtLeast('writer')).toBe(false);
    expect(member.isAtLeast('moderator')).toBe(false);
    expect(member.isAtLeast('admin')).toBe(false);
  });

  it('returns true for an exact role match', () => {
    const moderator = mockUser({ role: 'moderator' });
    expect(moderator.isAtLeast('moderator')).toBe(true);
  });
});

describe('mockUsers()', () => {
  it('returns a list of User instances', () => {
    const users = mockUsers();
    expect(users).toHaveLength(6);
    users.forEach((user) => expect(user).toBeInstanceOf(User));
  });

  it('covers both pending and approved membership statuses', () => {
    const users = mockUsers();
    expect(users.some((user) => user.isPendingApproval)).toBe(true);
    expect(users.some((user) => user.isApprovedMember)).toBe(true);
  });

  it('supports partial overrides in mockUser()', () => {
    const user = mockUser({ displayName: 'Custom Name' });
    expect(user.displayName).toEqual('Custom Name');
  });
});
