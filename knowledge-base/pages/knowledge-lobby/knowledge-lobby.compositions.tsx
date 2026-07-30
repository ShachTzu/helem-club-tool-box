import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { KnowledgeLobby } from './knowledge-lobby.js';
import {
  mockKnowledgeLobbyLabels,
  mockKnowledgeLobbyRecords,
  mockKnowledgeLobbyDomains,
} from './knowledge-lobby.mock.js';

export const BasicKnowledgeLobby = () => {
  return (
    <MockProvider>
      <KnowledgeLobby
        mockLabels={mockKnowledgeLobbyLabels}
        mockRecords={mockKnowledgeLobbyRecords}
        mockDomains={mockKnowledgeLobbyDomains}
      />
    </MockProvider>
  );
};

export const KnowledgeLobbyLoadingState = () => {
  return (
    <MockProvider>
      <KnowledgeLobby mockDomains={mockKnowledgeLobbyDomains} />
    </MockProvider>
  );
};

export const KnowledgeLobbyEmptyDiscoveryFeed = () => {
  return (
    <MockProvider>
      <KnowledgeLobby
        mockLabels={mockKnowledgeLobbyLabels}
        mockRecords={[]}
        mockDomains={mockKnowledgeLobbyDomains}
      />
    </MockProvider>
  );
};
