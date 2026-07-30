import React from 'react';
import { render } from '@testing-library/react';
import { mockUser } from '@helemclub/platform.entities.user';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ProtectedRoute } from './protected-route.js';
import styles from './protected-route.module.scss';

it('shows a spinner while the auth state is loading', () => {
  const { container } = render(
    <MockProvider>
      <ProtectedRoute>
        <div>תוכן מוגן</div>
      </ProtectedRoute>
    </MockProvider>
  );

  const loadingContainer = container.querySelector(`.${styles.loadingContainer}`);
  expect(loadingContainer).not.toBeNull();
});

it('redirects anonymous users away from the protected content', () => {
  const { container } = render(
    <MockProvider>
      <ProtectedRoute mockData={null} redirectTo="/login">
        <div className="protected-content">תוכן מוגן</div>
      </ProtectedRoute>
    </MockProvider>
  );

  expect(container.querySelector('.protected-content')).toBeNull();
});

it('renders the protected content for a signed-in user with an allowed role', () => {
  const member = mockUser({ role: 'member' });

  const { container } = render(
    <MockProvider>
      <ProtectedRoute mockData={member.toObject()} allowedRoles={['member', 'writer']}>
        <div className="protected-content">תוכן מוגן</div>
      </ProtectedRoute>
    </MockProvider>
  );

  expect(container.querySelector('.protected-content')).not.toBeNull();
});

it('renders an access-denied message for a signed-in user with an insufficient role', () => {
  const member = mockUser({ role: 'member' });

  const { container } = render(
    <MockProvider>
      <ProtectedRoute mockData={member.toObject()} allowedRoles={['admin']}>
        <div className="protected-content">תוכן מוגן</div>
      </ProtectedRoute>
    </MockProvider>
  );

  expect(container.querySelector('.protected-content')).toBeNull();
  expect(container.querySelector(`.${styles.forbiddenCard}`)).not.toBeNull();
});

it('renders the protected content when no allowedRoles are provided', () => {
  const admin = mockUser({ role: 'admin' });

  const { container } = render(
    <MockProvider>
      <ProtectedRoute mockData={admin.toObject()}>
        <div className="protected-content">תוכן מוגן</div>
      </ProtectedRoute>
    </MockProvider>
  );

  expect(container.querySelector('.protected-content')).not.toBeNull();
});
