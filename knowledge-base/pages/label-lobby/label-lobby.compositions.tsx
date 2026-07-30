import React from 'react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { LabelLobby } from './label-lobby.js';
import { mockFirstAidLabel, mockFirstAidRecords, mockLabelLobbyDomains } from './label-lobby.mock.js';

export const BasicLabelLobby = () => {
  return (
    <MemoryRouter initialEntries={['/knowledge/first-aid']}>
      <Routes>
        <Route
          path="/knowledge/:labelSlug"
          element={
            <MockProvider noRouter>
              <LabelLobby
                mockLabel={mockFirstAidLabel}
                mockRecords={mockFirstAidRecords}
                mockDomains={mockLabelLobbyDomains}
              />
            </MockProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

export const LoadingLabelLobby = () => {
  return (
    <MemoryRouter initialEntries={['/knowledge/first-aid']}>
      <Routes>
        <Route
          path="/knowledge/:labelSlug"
          element={
            <MockProvider noRouter>
              <LabelLobby />
            </MockProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};

export const LabelNotFoundLobby = () => {
  return (
    <MemoryRouter initialEntries={['/knowledge/unknown-project']}>
      <Routes>
        <Route
          path="/knowledge/:labelSlug"
          element={
            <MockProvider noRouter>
              <LabelLobby mockLabel={undefined} mockRecords={[]} mockDomains={[]} />
            </MockProvider>
          }
        />
      </Routes>
    </MemoryRouter>
  );
};
