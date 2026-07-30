import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageRecords } from './manage-records.js';
import styles from './manage-records.module.scss';
import type { ManageRecordsMockRecord } from './manage-records-mock-record-type.js';
import type { ManageRecordsMockLabel } from './manage-records-mock-label-type.js';

const mockLabels: ManageRecordsMockLabel[] = [
  { id: `label-first-aid`, slug: `first-aid`, name: `עזרה ראשונה`, recordCount: 1 },
];

const mockRecords: ManageRecordsMockRecord[] = [
  {
    id: `rec-1`,
    slug: `grounding-flashbacks`,
    labelId: `label-first-aid`,
    title: `קרקוע ברגע של פלאשבק`,
    mediaType: `video`,
    mediaUrl: `https://example.com/media/grounding-flashbacks.mp4`,
    domains: [`חרדה`],
    viewCount: 3240,
    publishedAt: `2026-03-01T09:00:00.000Z`,
  },
];

const adminUser = {
  id: `user-1`,
  email: `admin@helam.club`,
  displayName: `הלם אדמין`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: `2025-01-01T09:00:00.000Z`,
};

it('renders the panel title for an admin user', () => {
  const { container } = render(
    <MockProvider>
      <ManageRecords mockUser={adminUser} mockRecords={mockRecords} mockLabels={mockLabels} />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toBe(`ניהול תכני מאגר הידע`);
});

it('renders a table row for each mock record', () => {
  const { getAllByText } = render(
    <MockProvider>
      <ManageRecords mockUser={adminUser} mockRecords={mockRecords} mockLabels={mockLabels} />
    </MockProvider>
  );

  expect(getAllByText(`קרקוע ברגע של פלאשבק`).length).toBeGreaterThan(0);
});

it('shows the create form when clicking the new record button', () => {
  const { getByText, container } = render(
    <MockProvider>
      <ManageRecords mockUser={adminUser} mockRecords={mockRecords} mockLabels={mockLabels} />
    </MockProvider>
  );

  fireEvent.click(getByText(`+ רשומה חדשה`));

  const formTitle = container.querySelector(`.${styles.formTitle}`);
  expect(formTitle?.textContent).toBe(`רשומה חדשה`);
});

it('shows a validation error when submitting an empty form', () => {
  const { getByText, container } = render(
    <MockProvider>
      <ManageRecords mockUser={adminUser} mockRecords={mockRecords} mockLabels={[]} />
    </MockProvider>
  );

  fireEvent.click(getByText(`+ רשומה חדשה`));
  fireEvent.click(getByText(`יצירת רשומה`));

  const formError = container.querySelector(`.${styles.formError}`);
  expect(formError).not.toBeNull();
});

it('shows the delete confirmation card when clicking delete', () => {
  const { getAllByText, container } = render(
    <MockProvider>
      <ManageRecords mockUser={adminUser} mockRecords={mockRecords} mockLabels={mockLabels} />
    </MockProvider>
  );

  fireEvent.click(getAllByText(`מחיקה`)[0]);

  const confirmCard = container.querySelector(`.${styles.confirmCard}`);
  expect(confirmCard).not.toBeNull();
});

it('blocks non-admin users from viewing the panel', () => {
  const member = { ...adminUser, role: `member` as const };
  const { container } = render(
    <MockProvider>
      <ManageRecords mockUser={member} mockRecords={mockRecords} mockLabels={mockLabels} />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeNull();
});
