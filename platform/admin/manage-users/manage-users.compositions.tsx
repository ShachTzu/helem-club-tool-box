import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { ManageUsers } from './manage-users.js';
import { MOCK_PLATFORM_USERS } from './manage-users.mock.js';

export const BasicManageUsers = () => {
  const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageUsers mockCurrentUser={admin.toObject()} mockUsers={MOCK_PLATFORM_USERS} />
      </div>
    </MockProvider>
  );
};

export const EmptySearchResults = () => {
  const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageUsers mockCurrentUser={admin.toObject()} mockUsers={[]} />
      </div>
    </MockProvider>
  );
};

export const RestrictedForNonAdmins = () => {
  const moderator = mockUser({ displayName: `דנה מודרטורית`, role: `moderator` });
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageUsers mockCurrentUser={moderator.toObject()} mockUsers={MOCK_PLATFORM_USERS} />
      </div>
    </MockProvider>
  );
};
