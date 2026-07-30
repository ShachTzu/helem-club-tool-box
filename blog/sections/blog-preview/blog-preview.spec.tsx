import React from 'react';
import { render, screen } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockPostList } from '@helemclub/blog.hooks.use-posts';
import { BlogPreview } from './blog-preview.js';

const posts = mockPostList();

function renderPreview(ui: React.ReactElement) {
  return render(<MockProvider>{ui}</MockProvider>);
}

describe('BlogPreview', () => {
  it('renders the section title', () => {
    renderPreview(<BlogPreview mockPosts={posts} />);
    expect(screen.getByText('מהבלוג')).toBeInTheDocument();
  });

  it('shows a link to the full blog', () => {
    renderPreview(<BlogPreview mockPosts={posts} />);
    const link = screen.getByText('לכל הכתבות ←').closest('a');
    expect(link).toHaveAttribute('href', '/blog');
  });

  it('renders the latest post title', () => {
    renderPreview(<BlogPreview mockPosts={posts} limit={1} />);
    expect(screen.getByText(posts[0].title)).toBeInTheDocument();
  });
});
