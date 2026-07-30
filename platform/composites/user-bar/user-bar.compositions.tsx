import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { UserBar } from './user-bar.js';

const HeaderBar = ({ children }: { children?: React.ReactNode }) => (
  <div
    style={{
      background: `#0B1A30`,
      padding: `16px 24px`,
      display: `flex`,
      justifyContent: `flex-end`,
    }}
  >
    {children}
  </div>
);

export const AnonymousUserBar = () => {
  return (
    <MockProvider>
      <HeaderBar>
        <UserBar mockUser={null} />
      </HeaderBar>
    </MockProvider>
  );
};

export const AuthenticatedMemberUserBar = () => {
  const user = mockUser({ displayName: `נועה כהן`, role: `member` }).toObject();

  return (
    <MockProvider>
      <HeaderBar>
        <UserBar mockUser={user} />
      </HeaderBar>
    </MockProvider>
  );
};

export const AdminUserBarWithMenuItems = () => {
  const user = mockUser({
    displayName: `דנה אדמין`,
    role: `admin`,
    avatarUrl: `https://i.pravatar.cc/150?u=dana.admin@example.com`,
  }).toObject();

  return (
    <MockProvider>
      <HeaderBar>
        <UserBar
          mockUser={user}
          userMenuItems={[
            { label: `הכלים שהגשתי`, path: `/toolbox/my-submissions` },
            { label: `רשימת המשאלות שלי`, path: `/wishlist/mine` },
          ]}
        />
      </HeaderBar>
    </MockProvider>
  );
};
