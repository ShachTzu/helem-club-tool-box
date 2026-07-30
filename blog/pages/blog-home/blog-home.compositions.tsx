import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { BlogHome } from './blog-home.js';
import { mockBlogHomePosts } from './blog-home.mock.js';
import { MOCK_BLOG_DOMAINS } from './blog-home.mock-domains.js';

export const BasicBlogHome = () => {
  return (
    <MockProvider>
      <BlogHome mockPosts={mockBlogHomePosts()} mockDomains={MOCK_BLOG_DOMAINS} />
    </MockProvider>
  );
};

export const EmptyBlogHome = () => {
  return (
    <MockProvider>
      <BlogHome mockPosts={[]} mockDomains={MOCK_BLOG_DOMAINS} />
    </MockProvider>
  );
};

export const LoadingBlogHome = () => {
  return (
    <MockProvider>
      <BlogHome mockDomains={MOCK_BLOG_DOMAINS} />
    </MockProvider>
  );
};
