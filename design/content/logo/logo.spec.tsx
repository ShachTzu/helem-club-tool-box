import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Logo } from './logo.js';
import styles from './logo.module.scss';

it('should label the link with the wordmark for screen readers', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.getAttribute(`aria-label`)).toBe(`הלם קלאב`);
});

it('should link to the homepage by default', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.getAttribute(`href`)).toBe(`/`);
});

it('should link to a custom href when provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo href="/dashboard" />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.getAttribute(`href`)).toBe(`/dashboard`);
});

it('should render the white mark by default', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const img = container.querySelector(`img`);
  expect(img?.getAttribute(`src`)).toBe(`/logo-horizontal-white.png`);
});

it('should render the dark mark when the light variant is specified', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo variant="light" />
    </MemoryRouter>
  );
  const img = container.querySelector(`img`);
  expect(img?.getAttribute(`src`)).toBe(`/logo-horizontal-dark.png`);
});

it('should apply the requested size class', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo size="large" />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.className).toContain(styles.sizeLarge);
});
