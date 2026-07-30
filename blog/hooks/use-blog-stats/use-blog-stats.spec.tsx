import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockBlogStats, mockEmptyBlogStats } from '@helemclub/blog.entities.blog-stat';
import { useBlogStats } from './use-blog-stats.js';
import { mockTimeRangeLast30Days } from './use-blog-stats.mock.js';

it('should return blog stats from provided mock data', () => {
  const mockStats = mockBlogStats().toObject();

  const { result } = renderHook(() => useBlogStats(mockTimeRangeLast30Days, { mockData: mockStats }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.stats?.totalPosts).toBe(42);
  expect(result.current.stats?.uniqueVisitors).toBe(8760);
  expect(result.current.stats?.topPosts.length).toBe(3);
});

it('should not be in a loading state when mock data is provided', () => {
  const mockStats = mockBlogStats().toObject();

  const { result } = renderHook(() => useBlogStats(mockTimeRangeLast30Days, { mockData: mockStats }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should return empty stats when provided an empty snapshot', () => {
  const mockStats = mockEmptyBlogStats().toObject();

  const { result } = renderHook(() => useBlogStats(mockTimeRangeLast30Days, { mockData: mockStats }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.stats?.totalPosts).toBe(0);
  expect(result.current.stats?.topPosts.length).toBe(0);
});
