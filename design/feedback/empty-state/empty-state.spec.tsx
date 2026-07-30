import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EmptyState } from './empty-state.js';
import styles from './empty-state.module.scss';

it('should render the default title and description', () => {
  const { container } = render(
    <MemoryRouter>
      <EmptyState />
    </MemoryRouter>
  );

  const title = container.querySelector(`.${styles.title}`);
  const description = container.querySelector(`.${styles.description}`);
  expect(title?.textContent).toBe('לא נמצאו תוצאות');
  expect(description?.textContent).toBe('נסו לשנות את הסינון או את החיפוש, או חזרו לבדוק שוב מאוחר יותר.');
});

it('should render custom title and description', () => {
  const { container } = render(
    <MemoryRouter>
      <EmptyState title="אין פריטים" description="הרשימה ריקה כרגע" />
    </MemoryRouter>
  );

  const title = container.querySelector(`.${styles.title}`);
  const description = container.querySelector(`.${styles.description}`);
  expect(title?.textContent).toBe('אין פריטים');
  expect(description?.textContent).toBe('הרשימה ריקה כרגע');
});

it('should not render an action button when actionLabel is not provided', () => {
  const { container } = render(
    <MemoryRouter>
      <EmptyState />
    </MemoryRouter>
  );

  const button = container.querySelector(`.${styles.actionButton}`);
  expect(button).toBeNull();
});

it('should render the action button when actionLabel and onAction are provided', () => {
  const { container } = render(
    <MemoryRouter>
      <EmptyState actionLabel="נסו שוב" onAction={() => {}} />
    </MemoryRouter>
  );

  const button = container.querySelector(`.${styles.actionButton}`);
  expect(button?.textContent).toBe('נסו שוב');
});

it('should call onAction when the action button is clicked', () => {
  const handleAction = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <EmptyState actionLabel="נסו שוב" onAction={() => handleAction()} />
    </MemoryRouter>
  );

  const button = container.querySelector(`.${styles.actionButton}`) as HTMLButtonElement;
  fireEvent.click(button);

  expect(handleAction).toHaveBeenCalledTimes(1);
});

it('should render a default icon when no icon is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <EmptyState />
    </MemoryRouter>
  );

  const icon = container.querySelector(`.${styles.iconWrapper} svg`);
  expect(icon).toBeTruthy();
});

it('should render a custom icon when provided', () => {
  const { container, getByText } = render(
    <MemoryRouter>
      <EmptyState icon={<span>🔖</span>} />
    </MemoryRouter>
  );

  const icon = container.querySelector(`.${styles.iconWrapper} svg`);
  expect(icon).toBeNull();
  expect(getByText('🔖')).toBeTruthy();
});
