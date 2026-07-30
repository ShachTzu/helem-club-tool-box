import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { ManageApps } from './manage-apps.js';
import { mockDomainTagOptions } from './manage-apps.mock.js';

const ADMIN_USER = {
  id: `admin-1`,
  email: `admin@helam.club`,
  displayName: `מנהלת הקהילה`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: new Date().toISOString(),
};

export const BasicManageApps = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageApps mockApps={mockAppsData()} mockDomains={mockDomainTagOptions()} mockUser={ADMIN_USER} />
      </div>
    </MockProvider>
  );
};

export const ManageAppsEmptyCatalog = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageApps mockApps={[]} mockDomains={mockDomainTagOptions()} mockUser={ADMIN_USER} />
      </div>
    </MockProvider>
  );
};

export const ManageAppsForbiddenAccess = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageApps
          mockApps={mockAppsData()}
          mockDomains={mockDomainTagOptions()}
          mockUser={{
            id: `member-1`,
            email: `member@helam.club`,
            displayName: `חבר קהילה`,
            role: `member`,
            provider: `email`,
            createdAt: new Date().toISOString(),
          }}
        />
      </div>
    </MockProvider>
  );
};
