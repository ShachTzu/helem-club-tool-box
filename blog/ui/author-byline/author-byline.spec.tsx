import React from 'react';
import { render } from '@testing-library/react';
import {
  BasicAuthorByline,
  AuthorBylineWithBio,
  AnonymousAuthorByline,
} from './author-byline.compositions.js';
import styles from './author-byline.module.scss';

it('should render the author name and date', () => {
  const { container } = render(<BasicAuthorByline />);
  const name = container.querySelector(`.${styles.name}`);
  const meta = container.querySelector(`.${styles.meta}`);

  expect(name?.textContent).toBe('ד״ר מיכל ברק');
  expect(meta?.textContent).toContain('12 במאי 2026');
});

it('should render the bio when provided', () => {
  const { container } = render(<AuthorBylineWithBio />);
  const bio = container.querySelector(`.${styles.bio}`);

  expect(bio?.textContent).toContain('מתמודד ופעיל קהילתי');
});

it('should render anonymous author placeholder name', () => {
  const { container } = render(<AnonymousAuthorByline />);
  const names = container.querySelectorAll(`.${styles.name}`);

  expect(names[0]?.textContent).toBe('אנונימי/ת');
});
