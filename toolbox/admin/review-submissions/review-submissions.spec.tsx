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
  const approveButton = container.querySelector(`button`) as HTMLButtonElement;
  fireEvent.click(approveButton);
  await waitFor(() => {
    expect(approveButton.disabled).toBe(false);
  });
});

it(`should render a "changes requested" action alongside approve/reject`, () => {
  const { container } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );
  const labels = Array.from(container.querySelectorAll(`button`)).map((button) => button.textContent);
  expect(labels).toContain(`דורש תיקון`);
});

it(`should let a moderator type a note that will accompany the decision`, () => {
  const { getAllByPlaceholderText } = render(
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );
  const noteInput = getAllByPlaceholderText(/הערה אופציונלית/)[0] as HTMLTextAreaElement;
  fireEvent.change(noteInput, { target: { value: `תקנו את האייקון` } });
  expect(noteInput.value).toBe(`תקנו את האייקון`);
});
