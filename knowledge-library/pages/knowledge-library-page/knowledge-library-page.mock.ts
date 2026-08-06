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

export const MOCK_ROOT = mockPage({ id: 'ezra-rishona', slug: 'ezra-rishona', title: 'עזרה ראשונה' });

export const MOCK_SERIES = mockPage({
  id: 'series-1',
  slug: 'ptsd-series',
  title: 'מה זה פוסט טראומה והאם יש לי כזו?',
  parentId: MOCK_ROOT.id,
  ancestorIds: [MOCK_ROOT.id],
});

export const MOCK_CHAPTER_1 = mockPage({
  id: 'chapter-1',
  slug: 'chapter-1',
  title: 'איך נראים החיים שלך בזמן האחרון?',
  body: 'טקסט הפרק הראשון',
  parentId: MOCK_SERIES.id,
  ancestorIds: [MOCK_ROOT.id, MOCK_SERIES.id],
  domains: ['חרדה'],
  publishDate: '2023-09-11T00:00:00.000Z',
});

export const MOCK_CHAPTER_2 = mockPage({
  id: 'chapter-2',
  slug: 'chapter-2',
  title: 'לפעמים המוח פשוט קצת נדפק',
  body: 'טקסט הפרק השני',
  parentId: MOCK_SERIES.id,
  ancestorIds: [MOCK_ROOT.id, MOCK_SERIES.id],
  publishDate: '2023-09-11T00:00:00.000Z',
});

export const MOCK_ALL_PAGES: PlainKnowledgePage[] = [MOCK_ROOT, MOCK_SERIES, MOCK_CHAPTER_1, MOCK_CHAPTER_2];
