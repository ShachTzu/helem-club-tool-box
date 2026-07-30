import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageEvents } from './manage-events.js';
import {
  MOCK_MANAGE_EVENTS,
  MOCK_MANAGE_EVENTS_LABELS,
  MOCK_MANAGE_EVENTS_DOMAINS,
} from './manage-events-fixtures.mock.js';
import styles from './manage-events.module.scss';

const adminUser = {
  id: `admin-1`,
  email: `admin@helamclub.co.il`,
  displayName: `הלם אדמין`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: new Date().toISOString(),
};

const memberUser = {
  id: `member-1`,
  email: `member@helamclub.co.il`,
  displayName: `חבר קהילה`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: new Date().toISOString(),
};

it(`renders the manage events title for an admin user`, () => {
  const { container } = render(
    <MockProvider>
      <ManageEvents
        mockEvents={MOCK_MANAGE_EVENTS}
        mockLabels={MOCK_MANAGE_EVENTS_LABELS}
        mockDomains={MOCK_MANAGE_EVENTS_DOMAINS}
        mockUser={adminUser}
      />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title?.textContent).toBe(`ניהול אירועים`);
});

it(`renders a row for every mock event`, () => {
  const { container } = render(
    <MockProvider>
      <ManageEvents
        mockEvents={MOCK_MANAGE_EVENTS}
        mockLabels={MOCK_MANAGE_EVENTS_LABELS}
        mockDomains={MOCK_MANAGE_EVENTS_DOMAINS}
        mockUser={adminUser}
      />
    </MockProvider>
  );

  const titleCells = container.querySelectorAll(`table .${styles.titleText}`);
  expect(titleCells.length).toBe(MOCK_MANAGE_EVENTS.length);
});

it(`blocks non-admin users from viewing the panel`, () => {
  const { container } = render(
    <MockProvider>
      <ManageEvents
        mockEvents={MOCK_MANAGE_EVENTS}
        mockLabels={MOCK_MANAGE_EVENTS_LABELS}
        mockDomains={MOCK_MANAGE_EVENTS_DOMAINS}
        mockUser={memberUser}
      />
    </MockProvider>
  );

  const title = container.querySelector(`.${styles.title}`);
  expect(title).toBeNull();
});

it(`opens the create-event form when clicking the new event button`, () => {
  const { container, getByText } = render(
    <MockProvider>
      <ManageEvents
        mockEvents={MOCK_MANAGE_EVENTS}
        mockLabels={MOCK_MANAGE_EVENTS_LABELS}
        mockDomains={MOCK_MANAGE_EVENTS_DOMAINS}
        mockUser={adminUser}
      />
    </MockProvider>
  );

  const newEventButton = getByText(`+ אירוע חדש`);
  fireEvent.click(newEventButton);

  const formTitle = container.querySelector(`.${styles.formTitle}`);
  expect(formTitle?.textContent).toBe(`אירוע חדש`);
});

it(`switches to the past events tab`, () => {
  const { container, getByText } = render(
    <MockProvider>
      <ManageEvents
        mockEvents={MOCK_MANAGE_EVENTS}
        mockLabels={MOCK_MANAGE_EVENTS_LABELS}
        mockDomains={MOCK_MANAGE_EVENTS_DOMAINS}
        mockUser={adminUser}
      />
    </MockProvider>
  );

  const pastTab = getByText(`אירועים שהיו`);
  fireEvent.click(pastTab);

  const activeTab = container.querySelector(`.${styles.tabButtonActive}`);
  expect(activeTab?.textContent).toBe(`אירועים שהיו`);
});

it(`shows a delete confirmation before removing an event`, () => {
  const { container, getAllByText } = render(
    <MockProvider>
      <ManageEvents
        mockEvents={MOCK_MANAGE_EVENTS}
        mockLabels={MOCK_MANAGE_EVENTS_LABELS}
        mockDomains={MOCK_MANAGE_EVENTS_DOMAINS}
        mockUser={adminUser}
      />
    </MockProvider>
  );

  const deleteButtons = getAllByText(`מחיקה`);
  fireEvent.click(deleteButtons[0]);

  const confirmGroup = container.querySelector(`.${styles.confirmGroup}`);
  expect(confirmGroup).not.toBeNull();
});
