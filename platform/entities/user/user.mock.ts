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
    ...overrides,
  });
}

/**
 * create a list of mock Users covering the different roles and providers.
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
