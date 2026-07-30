import { renderHook } from '@testing-library/react';
import { mockAuthors } from '@helemclub/blog.entities.author';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { useAuthors } from './use-authors.js';

it('should return the mocked author list', () => {
  const authors = mockAuthors();

  const { result } = renderHook(() => useAuthors({ mockData: authors.map((author) => author.toObject()) }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.authors).toHaveLength(authors.length);
  expect(result.current.authors[0].name).toBe(authors[0].name);
});

it('should not be loading when mock data is provided', () => {
  const authors = mockAuthors();

  const { result } = renderHook(() => useAuthors({ mockData: authors.map((author) => author.toObject()) }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeUndefined();
});

it('should expose an empty author list when mock data is empty', () => {
  const { result } = renderHook(() => useAuthors({ mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.authors).toHaveLength(0);
});

it('should expose a setWritePermission function', () => {
  const authors = mockAuthors();

  const { result } = renderHook(() => useAuthors({ mockData: authors.map((author) => author.toObject()) }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(typeof result.current.setWritePermission).toBe('function');
  expect(result.current.permissionLoading).toBe(false);
});
