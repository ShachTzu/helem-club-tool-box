import React from 'react';
import { render, fireEvent, within } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageDomains } from './manage-domains.js';
import { domainRecordsMock, adminUserMock } from './manage-domains.mock.js';
import styles from './manage-domains.module.scss';

it('renders the domains list for a signed-in admin', () => {
  const { container } = render(
    <MockProvider>
      <ManageDomains mockDomains={domainRecordsMock} mockUser={adminUserMock} />
    </MockProvider>
  );

  const table = container.querySelector(`table`) as HTMLTableElement;
  const nameLabels = table.querySelectorAll(`.${styles.nameLabel}`);
  expect(nameLabels.length).toBe(domainRecordsMock.length);
});

it('shows the empty message when there are no domains', () => {
  const { getByText } = render(
    <MockProvider>
      <ManageDomains mockDomains={[]} mockUser={adminUserMock} />
    </MockProvider>
  );

  expect(getByText(`לא נמצאו דומיינים במערכת`)).toBeTruthy();
});

it('blocks access for a signed-in user without the admin role', () => {
  const { container } = render(
    <MockProvider>
      <ManageDomains
        mockDomains={domainRecordsMock}
        mockUser={{
          id: `user-2`,
          email: `member@helam.club`,
          displayName: `חבר קהילה`,
          role: `member`,
          provider: `email`,
          createdAt: `2024-02-01T00:00:00.000Z`,
        }}
      />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.manageDomains}`)).toBeNull();
});

it('adds a new domain when the form is submitted with valid data', () => {
  const { container, getByPlaceholderText, getByText } = render(
    <MockProvider>
      <ManageDomains mockDomains={domainRecordsMock} mockUser={adminUserMock} />
    </MockProvider>
  );

  const nameInput = getByPlaceholderText(`לדוגמה: חרדה`) as HTMLInputElement;
  fireEvent.change(nameInput, { target: { value: `דומיין חדש` } });

  const submitButton = getByText(`הוספת דומיין`);
  fireEvent.click(submitButton);

  const table = container.querySelector(`table`) as HTMLTableElement;
  const nameLabels = table.querySelectorAll(`.${styles.nameLabel}`);
  expect(nameLabels.length).toBe(domainRecordsMock.length + 1);
});

it('shows a validation error when submitting without a name', () => {
  const { getByText } = render(
    <MockProvider>
      <ManageDomains mockDomains={domainRecordsMock} mockUser={adminUserMock} />
    </MockProvider>
  );

  const submitButton = getByText(`הוספת דומיין`);
  fireEvent.click(submitButton);

  expect(getByText(`יש למלא שם ומזהה (slug) לדומיין`)).toBeTruthy();
});

it('removes a domain after confirming deletion', () => {
  const { container } = render(
    <MockProvider>
      <ManageDomains mockDomains={domainRecordsMock} mockUser={adminUserMock} />
    </MockProvider>
  );

  const table = container.querySelector(`table`) as HTMLTableElement;
  const deleteButton = within(table).getAllByText(`מחיקה`)[0];
  fireEvent.click(deleteButton);

  const confirmButton = within(table).getAllByText(`אישור מחיקה`)[0];
  fireEvent.click(confirmButton);

  const nameLabels = table.querySelectorAll(`.${styles.nameLabel}`);
  expect(nameLabels.length).toBe(domainRecordsMock.length - 1);
});
