import React from 'react';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { DomainsLobby } from './domains-lobby.js';
import { mockLobbyDomains, mockLobbyContent } from './domains-lobby.mock.js';

export const DomainsLobbyBrowseAllDomains = () => {
  return (
    <MockProvider>
      <DomainsLobby mockDomains={mockLobbyDomains} />
    </MockProvider>
  );
};

export const DomainsLobbySelectedDomainFeed = () => {
  return (
    <MemoryRouter initialEntries={['/domains/guilt-shame']}>
      <Routes>
        <Route
          path="/domains/:slug"
          element={<DomainsLobby mockDomains={mockLobbyDomains} mockContent={mockLobbyContent} />}
        />
      </Routes>
    </MemoryRouter>
  );
};

export const DomainsLobbyEmptyDomainFeed = () => {
  return (
    <MemoryRouter initialEntries={['/domains/medication-psychiatry']}>
      <Routes>
        <Route
          path="/domains/:slug"
          element={<DomainsLobby mockDomains={mockLobbyDomains} mockContent={[]} />}
        />
      </Routes>
    </MemoryRouter>
  );
};
