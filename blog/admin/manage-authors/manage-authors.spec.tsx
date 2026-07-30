import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockAuthors } from '@helemclub/blog.entities.author';
import { ManageAuthors } from './manage-authors.js';
import styles from './manage-authors.module.scss';

const adminUser = {
  id: `user-1`,
  email: `admin@helam.club`,
  displayName: `מנהלת הקהילה`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: `2024-01-01T00:00:00.000Z`,
};

const memberUser = {
  id: `user-2`,
  email: `member@helam.club`,
  displayName: `חבר קהילה`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: `2024-01-01T00:00:00.000Z`,
};

it('should render the panel title for an admin user', () => {
  const authors = mockAuthors().map((author) => author.toObject());

  const { container } = render(
    <MockProvider>
      <ManageAuthors mockAuthors={authors} mockUser={adminUser} />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toBe(`ניהול כותבים`);
});

it('should render a row for each author', () => {
  const authors = mockAuthors().map((author) => author.toObject());

  const { container } = render(
    <MockProvider>
      <ManageAuthors mockAuthors={authors} mockUser={adminUser} />
    </MockProvider>
  );

  const table = container.querySelector('table');
  expect(table).toBeTruthy();
  const bodyRows = container.querySelectorAll('tbody tr');
  expect(bodyRows.length).toBe(authors.length);
});

it('should show the total number of authors in the summary', () => {
  const authors = mockAuthors().map((author) => author.toObject());

  const { container } = render(
    <MockProvider>
      <ManageAuthors mockAuthors={authors} mockUser={adminUser} />
    </MockProvider>
  );

  const summaryValues = container.querySelectorAll(`.${styles.summaryValue}`);
  expect(summaryValues[0].textContent).toBe(String(authors.length));
});

it('should render an empty state message when there are no authors', () => {
  const { getByText } = render(
    <MockProvider>
      <ManageAuthors mockAuthors={[]} mockUser={adminUser} />
    </MockProvider>
  );

  expect(getByText(`לא נמצאו כותבים במערכת`)).toBeTruthy();
});

it('should block access for a non-admin user', () => {
  const authors = mockAuthors().map((author) => author.toObject());

  const { container, queryByText } = render(
    <MockProvider>
      <ManageAuthors mockAuthors={authors} mockUser={memberUser} />
    </MockProvider>
  );

  expect(queryByText(`ניהול כותבים`)).toBeNull();
  expect(container.querySelector(`.${styles.manageAuthors}`)).toBeNull();
});
