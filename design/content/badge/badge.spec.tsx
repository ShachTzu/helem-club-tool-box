import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Badge } from './badge.js';
import styles from './badge.module.scss';

it('should render children content', () => {
  const { container } = render(
    <MemoryRouter>
      <Badge>שלושה חדשים</Badge>
    </MemoryRouter>
  );
  const rendered = container.querySelector(`.${styles.badge}`);
  expect(rendered?.textContent).toBe('שלושה חדשים');
});

it('should apply the neutral variant class by default', () => {
  const { container } = render(
    <MemoryRouter>
      <Badge>תווית</Badge>
    </MemoryRouter>
  );
  const rendered = container.querySelector(`.${styles.badge}`);
  expect(rendered?.classList.contains(styles.neutral)).toBe(true);
});

it('should apply the danger variant class when set', () => {
  const { container } = render(
    <MemoryRouter>
      <Badge variant="danger">שגיאה</Badge>
    </MemoryRouter>
  );
  const rendered = container.querySelector(`.${styles.badge}`);
  expect(rendered?.classList.contains(styles.danger)).toBe(true);
});

it('should render a dot indicator when showDot is set', () => {
  const { container } = render(
    <MemoryRouter>
      <Badge showDot>פעיל</Badge>
    </MemoryRouter>
  );
  const rendered = container.querySelector(`.${styles.dot}`);
  expect(rendered).toBeTruthy();
});

it('should not render a dot indicator by default', () => {
  const { container } = render(
    <MemoryRouter>
      <Badge>פעיל</Badge>
    </MemoryRouter>
  );
  const rendered = container.querySelector(`.${styles.dot}`);
  expect(rendered).toBeFalsy();
});

it('should apply a custom class name', () => {
  const { container } = render(
    <MemoryRouter>
      <Badge className="custom-badge">תווית</Badge>
    </MemoryRouter>
  );
  const rendered = container.querySelector('.custom-badge');
  expect(rendered).toBeTruthy();
});
