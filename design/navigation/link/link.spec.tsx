import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Link as RouterLink } from 'react-router-dom';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Link } from './link.js';
import styles from './link.module.scss';

it('should render the link text', () => {
  const { container } = render(
    <MockProvider>
      <Link href="/domains">תחומי התמודדות</Link>
    </MockProvider>
  );

  const label = container.querySelector(`.${styles.label}`);
  expect(label?.textContent).toBe(`תחומי התמודדות`);
});

it('should render an anchor with the given href by default', () => {
  const { container } = render(
    <MockProvider>
      <Link href="/blog">בלוג</Link>
    </MockProvider>
  );

  const anchor = container.querySelector(`a`);
  expect(anchor?.getAttribute(`href`)).toBe(`/blog`);
});

it('should apply the active class name when active is set', () => {
  const { container } = render(
    <MockProvider>
      <Link href="/toolbox" active>
        ארגז כלים
      </Link>
    </MockProvider>
  );

  const anchor = container.querySelector(`a`);
  expect(anchor?.className).toContain(styles.active);
});

it('should not apply the active class name by default', () => {
  const { container } = render(
    <MockProvider>
      <Link href="/toolbox">ארגז כלים</Link>
    </MockProvider>
  );

  const anchor = container.querySelector(`a`);
  expect(anchor?.className).not.toContain(styles.active);
});

it('should treat http links as external and open in a new tab', () => {
  const { container } = render(
    <MockProvider>
      <Link href="https://facebook.com">פייסבוק</Link>
    </MockProvider>
  );

  const anchor = container.querySelector(`a`);
  expect(anchor?.getAttribute(`target`)).toBe(`_blank`);
  expect(anchor?.getAttribute(`rel`)).toContain(`noopener`);
});

it('should render as a router link when the as prop is provided', () => {
  const { container } = render(
    <MockProvider>
      <Link as={RouterLink} href="/knowledge">
        מאגר ידע
      </Link>
    </MockProvider>
  );

  const anchor = container.querySelector(`a`);
  expect(anchor?.getAttribute(`href`)).toBe(`/knowledge`);
});

it('should call the onClick handler when clicked', () => {
  let clicked = false;
  const { container } = render(
    <MockProvider>
      <Link href="/events" onClick={() => { clicked = true; }}>
        אירועים
      </Link>
    </MockProvider>
  );

  const anchor = container.querySelector(`a`);
  if (anchor) fireEvent.click(anchor);

  expect(clicked).toBe(true);
});
