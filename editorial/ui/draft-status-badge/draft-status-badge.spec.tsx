import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DraftStatusBadge } from './draft-status-badge.js';
import styles from './draft-status-badge.module.scss';

it('should render the hebrew label for a draft status', () => {
  const { container } = render(
    <MemoryRouter>
      <DraftStatusBadge status="draft" />
    </MemoryRouter>
  );
  const label = container.querySelector(`.${styles.label}`);
  expect(label?.textContent).toBe(`טיוטה`);
});

it('should render the hebrew label for a published status', () => {
  const { container } = render(
    <MemoryRouter>
      <DraftStatusBadge status="published" />
    </MemoryRouter>
  );
  const label = container.querySelector(`.${styles.label}`);
  expect(label?.textContent).toBe(`פורסם`);
});

it('should render an icon by default', () => {
  const { container } = render(
    <MemoryRouter>
      <DraftStatusBadge status="approved" />
    </MemoryRouter>
  );
  const icon = container.querySelector(`.${styles.icon}`);
  expect(icon).toBeTruthy();
});

it('should not render an icon when showIcon is false', () => {
  const { container } = render(
    <MemoryRouter>
      <DraftStatusBadge status="approved" showIcon={false} />
    </MemoryRouter>
  );
  const icon = container.querySelector(`.${styles.icon}`);
  expect(icon).toBeFalsy();
});

it('should apply the size class name', () => {
  const { container } = render(
    <MemoryRouter>
      <DraftStatusBadge status="in_review" size="large" />
    </MemoryRouter>
  );
  const badge = container.querySelector('span');
  expect(badge?.className.includes(styles.large)).toBe(true);
});
