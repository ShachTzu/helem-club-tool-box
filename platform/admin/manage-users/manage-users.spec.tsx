import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { ManageUsers } from './manage-users.js';
import { MOCK_PLATFORM_USERS } from './manage-users.mock.js';
import styles from './manage-users.module.scss';

const admin = mockUser({ displayName: `הלם אדמין`, role: `admin` });

it(`should render the panel title for an admin user`, () => {
  const { container } = render(
    <MockProvider>
      <ManageUsers mockCurrentUser={admin.toObject()} mockUsers={MOCK_PLATFORM_USERS} />
    </MockProvider>
  );
  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toBe(`ניהול משתמשים`);
});

it(`should render a row for every mock user`, () => {
  const { getAllByText } = render(
    <MockProvider>
      <ManageUsers mockCurrentUser={admin.toObject()} mockUsers={MOCK_PLATFORM_USERS} />
    </MockProvider>
  );
  expect(getAllByText(`Sam Doe`).length).toBeGreaterThan(0);
  expect(getAllByText(`הלם אדמין`).length).toBeGreaterThan(0);
});

it(`should update the search input value when typed into`, () => {
  const { container } = render(
    <MockProvider>
      <ManageUsers mockCurrentUser={admin.toObject()} mockUsers={MOCK_PLATFORM_USERS} />
    </MockProvider>
  );

  const searchInput = container.querySelector(`input[type="text"]`) as HTMLInputElement;
  fireEvent.change(searchInput, { target: { value: `שירה` } });

  expect(searchInput.value).toBe(`שירה`);
});

it(`should show an access-denied message for a non-admin user`, () => {
  const moderator = mockUser({ displayName: `דנה מודרטורית`, role: `moderator` });
  const { getByText } = render(
    <MockProvider>
      <ManageUsers mockCurrentUser={moderator.toObject()} mockUsers={MOCK_PLATFORM_USERS} />
    </MockProvider>
  );
  expect(getByText(`אין לך הרשאה לצפות בעמוד זה`)).toBeTruthy();
});

it(`should show the empty message when there are no users`, () => {
  const { getByText } = render(
    <MockProvider>
      <ManageUsers mockCurrentUser={admin.toObject()} mockUsers={[]} />
    </MockProvider>
  );
  expect(getByText(`לא נמצאו משתמשים התואמים את החיפוש`)).toBeTruthy();
});
