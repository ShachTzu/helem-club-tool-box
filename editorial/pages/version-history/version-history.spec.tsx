import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { VersionHistory } from './version-history.js';
import {
  mockVersionHistoryUser,
  mockVersionHistoryDraft,
  mockFiveRevisions,
  mockSingleRevision,
  mockHistoryApprovals,
} from './version-history.mock.js';
import styles from './version-history.module.scss';

function renderHistoryPage(props: Partial<React.ComponentProps<typeof VersionHistory>> = {}) {
  return render(
    <MockProvider noRouter>
      <MemoryRouter initialEntries={[`/library/draft/draft-history-1/history`]}>
        <Routes>
          <Route
            path="/library/draft/:id/history"
            element={
              <VersionHistory
                mockUser={mockVersionHistoryUser()}
                mockDraft={mockVersionHistoryDraft().toObject()}
                mockRevisions={mockFiveRevisions()}
                mockApprovals={mockHistoryApprovals()}
                {...props}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    </MockProvider>
  );
}

it('renders the draft title in the page header', () => {
  const { container } = renderHistoryPage();
  // the title also appears on the timeline revisions, so the header is
  // matched specifically.
  const header = container.querySelector(`.${styles.header}`);
  expect(header?.textContent).toContain(`מדריך התחלה לחברי קהילה חדשים`);
});

it('renders the link back to the editor', () => {
  const { container } = renderHistoryPage();
  const link = container.querySelector(`a[href="/library/draft/draft-history-1"]`);
  expect(link).toBeTruthy();
});

it('renders the two-column layout for a draft with multiple revisions', () => {
  const { container } = renderHistoryPage();
  const layout = container.querySelector(`.${styles.layout}`);
  expect(layout).toBeTruthy();
});

it('renders a hint instead of a diff when only one revision exists', () => {
  const { container, getByText } = renderHistoryPage({
    mockRevisions: mockSingleRevision(),
    mockApprovals: [],
  });
  expect(container.querySelector(`.${styles.layout}`)).toBeTruthy();
  expect(getByText(`נדרשות לפחות שתי גרסאות כדי להציג השוואה.`)).toBeTruthy();
});

it('renders the loading spinner when mockLoading is set', () => {
  const { container } = renderHistoryPage({ mockLoading: true });
  const loadingState = container.querySelector(`.${styles.loadingState}`);
  expect(loadingState).toBeTruthy();
});

it('opens the restore confirmation modal when a restore button is clicked', () => {
  const { container, getByText } = renderHistoryPage();
  const restoreButtons = Array.from(container.querySelectorAll(`button`)).filter(
    (button) => button.textContent === `שחזר גרסה זו`
  );
  expect(restoreButtons.length).toBeGreaterThan(0);

  fireEvent.click(restoreButtons[0]);

  expect(getByText(`אינה מוחקת ואינה משנה אף גרסה קיימת — כל ההיסטוריה נשמרת במלואה.`, { exact: false })).toBeTruthy();
});
