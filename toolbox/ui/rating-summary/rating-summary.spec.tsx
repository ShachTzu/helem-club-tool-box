import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RatingSummary } from './rating-summary.js';
import styles from './rating-summary.module.scss';

it('should render the average rating value', () => {
  const { container } = render(
    <MemoryRouter>
      <RatingSummary averageRating={4.7} ratingCount={96} ratingHistogram={[2, 3, 6, 20, 65]} />
    </MemoryRouter>
  );
  const averageValue = container.querySelector(`.${styles.averageValue}`);
  expect(averageValue?.textContent).toBe('4.7');
});

it('should render the rating count text', () => {
  const { container } = render(
    <MemoryRouter>
      <RatingSummary averageRating={4.7} ratingCount={96} ratingHistogram={[2, 3, 6, 20, 65]} />
    </MemoryRouter>
  );
  const countText = container.querySelector(`.${styles.countText}`);
  expect(countText?.textContent).toContain('96');
});

it('should render a histogram row for each star level', () => {
  const { container } = render(
    <MemoryRouter>
      <RatingSummary averageRating={4.7} ratingCount={96} ratingHistogram={[2, 3, 6, 20, 65]} />
    </MemoryRouter>
  );
  const rows = container.querySelectorAll(`.${styles.histogramRow}`);
  expect(rows.length).toBe(5);
});

it('should render histogram counts matching the provided histogram', () => {
  const { container } = render(
    <MemoryRouter>
      <RatingSummary averageRating={4.7} ratingCount={96} ratingHistogram={[2, 3, 6, 20, 65]} />
    </MemoryRouter>
  );
  const counts = container.querySelectorAll(`.${styles.histogramCount}`);
  const countValues = Array.from(counts).map((node) => node.textContent);
  expect(countValues).toEqual(['65', '20', '6', '3', '2']);
});
