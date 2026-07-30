import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockAuthors } from '@helemclub/blog.entities.author';
import { ManageAuthors } from './manage-authors.js';

const adminUser = {
  id: `user-1`,
  email: `admin@helam.club`,
  displayName: `מנהלת הקהילה`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: `2024-01-01T00:00:00.000Z`,
};

const memberUser = {
  id: `user-2`,
  email: `member@helam.club`,
  displayName: `חבר קהילה`,
  role: `member` as const,
  provider: `email` as const,
  createdAt: `2024-01-01T00:00:00.000Z`,
};

export const BasicManageAuthors = () => {
  const authors = mockAuthors().map((author) => author.toObject());

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageAuthors mockAuthors={authors} mockUser={adminUser} />
      </div>
    </MockProvider>
  );
};

export const EmptyAuthorList = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageAuthors mockAuthors={[]} mockUser={adminUser} />
      </div>
    </MockProvider>
  );
};

export const ForbiddenForNonAdmin = () => {
  const authors = mockAuthors().map((author) => author.toObject());

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageAuthors mockAuthors={authors} mockUser={memberUser} />
      </div>
    </MockProvider>
  );
};
