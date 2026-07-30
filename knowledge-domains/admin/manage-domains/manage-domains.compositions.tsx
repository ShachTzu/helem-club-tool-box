import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageDomains } from './manage-domains.js';
import { domainRecordsMock, adminUserMock } from './manage-domains.mock.js';

export const BasicManageDomains = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageDomains mockDomains={domainRecordsMock} mockUser={adminUserMock} />
      </div>
    </MockProvider>
  );
};

export const ManageDomainsEmptyState = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageDomains mockDomains={[]} mockUser={adminUserMock} />
      </div>
    </MockProvider>
  );
};

export const ManageDomainsForbiddenForMembers = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageDomains
          mockDomains={domainRecordsMock}
          mockUser={{
            id: `user-2`,
            email: `member@helam.club`,
            displayName: `חבר קהילה`,
            role: `member`,
            provider: `email`,
            createdAt: `2024-02-01T00:00:00.000Z`,
          }}
        />
      </div>
    </MockProvider>
  );
};
