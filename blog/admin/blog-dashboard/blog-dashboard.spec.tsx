import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { BlogDashboard } from './blog-dashboard.js';
import {
  mockBlogDashboardAdminUser,
  mockBlogDashboardMemberUser,
  mockBlogDashboardStats,
  mockEmptyBlogDashboardStats,
} from './blog-dashboard.mock.js';
import styles from './blog-dashboard.module.scss';

it('should render headline metrics for an admin user', () => {
  const { container } = render(
    <MockProvider>
      <BlogDashboard mockUser={mockBlogDashboardAdminUser} mockStats={mockBlogDashboardStats} />
    </MockProvider>
  );

  const metricCards = container.querySelectorAll(`.${styles.metricCard}`);
  expect(metricCards.length).toBe(3);
});

it('should render up to 10 top posts', () => {
  const { container } = render(
    <MockProvider>
      <BlogDashboard mockUser={mockBlogDashboardAdminUser} mockStats={mockBlogDashboardStats} />
    </MockProvider>
  );

  const topPostItems = container.querySelectorAll(`.${styles.topPostsItem}`);
  expect(topPostItems.length).toBe(10);
});

it('should render an empty state message when there are no top posts', () => {
  const { container } = render(
    <MockProvider>
      <BlogDashboard mockUser={mockBlogDashboardAdminUser} mockStats={mockEmptyBlogDashboardStats} />
    </MockProvider>
  );

  const emptyText = container.querySelector(`.${styles.emptyText}`);
  expect(emptyText).toBeTruthy();
});

it('should reveal a custom range picker when the custom tab is selected', () => {
  const { container } = render(
    <MockProvider>
      <BlogDashboard mockUser={mockBlogDashboardAdminUser} mockStats={mockBlogDashboardStats} />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.customRange}`)).toBeFalsy();

  const tabButtons = container.querySelectorAll(`button[role="tab"]`);
  const customTabButton = Array.from(tabButtons).find((button) => button.textContent === `טווח מותאם`);
  expect(customTabButton).toBeTruthy();

  fireEvent.click(customTabButton as Element);

  const customRange = container.querySelector(`.${styles.customRange}`);
  expect(customRange).toBeTruthy();
});

it('should not render dashboard content for a non-admin user', () => {
  const { container } = render(
    <MockProvider>
      <BlogDashboard mockUser={mockBlogDashboardMemberUser} mockStats={mockBlogDashboardStats} />
    </MockProvider>
  );

  const dashboard = container.querySelector(`.${styles.dashboard}`);
  expect(dashboard).toBeFalsy();
});
