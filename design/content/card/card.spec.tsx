import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Card } from './card.js';
import styles from './card.module.scss';

it('should render its children', () => {
  const { container } = render(
    <MemoryRouter>
      <Card>
        <span>Card content</span>
      </Card>
    </MemoryRouter>
  );

  const content = container.querySelector('span');
  expect(content?.textContent).toBe('Card content');
});

it('should apply the medium padding class by default', () => {
  const { container } = render(
    <MemoryRouter>
      <Card>
        <span>Content</span>
      </Card>
    </MemoryRouter>
  );

  const card = container.querySelector(`.${styles.card}`);
  expect(card?.classList.contains(styles.paddingMedium)).toBe(true);
});

it('should apply the requested padding class', () => {
  const { container } = render(
    <MemoryRouter>
      <Card padding="large">
        <span>Content</span>
      </Card>
    </MemoryRouter>
  );

  const card = container.querySelector(`.${styles.card}`);
  expect(card?.classList.contains(styles.paddingLarge)).toBe(true);
});

it('should not apply the clickable class when clickable is not set', () => {
  const { container } = render(
    <MemoryRouter>
      <Card>
        <span>Content</span>
      </Card>
    </MemoryRouter>
  );

  const card = container.querySelector(`.${styles.card}`);
  expect(card?.classList.contains(styles.clickable)).toBe(false);
});

it('should apply the clickable class and role when clickable is set', () => {
  const { container } = render(
    <MemoryRouter>
      <Card clickable>
        <span>Content</span>
      </Card>
    </MemoryRouter>
  );

  const card = container.querySelector(`.${styles.card}`);
  expect(card?.classList.contains(styles.clickable)).toBe(true);
  expect(card?.getAttribute('role')).toBe('button');
});

it('should call onClick when a clickable card is clicked', () => {
  const handleClick = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <Card clickable onClick={() => handleClick()}>
        <span>Content</span>
      </Card>
    </MemoryRouter>
  );

  const card = container.querySelector(`.${styles.card}`) as HTMLDivElement;
  fireEvent.click(card);

  expect(handleClick).toHaveBeenCalledTimes(1);
});

it('should call onClick when Enter is pressed on a clickable card', () => {
  const handleClick = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <Card clickable onClick={() => handleClick()}>
        <span>Content</span>
      </Card>
    </MemoryRouter>
  );

  const card = container.querySelector(`.${styles.card}`) as HTMLDivElement;
  fireEvent.keyDown(card, { key: 'Enter' });

  expect(handleClick).toHaveBeenCalledTimes(1);
});
