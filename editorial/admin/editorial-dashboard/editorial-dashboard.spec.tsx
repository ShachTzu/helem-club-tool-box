import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { EditorialDashboard } from './editorial-dashboard.js';
import {
  mockEditorialDashboardAdminUser,
  mockEditorialDashboardMemberUser,
  mockEditorialDashboardStats,
  mockEmptyEditorialDashboardStats,
  mockEditorialDashboardPendingDrafts,
} from './editorial-dashboard.mock.js';
import styles from './editorial-dashboard.module.scss';

it('should render headline metric cards for an admin user', () => {
  const { container } = render(
    <MockProvider>
      <EditorialDashboard
        mockUser={mockEditorialDashboardAdminUser}
        mockStats={mockEditorialDashboardStats}
        mockPendingDrafts={mockEditorialDashboardPendingDrafts}
      />
    </MockProvider>
  );

  const metricCards = container.querySelectorAll(`.${styles.metricCard}`);
  expect(metricCards.length).toBe(6);
});

it('should render up to 5 items in the longest waiting panel', () => {
  const { container } = render(
    <MockProvider>
      <EditorialDashboard
        mockUser={mockEditorialDashboardAdminUser}
        mockStats={mockEditorialDashboardStats}
        mockPendingDrafts={mockEditorialDashboardPendingDrafts}
      />
    </MockProvider>
  );

  const pendingItems = container.querySelectorAll(`.${styles.pendingItem}`);
  expect(pendingItems.length).toBe(5);
});

it('should render an empty message when there are no pending drafts', () => {
  const { container } = render(
    <MockProvider>
      <EditorialDashboard
        mockUser={mockEditorialDashboardAdminUser}
        mockStats={mockEmptyEditorialDashboardStats}
        mockPendingDrafts={[]}
      />
    </MockProvider>
  );

  const emptyText = container.querySelector(`.${styles.emptyText}`);
  expect(emptyText).toBeTruthy();
});

it('should not render dashboard content for a non-admin user', () => {
  const { container } = render(
    <MockProvider>
      <EditorialDashboard
        mockUser={mockEditorialDashboardMemberUser}
        mockStats={mockEditorialDashboardStats}
        mockPendingDrafts={mockEditorialDashboardPendingDrafts}
      />
    </MockProvider>
  );

  const dashboard = container.querySelector(`.${styles.dashboard}`);
  expect(dashboard).toBeFalsy();
});

it('should switch the time range when a different option is selected', () => {
  const { container } = render(
    <MockProvider>
      <EditorialDashboard
        mockUser={mockEditorialDashboardAdminUser}
        mockStats={mockEditorialDashboardStats}
        mockPendingDrafts={mockEditorialDashboardPendingDrafts}
      />
    </MockProvider>
  );

  const trigger = container.querySelector(`[role="combobox"]`) as HTMLElement;
  expect(trigger).toBeTruthy();

  fireEvent.click(trigger);

  const options = container.querySelectorAll(`[role="option"]`);
  const sevenDaysOption = Array.from(options).find((option) => option.textContent === `7 הימים האחרונים`);
  expect(sevenDaysOption).toBeTruthy();

  fireEvent.click(sevenDaysOption as Element);

  expect(container.querySelector(`.${styles.dashboard}`)).toBeTruthy();
});
