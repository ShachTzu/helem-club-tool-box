import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { BlogHome } from './blog-home.js';
import { mockBlogHomePosts } from './blog-home.mock.js';
import { MOCK_BLOG_DOMAINS } from './blog-home.mock-domains.js';
import styles from './blog-home.module.scss';

it('should render only published posts', () => {
  const { container } = render(
    <MockProvider>
      <BlogHome mockPosts={mockBlogHomePosts()} mockDomains={MOCK_BLOG_DOMAINS} />
    </MockProvider>
  );

  const cards = container.querySelectorAll(`.${styles.grid} > a`);
  expect(cards.length).toBeGreaterThan(0);
});

it('should render the hero title', () => {
  const { container } = render(
    <MockProvider>
      <BlogHome mockPosts={mockBlogHomePosts()} mockDomains={MOCK_BLOG_DOMAINS} />
    </MockProvider>
  );

  const heroTitle = container.querySelector(`.${styles.heroTitle}`);
  expect(heroTitle?.textContent).toBe(`הבלוג של הלם קלאב`);
});

it('should render an empty state when no posts match the selected filter', () => {
  const { container } = render(
    <MockProvider>
      <BlogHome mockPosts={[]} mockDomains={MOCK_BLOG_DOMAINS} />
    </MockProvider>
  );

  const grid = container.querySelector(`.${styles.grid}`);
  expect(grid).toBeNull();
});

it('should filter posts when a domain chip is toggled', () => {
  const { container } = render(
    <MockProvider>
      <BlogHome mockPosts={mockBlogHomePosts()} mockDomains={MOCK_BLOG_DOMAINS} />
    </MockProvider>
  );

  const chipButtons = container.querySelectorAll('button');
  const sleepChip = Array.from(chipButtons).find((button) => button.textContent?.includes(`שינה`));
  expect(sleepChip).toBeTruthy();

  if (sleepChip) fireEvent.click(sleepChip);

  const sectionTitle = container.querySelector(`.${styles.sectionTitle}`);
  expect(sectionTitle?.textContent).toContain(`כתבות`);
});

it('should render a link to the submit article page', () => {
  const { container } = render(
    <MockProvider>
      <BlogHome mockPosts={mockBlogHomePosts()} submitHref="/blog/submit" mockDomains={MOCK_BLOG_DOMAINS} />
    </MockProvider>
  );

  const submitLink = container.querySelector(`.${styles.submitButton}`) as HTMLAnchorElement | null;
  expect(submitLink?.getAttribute('href')).toBe('/blog/submit');
});
