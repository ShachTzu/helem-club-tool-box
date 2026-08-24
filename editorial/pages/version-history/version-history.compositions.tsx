import React from 'react';
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

export const FiveRevisionsHistory = () => {
  return (
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
              />
            }
          />
        </Routes>
      </MemoryRouter>
    </MockProvider>
  );
};

export const SingleRevisionHistory = () => {
  return (
    <MockProvider noRouter>
      <MemoryRouter initialEntries={[`/library/draft/draft-history-single/history`]}>
        <Routes>
          <Route
            path="/library/draft/:id/history"
            element={
              <VersionHistory
                mockUser={mockVersionHistoryUser()}
                mockDraft={mockVersionHistoryDraft().toObject()}
                mockRevisions={mockSingleRevision()}
                mockApprovals={[]}
              />
            }
          />
        </Routes>
      </MemoryRouter>
    </MockProvider>
  );
};

export const LoadingHistory = () => {
  return (
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
                mockLoading
              />
            }
          />
        </Routes>
      </MemoryRouter>
    </MockProvider>
  );
};
