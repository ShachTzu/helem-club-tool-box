import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TagChip } from './tag-chip.js';
import styles from './tag-chip.module.scss';

it('should render the given label', () => {
  const { container } = render(
    <MemoryRouter>
      <TagChip label="חרדה" />
    </MemoryRouter>
  );
  const label = container.querySelector(`.${styles.label}`);
  expect(label?.textContent).toBe('חרדה');
});

it('should render the count suffix when provided', () => {
  const { container } = render(
    <MemoryRouter>
      <TagChip label="PTSD" count={12} />
    </MemoryRouter>
  );
  const count = container.querySelector(`.${styles.count}`);
  expect(count?.textContent).toBe('12');
});

it('should not render the count suffix when not provided', () => {
  const { container } = render(
    <MemoryRouter>
      <TagChip label="PTSD" />
    </MemoryRouter>
  );
  const count = container.querySelector(`.${styles.count}`);
  expect(count).toBeNull();
});

it('should apply the active class when active is true', () => {
  const { container } = render(
    <MemoryRouter>
      <TagChip label="דיכאון" active />
    </MemoryRouter>
  );
  const chip = container.querySelector(`.${styles.chip}`);
  expect(chip?.className).toContain(styles.active);
});

it('should call onToggle when the chip is clicked', () => {
  const handleToggle = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <TagChip label="שינה" onToggle={() => handleToggle()} />
    </MemoryRouter>
  );
  const chip = container.querySelector(`.${styles.chip}`) as HTMLButtonElement;
  fireEvent.click(chip);
  expect(handleToggle).toHaveBeenCalledTimes(1);
});

it('should render a remove button when removable is true', () => {
  const { container } = render(
    <MemoryRouter>
      <TagChip label="כעס" removable />
    </MemoryRouter>
  );
  const removeButton = container.querySelector(`.${styles.removeButton}`);
  expect(removeButton).toBeTruthy();
});

it('should call onRemove when the remove button is clicked without toggling', () => {
  const handleRemove = vi.fn();
  const handleToggle = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <TagChip label="כעס" removable onRemove={() => handleRemove()} onToggle={() => handleToggle()} />
    </MemoryRouter>
  );
  const removeButton = container.querySelector(`.${styles.removeButton}`) as HTMLButtonElement;
  fireEvent.click(removeButton);
  expect(handleRemove).toHaveBeenCalledTimes(1);
});

it('should not call onToggle when the chip is disabled', () => {
  const handleToggle = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <TagChip label="בדידות" disabled onToggle={() => handleToggle()} />
    </MemoryRouter>
  );
  const chip = container.querySelector(`.${styles.chip}`) as HTMLButtonElement;
  fireEvent.click(chip);
  expect(handleToggle).not.toHaveBeenCalled();
});
