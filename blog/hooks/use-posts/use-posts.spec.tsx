import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockPosts } from '@helemclub/blog.entities.post';
import { usePosts } from './use-posts.js';

const plainPosts = mockPosts().map((post) => post.toObject());

it('should only return published posts', () => {
  const { result } = renderHook(() => usePosts({ mockData: plainPosts, mockUser: null }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.posts.every((post) => post.status === 'published')).toBe(true);
});

it('should hide members-only posts from anonymous visitors', () => {
  const { result } = renderHook(() => usePosts({ mockData: plainPosts, mockUser: null }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.posts.some((post) => post.visibility === 'members_only')).toBe(false);
  expect(result.current.isMember).toBe(false);
});

it('should show members-only posts to signed-in members', () => {
  const { result } = renderHook(
    () =>
      usePosts({
        mockData: plainPosts,
        mockUser: {
          id: 'user-1',
          email: 'member@helam.club',
          displayName: 'חבר קהילה',
          role: 'member',
          provider: 'email',
          createdAt: new Date().toISOString(),
        },
      }),
    {
      wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
    }
  );

  expect(result.current.isMember).toBe(true);
  expect(result.current.posts.some((post) => post.visibility === 'members_only')).toBe(true);
});

it('should expose a stable anonymous device id', () => {
  const { result } = renderHook(() => usePosts({ mockData: plainPosts, mockUser: null, mockDeviceId: 'device-42' }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.deviceId).toBe('device-42');
});

it('should not include draft or pending posts', () => {
  const { result } = renderHook(() => usePosts({ mockData: plainPosts, mockUser: null }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  const statuses = result.current.posts.map((post) => post.status);
  expect(statuses.includes('draft')).toBe(false);
  expect(statuses.includes('pending')).toBe(false);
});
