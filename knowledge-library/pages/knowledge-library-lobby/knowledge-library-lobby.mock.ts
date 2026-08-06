import type { PlainKnowledgePage } from '@helemclub/knowledge-library.entities.knowledge-page';

function mockPage(overrides: Partial<PlainKnowledgePage>): PlainKnowledgePage {
  return {
    id: 'p1',
    slug: 'p1',
    title: 'עמוד לדוגמה',
    body: '',
    parentId: null,
    ancestorIds: [],
    domains: [],
    publishDate: '2024-01-01T00:00:00.000Z',
    authorName: 'הלם קלאב',
    isStaffAuthor: true,
    isPublished: true,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ...overrides,
  };
}

export const MOCK_TOP_LEVEL_PAGES: PlainKnowledgePage[] = [
  mockPage({ id: 'ezra-rishona', slug: 'ezra-rishona', title: 'עזרה ראשונה' }),
  mockPage({ id: 'other-topic', slug: 'other-topic', title: 'נושא נוסף' }),
];
