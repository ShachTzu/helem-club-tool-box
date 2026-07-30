import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockPendingAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { ReviewSubmissions } from './review-submissions.js';

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

export const ModeratorReviewQueue = () => {
  return (
    <MockProvider>
      <ReviewSubmissions mockUser={moderatorUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );
};

export const EmptyReviewQueue = () => {
  return (
    <MockProvider>
      <ReviewSubmissions mockUser={adminUser} mockPendingData={[]} />
    </MockProvider>
  );
};

export const RestrictedForMembers = () => {
  return (
    <MockProvider>
      <ReviewSubmissions mockUser={memberUser} mockPendingData={mockPendingAppsData()} />
    </MockProvider>
  );
};
