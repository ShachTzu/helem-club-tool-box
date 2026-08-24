import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { KnowledgeLibraryPage } from './knowledge-library-page.js';
import { MOCK_ALL_PAGES, MOCK_SERIES, MOCK_CHAPTER_1 } from './knowledge-library-page.mock.js';

function renderAt(path: string, mockPage: typeof MOCK_SERIES | null) {
  return (
    <MockProvider noRouter>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/knowledge-library/:slug"
            element={<KnowledgeLibraryPage mockPage={mockPage} mockPages={MOCK_ALL_PAGES} />}
          />
        </Routes>
      </MemoryRouter>
    </MockProvider>
  );
}

export const SeriesLandingView = () => renderAt(`/knowledge-library/${MOCK_SERIES.slug}`, MOCK_SERIES);

export const ChapterView = () => renderAt(`/knowledge-library/${MOCK_CHAPTER_1.slug}`, MOCK_CHAPTER_1);

export const NotFoundView = () => renderAt('/knowledge-library/does-not-exist', null);
