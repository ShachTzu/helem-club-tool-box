import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PostCard } from './post-card.js';
import styles from './post-card.module.scss';

describe('PostCard', () => {
  it('should render the post title and excerpt', () => {
    const { container } = render(
      <MemoryRouter>
        <PostCard
          title="כותרת לדוגמה"
          excerpt="תקציר לדוגמה"
          authorName="ד״ר מיכל ברק"
          date="12 במאי 2026"
        />
      </MemoryRouter>
    );

    const title = container.querySelector(`.${styles.title}`);
    const excerpt = container.querySelector(`.${styles.excerpt}`);

    expect(title?.textContent).toBe('כותרת לדוגמה');
    expect(excerpt?.textContent).toBe('תקציר לדוגמה');
  });

  it('should render the author name and date', () => {
    const { container } = render(
      <MemoryRouter>
        <PostCard authorName="רון אבני" date="28 באפריל 2026" />
      </MemoryRouter>
    );

    const author = container.querySelector(`.${styles.author}`);
    const date = container.querySelector(`.${styles.date}`);

    expect(author?.textContent).toBe('רון אבני');
    expect(date?.textContent).toBe('28 באפריל 2026');
  });

  it('should link to the given href', () => {
    const { container } = render(
      <MemoryRouter>
        <PostCard href="/blog/my-post" />
      </MemoryRouter>
    );

    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe('/blog/my-post');
  });

  it('should render the members-only badge when membersOnly is set', () => {
    const { container } = render(
      <MemoryRouter>
        <PostCard membersOnly />
      </MemoryRouter>
    );

    const badge = container.querySelector(`.${styles.membersBadge}`);
    expect(badge).toBeTruthy();
  });

  it('should not render the members-only badge by default', () => {
    const { container } = render(
      <MemoryRouter>
        <PostCard />
      </MemoryRouter>
    );

    const badge = container.querySelector(`.${styles.membersBadge}`);
    expect(badge).toBeFalsy();
  });

  it('should render up to two domain chips', () => {
    const { container } = render(
      <MemoryRouter>
        <PostCard
          domains={[
            { id: 'a', slug: 'a', name: 'תחום א' },
            { id: 'b', slug: 'b', name: 'תחום ב' },
            { id: 'c', slug: 'c', name: 'תחום ג' },
          ]}
        />
      </MemoryRouter>
    );

    const chips = container.querySelectorAll(`.${styles.domainChip}`);
    expect(chips.length).toBe(2);
  });
});
