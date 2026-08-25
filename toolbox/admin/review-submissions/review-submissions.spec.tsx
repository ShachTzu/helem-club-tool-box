import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockPendingAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { ReviewSubmissions } from './review-submissions.js';
import styles from './review-submissions.module.scss';

const moderatorUser = {
  id: `moderator-1`,
  email: `dana.mod@helemclub.org`,
  displayName: `דנה מודרטורית`,
  role: `moderator` as const,
  provider: `email` as const,
  createdAt: new Date(`2024-02-01T09:00:00.000Z`).toISOString(),
};

const adminUser = {
  id: `admin-1`,
  email: `admin@helemclub.org`,
  displayName: `הלם אדמין`,
  role: `admin` as const,
  provider: `google` as const,
  createdAt: new Date(`2024-01-10T09:00:00.000Z`).toISOString(),
};

const memberUser = {
  id: `member-1`,
  email: `member@helemclub.org`,
  displayName: `שם דו`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: new Date(`2024-03-05T09:00:00.000Z`).toISOString(),
};

it(`should render the pending submissions count`, () => {
  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );
  const badge = container.querySelector(`.${styles.countBadge}`);
  expect(badge?.textContent).toContain(`1`);
});

it(`should render a row for each pending app`, () => {
  const pendingData = mockPendingAppsData();
  const { getAllByText } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={pendingData} />
    </MockProvider>
  );
  expect(getAllByText(pendingData[0].name).length).toBeGreaterThan(0);
});

it(`should render the empty state when there are no pending apps`, () => {
  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={adminUser} mockPendingData={[]} />
    </MockProvider>
  );
  const stateTitle = container.querySelector(`.${styles.stateTitle}`);
  expect(stateTitle?.textContent).toBe(`אין הגשות ממתינות`);
});

it(`should show a restricted message for a member user`, () => {
  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={memberUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );
  const forbiddenTitle = container.querySelector(`h1`);
  expect(forbiddenTitle?.textContent).toBe(`אין לך הרשאה לצפות בעמוד זה`);
});

it(`should disable the approve button while processing a review`, async () => {
  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );
  const approveButton = container.querySelector(`.${styles.actionsCell} button`) as HTMLButtonElement;
  fireEvent.click(approveButton);
  await waitFor(() => {
    expect(approveButton.disabled).toBe(false);
  });
});

it(`should keep the bulk actions disabled until a submission is selected`, () => {
  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );
  const bulkButtons = Array.from(
    container.querySelectorAll(`.${styles.bulkActions} button`)
  ) as HTMLButtonElement[];

  expect(bulkButtons).toHaveLength(3);
  expect(bulkButtons.every((button) => button.disabled)).toBe(true);
});

it(`should enable the bulk actions once "select all" is ticked`, () => {
  const pendingData = mockPendingAppsData();
  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={pendingData} />
    </MockProvider>
  );

  const selectAll = container.querySelector(`.${styles.selectAll} input`) as HTMLInputElement;
  fireEvent.click(selectAll);

  const bulkButtons = Array.from(
    container.querySelectorAll(`.${styles.bulkActions} button`)
  ) as HTMLButtonElement[];
  expect(bulkButtons.every((button) => button.disabled)).toBe(false);
  expect(container.querySelector(`.${styles.selectionCount}`)?.textContent).toContain(
    String(pendingData.length)
  );
});

it(`should not show a history block for a submission reviewed for the first time`, () => {
  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.history}`)).toBeNull();
});

it(`should show the earlier decisions for a resubmitted tool`, () => {
  const pendingData = mockPendingAppsData().map((app) => ({
    ...app,
    moderationHistory: [
      {
        action: `request_changes`,
        note: `הקישור לא עובד`,
        moderatorName: `דנה מודרטורית`,
        createdAt: new Date(`2026-08-01T09:00:00.000Z`).toISOString(),
      },
    ],
  }));

  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={pendingData} />
    </MockProvider>
  );

  const history = container.querySelector(`.${styles.history}`);
  expect(history).not.toBeNull();
  expect(history?.textContent).toContain(`נבדק כבר פעם אחת`);
  expect(history?.textContent).toContain(`בקשת תיקון`);
  expect(history?.textContent).toContain(`הקישור לא עובד`);
  expect(history?.textContent).toContain(`דנה מודרטורית`);
});

it(`should require a note before a rejection can be sent`, () => {
  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );

  const rowButtons = Array.from(
    container.querySelectorAll(`.${styles.actionsCell} button`)
  ) as HTMLButtonElement[];
  // approve, request changes, reject
  fireEvent.click(rowButtons[2]);

  const send = Array.from(document.querySelectorAll(`.${styles.modalActions} button`)).find(
    (button) => button.textContent === `שליחה`
  ) as HTMLButtonElement;
  fireEvent.click(send);

  expect(document.body.textContent).toContain(`חובה לכתוב הסבר`);
});
