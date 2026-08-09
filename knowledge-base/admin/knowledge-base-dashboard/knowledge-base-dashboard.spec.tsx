import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { KnowledgeBaseDashboard } from './knowledge-base-dashboard.js';
import styles from './knowledge-base-dashboard.module.scss';

const adminUser = {
  id: `user-1`,
  email: `admin@helam.club`,
  displayName: `הלם אדמין`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: `2025-01-01T09:00:00.000Z`,
};

it('renders total and registered view counts for an admin user', () => {
  const { getByText } = render(
    <MockProvider>
      <KnowledgeBaseDashboard mockUser={adminUser} mockStats={{ totalViews: 100, registeredViews: 40 }} />
    </MockProvider>
  );

  expect(getByText(`100`)).toBeTruthy();
  expect(getByText(`40`)).toBeTruthy();
  expect(getByText(`60`)).toBeTruthy();
});

it('blocks non-admin users from viewing the panel', () => {
  const member = { ...adminUser, role: `member` as const };
  const { container } = render(
    <MockProvider>
      <KnowledgeBaseDashboard mockUser={member} mockStats={{ totalViews: 100, registeredViews: 40 }} />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeNull();
});
