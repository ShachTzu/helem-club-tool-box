import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { EditorialDashboard } from './editorial-dashboard.js';
import {
  mockEditorialDashboardAdminUser,
  mockEditorialDashboardStats,
  mockEmptyEditorialDashboardStats,
  mockEditorialDashboardPendingDrafts,
} from './editorial-dashboard.mock.js';

export const EditorialDashboardWithData = () => {
  return (
    <MockProvider>
      <EditorialDashboard
        mockUser={mockEditorialDashboardAdminUser}
        mockStats={mockEditorialDashboardStats}
        mockPendingDrafts={mockEditorialDashboardPendingDrafts}
      />
    </MockProvider>
  );
};

export const EmptyEditorialDashboard = () => {
  return (
    <MockProvider>
      <EditorialDashboard
        mockUser={mockEditorialDashboardAdminUser}
        mockStats={mockEmptyEditorialDashboardStats}
        mockPendingDrafts={[]}
      />
    </MockProvider>
  );
};

export const LoadingEditorialDashboard = () => {
  return (
    <MockProvider>
      <EditorialDashboard mockUser={mockEditorialDashboardAdminUser} />
    </MockProvider>
  );
};
