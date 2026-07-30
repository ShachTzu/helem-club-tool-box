import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { ManageApps } from './manage-apps.js';
import { mockDomainTagOptions } from './manage-apps.mock.js';
import styles from './manage-apps.module.scss';

const ADMIN_USER = {
  id: `admin-1`,
  email: `admin@helam.club`,
  displayName: `מנהלת הקהילה`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: new Date().toISOString(),
};

const MEMBER_USER = {
  id: `member-1`,
  email: `member@helam.club`,
  displayName: `חבר קהילה`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: new Date().toISOString(),
};

it('renders the apps management title for an admin user', () => {
  const { container } = render(
    <MockProvider>
      <ManageApps mockApps={mockAppsData()} mockDomains={mockDomainTagOptions()} mockUser={ADMIN_USER} />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title && title.textContent).toBe(`ניהול אפליקציות`);
});

it('blocks non-admin users from viewing the panel', () => {
  const { container } = render(
    <MockProvider>
      <ManageApps mockApps={mockAppsData()} mockDomains={mockDomainTagOptions()} mockUser={MEMBER_USER} />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeNull();
});

it('opens the create form when clicking the add button', () => {
  const { container, getByText } = render(
    <MockProvider>
      <ManageApps mockApps={mockAppsData()} mockDomains={mockDomainTagOptions()} mockUser={ADMIN_USER} />
    </MockProvider>
  );

  const addButton = getByText(`➕ הוספת אפליקציה`);
  fireEvent.click(addButton);

  const formTitle = container.querySelector(`.${styles.formTitle}`);
  expect(formTitle && formTitle.textContent).toBe(`הוספת אפליקציה חדשה`);
});

it('filters the apps list by the search query', () => {
  const apps = mockAppsData();
  const { container } = render(
    <MockProvider>
      <ManageApps mockApps={apps} mockDomains={mockDomainTagOptions()} mockUser={ADMIN_USER} />
    </MockProvider>
  );

  const searchInput = container.querySelector(`input[name="search"]`) as HTMLInputElement;
  fireEvent.change(searchInput, { target: { value: `לא קיים בשום מקום` } });

  const emptyState = container.querySelector(`.${styles.emptyState}`);
  expect(emptyState).not.toBeNull();
});

it('shows a delete confirmation bar when requesting to delete an app', () => {
  const apps = mockAppsData();
  const { container, getAllByText } = render(
    <MockProvider>
      <ManageApps mockApps={apps} mockDomains={mockDomainTagOptions()} mockUser={ADMIN_USER} />
    </MockProvider>
  );

  const deleteButtons = getAllByText(`מחיקה`);
  fireEvent.click(deleteButtons[0]);

  const confirmBar = container.querySelector(`.${styles.confirmBar}`);
  expect(confirmBar).not.toBeNull();
});
