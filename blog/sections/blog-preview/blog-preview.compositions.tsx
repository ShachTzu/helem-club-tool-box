import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockPostList } from '@helemclub/blog.hooks.use-posts';
import { BlogPreview } from './blog-preview.js';

const posts = mockPostList();

/**
 * the blog preview populated with the default mock posts.
 */
export const BasicBlogPreview = () => (
  <MockProvider>
    <BlogPreview mockPosts={posts} />
  </MockProvider>
);

/**
 * the blog preview limited to a single latest post.
 */
export const SingleLatestPost = () => (
  <MockProvider>
    <BlogPreview mockPosts={posts} limit={1} />
  </MockProvider>
);

/**
 * the blog preview with a custom title and subtitle.
 */
export const CustomHeading = () => (
  <MockProvider>
    <BlogPreview
      mockPosts={posts}
      title="כתבות נבחרות"
      subtitle="מבחר מהתכנים האחרונים בבלוג הקהילה"
    />
  </MockProvider>
);
