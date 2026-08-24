import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { KnowledgeLibraryLobby } from './knowledge-library-lobby.js';
import { MOCK_TOP_LEVEL_PAGES } from './knowledge-library-lobby.mock.js';

export const BasicKnowledgeLibraryLobby = () => (
  <MockProvider>
    <KnowledgeLibraryLobby mockPages={MOCK_TOP_LEVEL_PAGES} />
  </MockProvider>
);

export const EmptyKnowledgeLibraryLobby = () => (
  <MockProvider>
    <KnowledgeLibraryLobby mockPages={[]} />
  </MockProvider>
);
