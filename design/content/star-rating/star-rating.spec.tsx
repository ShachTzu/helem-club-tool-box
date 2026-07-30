import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { StarRating } from './star-rating.js';
import styles from './star-rating.module.scss';

it('should render the read-only stars wrapper with the correct aria-label', () => {
  const { container } = render(
    <MemoryRouter>
      <StarRating value={4} ratingCount={10} />
    </MemoryRouter>
  );
  const wrapper = container.querySelector(`.${styles.starsWrapper}`);
  expect(wrapper?.getAttribute('aria-label')).toBe('דירוג: 4.0 מתוך 5');
});

it('should render the numeric value when showValue is set', () => {
  const { container } = render(
    <MemoryRouter>
      <StarRating value={3.5} showValue />
    </MemoryRouter>
  );
  const value = container.querySelector(`.${styles.value}`);
  expect(value?.textContent).toBe('3.5');
});

it('should not render the numeric value by default', () => {
  const { container } = render(
    <MemoryRouter>
      <StarRating value={3.5} />
    </MemoryRouter>
  );
  const value = container.querySelector(`.${styles.value}`);
  expect(value).toBeNull();
});

it('should render the rating count when provided', () => {
  const { container } = render(
    <MemoryRouter>
      <StarRating value={4} ratingCount={128} />
    </MemoryRouter>
  );
  const count = container.querySelector(`.${styles.count}`);
  expect(count?.textContent).toBe('(128)');
});

it('should fill half the stars width for a half-point average', () => {
  const { container } = render(
    <MemoryRouter>
      <StarRating value={2.5} maxStars={5} />
    </MemoryRouter>
  );
  const filled = container.querySelector(`.${styles.starsFilled}`) as HTMLElement;
  expect(filled.style.width).toBe('50%');
});

it('should render interactive radio buttons when interactive is true', () => {
  const { container } = render(
    <MemoryRouter>
      <StarRating value={0} interactive maxStars={5} />
    </MemoryRouter>
  );
  const buttons = container.querySelectorAll(`.${styles.starButton}`);
  expect(buttons.length).toBe(5);
});

it('should call onChange with the clicked star value', () => {
  const handleChange = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <StarRating value={0} interactive onChange={(newValue) => handleChange(newValue)} />
    </MemoryRouter>
  );
  const buttons = container.querySelectorAll(`.${styles.starButton}`);
  fireEvent.click(buttons[2]);
  expect(handleChange).toHaveBeenCalledWith(3);
});

it('should not call onChange when disabled', () => {
  const handleChange = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <StarRating value={0} interactive disabled onChange={(newValue) => handleChange(newValue)} />
    </MemoryRouter>
  );
  const buttons = container.querySelectorAll(`.${styles.starButton}`) as NodeListOf<HTMLButtonElement>;
  fireEvent.click(buttons[1]);
  expect(handleChange).not.toHaveBeenCalled();
});

it('should apply a custom class name', () => {
  const { container } = render(
    <MemoryRouter>
      <StarRating value={4} className="custom-rating" />
    </MemoryRouter>
  );
  const rendered = container.querySelector('.custom-rating');
  expect(rendered).toBeTruthy();
});
