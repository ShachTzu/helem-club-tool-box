import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Logo } from './logo.js';
import styles from './logo.module.scss';

it('should render the wordmark text', () => {
  const { getByText } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const rendered = getByText(`הלם קלאב`);
  expect(rendered).toBeTruthy();
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

it('should apply the dark variant class by default', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.className).toContain(styles.dark);
});

it('should apply the light variant class when specified', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo variant="light" />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.className).toContain(styles.light);
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
