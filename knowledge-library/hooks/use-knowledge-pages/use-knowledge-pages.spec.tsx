import { renderHook } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { useKnowledgePages } from './use-knowledge-pages.js';
import type { PlainKnowledgePage } from '@helemclub/knowledge-library.entities.knowledge-page';

function mockPage(overrides: Partial<PlainKnowledgePage> = {}): PlainKnowledgePage {
  return {
    id: 'p1',
    slug: 'p1',
    title: 'עמוד לדוגמה',
    body: 'טקסט',
    parentId: null,
    ancestorIds: [],
    domains: [],
    viewCount: 0,
    publishDate: '2024-01-01T00:00:00.000Z',
    authorName: 'הלם קלאב',
    isStaffAuthor: true,
    isPublished: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

it('returns pages from provided mock data', () => {
  const pages = [mockPage(), mockPage({ id: 'p2', title: 'עמוד שני' })];
  const { result } = renderHook(() => useKnowledgePages({ mockData: pages }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.pages).toHaveLength(2);
  expect(result.current.pages[0].title).toBe('עמוד לדוגמה');
});

it('is not loading when mock data is provided', () => {
  const { result } = renderHook(() => useKnowledgePages({ mockData: [mockPage()] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.loading).toBe(false);
});

it('returns an empty list when mock data is an empty array', () => {
  const { result } = renderHook(() => useKnowledgePages({ mockData: [] }), {
    wrapper: ({ children }) => <MockProvider>{children}</MockProvider>,
  });

  expect(result.current.pages).toHaveLength(0);
});
