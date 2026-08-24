import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageKnowledgeLibrary } from './manage-knowledge-library.js';

const MOCK_ADMIN = {
  id: 'admin-1',
  email: 'admin@helem.club',
  displayName: 'מנהל/ת',
  role: 'admin' as const,
  provider: 'email' as const,
  createdAt: '2024-01-01T00:00:00.000Z',
};

export const AllowedEditor = () => (
  <MockProvider>
    <ManageKnowledgeLibrary mockUser={MOCK_ADMIN} mockCanManage />
  </MockProvider>
);

export const NotAllowed = () => (
  <MockProvider>
    <ManageKnowledgeLibrary mockUser={MOCK_ADMIN} mockCanManage={false} />
  </MockProvider>
);
