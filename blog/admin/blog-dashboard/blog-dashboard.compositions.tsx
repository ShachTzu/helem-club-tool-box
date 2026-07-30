import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { BlogDashboard } from './blog-dashboard.js';
import {
  mockBlogDashboardAdminUser,
  mockBlogDashboardMemberUser,
  mockBlogDashboardStats,
  mockEmptyBlogDashboardStats,
} from './blog-dashboard.mock.js';

export const AdminBlogDashboard = () => {
  return (
    <MockProvider>
      <BlogDashboard mockUser={mockBlogDashboardAdminUser} mockStats={mockBlogDashboardStats} />
    </MockProvider>
  );
};

export const EmptyBlogDashboard = () => {
  return (
    <MockProvider>
      <BlogDashboard mockUser={mockBlogDashboardAdminUser} mockStats={mockEmptyBlogDashboardStats} />
    </MockProvider>
  );
};

export const RestrictedForNonAdmins = () => {
  return (
    <MockProvider>
      <BlogDashboard mockUser={mockBlogDashboardMemberUser} mockStats={mockBlogDashboardStats} />
    </MockProvider>
  );
};
