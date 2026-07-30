import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { SubmitTool } from './submit-tool.js';

const MOCK_DOMAINS = [
  { id: `anxiety`, slug: `anxiety`, name: `חרדה`, icon: `😰`, count: 5 },
  { id: `sleep`, slug: `sleep`, name: `שינה`, icon: `🌙`, count: 4 },
  {
    id: `mindfulness-breathing`,
    slug: `mindfulness-breathing`,
    name: `מיינדפולנס ונשימות`,
    icon: `🧘`,
    count: 5,
  },
  {
    id: `emotional-regulation`,
    slug: `emotional-regulation`,
    name: `ויסות רגשי`,
    icon: `🌊`,
    count: 4,
  },
];

const MOCK_MEMBER_USER = {
  id: `user-1`,
  displayName: `דנה לוי`,
  email: `dana@example.com`,
  role: `member` as const,
  provider: `google` as const,
  createdAt: `2024-01-01T00:00:00.000Z`,
};

export const SignedInMemberSubmission = () => {
  return (
    <MockProvider>
      <SubmitTool mockDomains={MOCK_DOMAINS} mockUser={MOCK_MEMBER_USER} />
    </MockProvider>
  );
};

export const SignedOutRedirect = () => {
  return (
    <MockProvider>
      <SubmitTool mockDomains={MOCK_DOMAINS} mockUser={null} redirectTo="/login" />
    </MockProvider>
  );
};

export const SubmissionWithCustomOptions = () => {
  return (
    <MockProvider>
      <SubmitTool
        mockDomains={MOCK_DOMAINS}
        mockUser={MOCK_MEMBER_USER}
        costOptions={[
          { value: `free`, label: `חינם לגמרי` },
          { value: `paid`, label: `בתשלום מלא` },
        ]}
        languageOptions={[
          { value: `עברית`, label: `עברית` },
          { value: `אנגלית`, label: `אנגלית` },
        ]}
      />
    </MockProvider>
  );
};
