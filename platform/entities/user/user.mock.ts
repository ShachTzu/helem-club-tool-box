import { v4 as uuid } from 'uuid';
import { User, type PlainUser } from './user.js';

/**
 * create a single mock User, supports partial override of the mock properties.
 */
export function mockUser(overrides: Partial<PlainUser> = {}): User {
  return User.from({
    id: uuid(),
    email: 'sam.doe@example.com',
    displayName: 'Sam Doe',
    avatarUrl: undefined,
    role: 'member',
    provider: 'email',
    createdAt: new Date('2024-01-15T09:30:00.000Z').toISOString(),
    membershipStatus: 'approved',
    ...overrides,
  });
}

/**
 * create a list of mock Users covering the different roles, providers and
 * membership statuses.
 */
export function mockUsers(): User[] {
  return [
    mockUser({
      id: uuid(),
      email: 'sam.doe@example.com',
      displayName: 'Sam Doe',
      role: 'member',
      provider: 'email',
    }),
    mockUser({
      id: uuid(),
      email: 'maya.new@example.com',
      displayName: 'Maya Levi',
      role: 'member',
      provider: 'email',
      membershipStatus: 'pending',
    }),
    mockUser({
      id: uuid(),
      email: 'yossi.waiting@example.com',
      displayName: 'Yossi Cohen',
      role: 'member',
      provider: 'google',
      membershipStatus: 'pending',
      avatarUrl: 'https://i.pravatar.cc/150?u=yossi.waiting@example.com',
    }),
    mockUser({
      id: uuid(),
      email: 'noa.writer@example.com',
      displayName: 'Noa Writer',
      role: 'writer',
      provider: 'google',
      avatarUrl: 'https://i.pravatar.cc/150?u=noa.writer@example.com',
    }),
    mockUser({
      id: uuid(),
      email: 'dan.mod@example.com',
      displayName: 'Dan Moderator',
      role: 'moderator',
      provider: 'email',
    }),
    mockUser({
      id: uuid(),
      email: 'admin@helemclub.org',
      displayName: 'Helem Admin',
      role: 'admin',
      provider: 'google',
      avatarUrl: 'https://i.pravatar.cc/150?u=admin@helemclub.org',
    }),
  ];
}
