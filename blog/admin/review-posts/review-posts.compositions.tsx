import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ReviewPosts } from './review-posts.js';
import { mockPendingPostList } from './review-posts.mock.js';

const adminUser = {
  id: `admin-1`,
  email: `admin@helem.club`,
  displayName: `הלם אדמין`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: new Date(`2024-01-15T09:30:00.000Z`).toISOString(),
};

const moderatorUser = {
  id: `mod-1`,
  email: `moderator@helem.club`,
  displayName: `דנה מודרטורית`,
  role: `moderator` as const,
  provider: `email` as const,
  createdAt: new Date(`2024-02-10T09:30:00.000Z`).toISOString(),
};

export const PendingQueueForAdmin = () => {
  return (
    <MockProvider>
      <ReviewPosts mockUser={adminUser} mockData={mockPendingPostList()} />
    </MockProvider>
  );
};

export const EmptyQueue = () => {
  return (
    <MockProvider>
      <ReviewPosts mockUser={moderatorUser} mockData={[]} />
    </MockProvider>
  );
};

export const RestrictedForMembers = () => {
  const memberUser = {
    id: `member-1`,
    email: `member@helem.club`,
    displayName: `שם דו`,
    role: `member` as const,
    provider: `email` as const,
    createdAt: new Date(`2024-03-01T09:30:00.000Z`).toISOString(),
  };

  return (
    <MockProvider>
      <ReviewPosts mockUser={memberUser} mockData={mockPendingPostList()} />
    </MockProvider>
  );
};
