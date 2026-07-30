import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { mockSearchResults } from '@helemclub/platform.entities.search-result';
import { Header } from './header.js';

export const AnonymousHeader = () => {
  return (
    <MockProvider>
      <Header mockUser={null} mockSearchResults={mockSearchResults()} activePath="/" />
    </MockProvider>
  );
};

export const AuthenticatedMemberHeader = () => {
  const user = mockUser({ displayName: `נועה כהן`, role: `member` }).toObject();

  return (
    <MockProvider>
      <Header mockUser={user} mockSearchResults={mockSearchResults()} activePath="/toolbox" />
    </MockProvider>
  );
};

export const HeaderWithCustomNavigationAndActions = () => {
  const user = mockUser({
    displayName: `דנה אדמין`,
    role: `admin`,
    avatarUrl: `https://i.pravatar.cc/150?u=dana.admin@example.com`,
  }).toObject();

  return (
    <MockProvider>
      <Header
        mockUser={user}
        mockSearchResults={mockSearchResults()}
        activePath="/wisdom"
        navigationItems={[
          { label: `בית`, path: `/` },
          { label: `חוכמת הקהילה`, path: `/wisdom` },
          { label: `ארגז כלים`, path: `/toolbox` },
          { label: `אירועים`, path: `/events` },
        ]}
        headerActions={[
          {
            id: `notifications`,
            component: () => (
              <span style={{ color: `var(--colors-text-inverse)`, fontSize: 18 }}>🔔</span>
            ),
          },
        ]}
        userMenuItems={[{ label: `הכלים שהגשתי`, path: `/toolbox/my-submissions` }]}
      />
    </MockProvider>
  );
};
