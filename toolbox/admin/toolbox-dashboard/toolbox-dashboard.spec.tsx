import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ToolboxDashboard } from './toolbox-dashboard.js';
import styles from './toolbox-dashboard.module.scss';

const adminUser = {
  id: `user-1`,
  email: `admin@helam.club`,
  displayName: `הלם אדמין`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: `2025-01-01T09:00:00.000Z`,
};

const mockStats = {
  totalViews: 200,
  registeredViews: 80,
  reviewCount: 15,
  averageStars: 4.3,
  weeklyTrend: [
    { weekStart: `2026-07-05`, count: 0 },
    { weekStart: `2026-07-12`, count: 3 },
  ],
};

it('renders view and rating metrics for an admin user', () => {
  const { getByText } = render(
    <MockProvider>
      <ToolboxDashboard mockUser={adminUser} mockStats={mockStats} />
    </MockProvider>
  );

  expect(getByText(`200`)).toBeTruthy();
  expect(getByText(`80`)).toBeTruthy();
  expect(getByText(`120`)).toBeTruthy();
  expect(getByText(`4.3 ★`)).toBeTruthy();
});

it('blocks non-admin users from viewing the panel', () => {
  const member = { ...adminUser, role: `member` as const };
  const { container } = render(
    <MockProvider>
      <ToolboxDashboard mockUser={member} mockStats={mockStats} />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeNull();
});
