import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { ApproveMembers } from './approve-members.js';
import { MOCK_MEMBER_PROFILES } from './approve-members.mock.js';

export const PendingApprovalQueue = () => {
  const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ApproveMembers mockCurrentUser={admin.toObject()} mockProfiles={MOCK_MEMBER_PROFILES} />
      </div>
    </MockProvider>
  );
};

export const EmptyQueue = () => {
  const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ApproveMembers mockCurrentUser={admin.toObject()} mockProfiles={[]} />
      </div>
    </MockProvider>
  );
};

export const RestrictedForNonAdmins = () => {
  const moderator = mockUser({ displayName: `דנה מודרטורית`, role: `moderator` });
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ApproveMembers
          mockCurrentUser={moderator.toObject()}
          mockProfiles={MOCK_MEMBER_PROFILES}
        />
      </div>
    </MockProvider>
  );
};
