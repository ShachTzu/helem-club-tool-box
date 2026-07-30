import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Spinner } from './spinner.js';
import styles from './spinner.module.scss';

it('should render the spinner element', () => {
  const { container } = render(
    <MemoryRouter>
      <Spinner />
    </MemoryRouter>
  );
  const spinnerEl = container.querySelector(`.${styles.spinner}`);
  expect(spinnerEl).toBeTruthy();
});

it('should apply the size class for a given size prop', () => {
  const { container } = render(
    <MemoryRouter>
      <Spinner size="large" />
    </MemoryRouter>
  );
  const spinnerEl = container.querySelector(`.${styles.large}`);
  expect(spinnerEl).toBeTruthy();
});

it('should default to the medium size class', () => {
  const { container } = render(
    <MemoryRouter>
      <Spinner />
    </MemoryRouter>
  );
  const spinnerEl = container.querySelector(`.${styles.medium}`);
  expect(spinnerEl).toBeTruthy();
});

it('should render the message when provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Spinner message="טוען נתונים..." />
    </MemoryRouter>
  );
  const messageEl = container.querySelector(`.${styles.message}`);
  expect(messageEl?.textContent).toBe('טוען נתונים...');
});

it('should not render a message element when no message is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Spinner />
    </MemoryRouter>
  );
  const messageEl = container.querySelector(`.${styles.message}`);
  expect(messageEl).toBeFalsy();
});

it('should set the accessible label on the status role element', () => {
  const { container } = render(
    <MemoryRouter>
      <Spinner label="טוען משאבים" />
    </MemoryRouter>
  );
  const spinnerEl = container.querySelector(`.${styles.spinner}`);
  expect(spinnerEl?.getAttribute('aria-label')).toBe('טוען משאבים');
});
