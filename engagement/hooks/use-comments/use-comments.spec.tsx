import React from 'react';
import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import type { PlainComment } from '@helemclub/engagement.entities.comment';
import { useComments } from './use-comments.js';

const baseComment: PlainComment = {
  id: 'c1',
  targetType: 'app',
  targetId: 'meditation-timer',
  text: 'תודה על השיתוף.',
  displayName: 'מיכל ר.',
  isAnonymous: false,
  membersOnly: false,
  createdAt: new Date('2024-01-01').toISOString(),
};

const membersOnlyComment: PlainComment = {
  id: 'c2',
  targetType: 'app',
  targetId: 'meditation-timer',
  text: 'תוכן לחברים בלבד.',
  displayName: 'רואי כהן',
  isAnonymous: false,
  membersOnly: true,
  createdAt: new Date('2024-01-02').toISOString(),
};

const hiddenComment: PlainComment = {
  id: 'c3',
  targetType: 'app',
  targetId: 'meditation-timer',
  text: 'תוכן שהוסתר.',
  displayName: 'אורח',
  isAnonymous: true,
  membersOnly: false,
  hidden: true,
  createdAt: new Date('2024-01-03').toISOString(),
};

function wrapper({ children }: { children?: React.ReactNode }) {
  return <MockProvider>{children}</MockProvider>;
}

it('lists comments visible to a non-member, excluding members-only and hidden comments', () => {
  const { result } = renderHook(
    () =>
      useComments('app', 'meditation-timer', {
        mockComments: [baseComment, membersOnlyComment, hiddenComment],
        mockUser: null,
      }),
    { wrapper }
  );

  expect(result.current.comments).toHaveLength(1);
  expect(result.current.comments[0].id).toBe('c1');
  expect(result.current.isMember).toBe(false);
});

it('includes members-only comments for a signed-in member', () => {
  const { result } = renderHook(
    () =>
      useComments('app', 'meditation-timer', {
        mockComments: [baseComment, membersOnlyComment, hiddenComment],
        mockUser: {
          id: 'u1',
          email: 'roi@helam.club',
          displayName: 'רואי כהן',
          role: 'member',
          provider: 'email',
          createdAt: new Date('2023-01-01').toISOString(),
        },
      }),
    { wrapper }
  );

  expect(result.current.comments).toHaveLength(2);
  expect(result.current.isMember).toBe(true);
});

it('always excludes hidden comments regardless of membership', () => {
  const { result } = renderHook(
    () =>
      useComments('app', 'meditation-timer', {
        mockComments: [hiddenComment],
        mockUser: null,
      }),
    { wrapper }
  );

  expect(result.current.comments).toHaveLength(0);
});

it('reports no loading state and no error when mock data is provided', () => {
  const { result } = renderHook(
    () =>
      useComments('app', 'meditation-timer', {
        mockComments: [baseComment],
        mockUser: null,
      }),
    { wrapper }
  );

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});
