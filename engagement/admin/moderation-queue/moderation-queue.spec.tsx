import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockComments } from '@helemclub/engagement.entities.comment';
import { ModerationQueue } from './moderation-queue.js';
import styles from './moderation-queue.module.scss';

const adminUser = {
  id: `user-1`,
  email: `admin@helam.club`,
  displayName: `נועה מנהלת`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: new Date().toISOString(),
};

const memberUser = {
  id: `user-2`,
  email: `member@helam.club`,
  displayName: `דניאל חבר`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: new Date().toISOString(),
};

describe(`ModerationQueue`, () => {
  it(`renders the moderation queue heading for an allowed role`, () => {
    const mockedComments = mockComments().map((comment) => comment.toObject());

    const { container } = render(
      <MockProvider>
        <ModerationQueue mockData={mockedComments} mockUser={adminUser} />
      </MockProvider>
    );

    const title = container.querySelector(`.${styles.title}`);
    expect(title?.textContent).toBe(`תור מודרציה`);
  });

  it(`renders a row for each comment in the queue`, () => {
    const mockedComments = mockComments().map((comment) => comment.toObject());

    const { container } = render(
      <MockProvider>
        <ModerationQueue mockData={mockedComments} mockUser={adminUser} />
      </MockProvider>
    );

    const table = container.querySelector(`table`);
    const reportBadges = table?.querySelectorAll(`.${styles.reportBadge}`);
    expect(reportBadges?.length).toBe(mockedComments.length);
  });

  it(`shows the empty state when there are no comments to moderate`, () => {
    const { container } = render(
      <MockProvider>
        <ModerationQueue mockData={[]} mockUser={adminUser} />
      </MockProvider>
    );

    const emptyState = container.querySelector(`.${styles.emptyState}`);
    expect(emptyState).not.toBeNull();
  });

  it(`blocks access for a signed-in user without a moderator/admin role`, () => {
    const mockedComments = mockComments().map((comment) => comment.toObject());

    const { container } = render(
      <MockProvider>
        <ModerationQueue mockData={mockedComments} mockUser={memberUser} />
      </MockProvider>
    );

    const title = container.querySelector(`.${styles.title}`);
    expect(title).toBeNull();
  });

  it(`shows the 48h soft target hint`, () => {
    const mockedComments = mockComments().map((comment) => comment.toObject());

    const { container } = render(
      <MockProvider>
        <ModerationQueue mockData={mockedComments} mockUser={adminUser} />
      </MockProvider>
    );

    const hint = container.querySelector(`.${styles.hint}`);
    expect(hint?.textContent).toContain(`48`);
  });
});
