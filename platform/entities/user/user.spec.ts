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
    expect(users).toHaveLength(4);
    users.forEach((user) => expect(user).toBeInstanceOf(User));
  });

  it('supports partial overrides in mockUser()', () => {
    const user = mockUser({ displayName: 'Custom Name' });
    expect(user.displayName).toEqual('Custom Name');
  });
});
