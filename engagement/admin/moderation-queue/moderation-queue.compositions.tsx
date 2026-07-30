import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockComments } from '@helemclub/engagement.entities.comment';
import { ModerationQueue } from './moderation-queue.js';

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

export const BasicModerationQueue = () => {
  const mockedComments = mockComments()
    .map((comment) => comment.toObject())
    .map((comment, index) => ({
      ...comment,
      hidden: true,
      reportCount: index + 1,
    }));

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ModerationQueue mockData={mockedComments} mockUser={adminUser} />
      </div>
    </MockProvider>
  );
};

export const EmptyModerationQueue = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ModerationQueue mockData={[]} mockUser={adminUser} />
      </div>
    </MockProvider>
  );
};

export const ForbiddenForMember = () => {
  const mockedComments = mockComments().map((comment) => comment.toObject());

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ModerationQueue mockData={mockedComments} mockUser={memberUser} />
      </div>
    </MockProvider>
  );
};
