import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ReviewPosts } from './review-posts.js';
import { mockPendingPostList } from './review-posts.mock.js';
import styles from './review-posts.module.scss';

const adminUser = {
  id: `admin-1`,
  email: `admin@helem.club`,
  displayName: `הלם אדמין`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: new Date(`2024-01-15T09:30:00.000Z`).toISOString(),
};

const memberUser = {
  id: `member-1`,
  email: `member@helem.club`,
  displayName: `שם דו`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: new Date(`2024-03-01T09:30:00.000Z`).toISOString(),
};

it(`renders the pending posts queue for an admin user`, () => {
  const posts = mockPendingPostList();
  const { container } = render(
    <MockProvider>
      <ReviewPosts mockUser={adminUser} mockData={posts} />
    </MockProvider>
  );

  const cards = container.querySelectorAll(`.${styles.queueCard}`);
  expect(cards.length).toBe(posts.length);
});

it(`shows an empty state when there are no pending posts`, () => {
  const { container } = render(
    <MockProvider>
      <ReviewPosts mockUser={adminUser} mockData={[]} />
    </MockProvider>
  );

  const stateCard = container.querySelector(`.${styles.stateCard}`);
  expect(stateCard).not.toBeNull();
  expect(container.querySelectorAll(`.${styles.queueCard}`).length).toBe(0);
});

it(`restricts access for a signed-in member`, () => {
  const posts = mockPendingPostList();
  const { container } = render(
    <MockProvider>
      <ReviewPosts mockUser={memberUser} mockData={posts} />
    </MockProvider>
  );

  expect(container.querySelectorAll(`.${styles.queueCard}`).length).toBe(0);
});

it(`switches a post card into edit mode`, () => {
  const posts = mockPendingPostList();
  const { container } = render(
    <MockProvider>
      <ReviewPosts mockUser={adminUser} mockData={posts} />
    </MockProvider>
  );

  const editButtons = container.querySelectorAll(`button`);
  const editButton = Array.from(editButtons).find((button) => button.textContent === `עריכה`);
  expect(editButton).toBeDefined();

  if (editButton) fireEvent.click(editButton);

  const editForm = container.querySelector(`.${styles.editForm}`);
  expect(editForm).not.toBeNull();
});
