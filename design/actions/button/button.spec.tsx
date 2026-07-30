import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Button } from './button.js';
import styles from './button.module.scss';

it('should render the button label', () => {
  const { container } = render(
    <MemoryRouter>
      <Button>שמור שינויים</Button>
    </MemoryRouter>
  );
  const rendered = container.querySelector(`.${styles.label}`);
  expect(rendered?.textContent).toBe(`שמור שינויים`);
});

it('should call onClick when clicked', () => {
  const onClick = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <Button onClick={() => onClick()}>לחץ כאן</Button>
    </MemoryRouter>
  );
  const button = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);
});

it('should not call onClick when disabled', () => {
  const onClick = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <Button disabled onClick={() => onClick()}>
        לא זמין
      </Button>
    </MemoryRouter>
  );
  const button = container.querySelector('button') as HTMLButtonElement;
  fireEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();
});

it('should apply the variant class name', () => {
  const { container } = render(
    <MemoryRouter>
      <Button variant="danger">מחק</Button>
    </MemoryRouter>
  );
  const button = container.querySelector('button');
  expect(button?.className).toContain(styles.danger);
});

it('should render a spinner element when loading', () => {
  const { container } = render(
    <MemoryRouter>
      <Button loading>שולח</Button>
    </MemoryRouter>
  );
  const spinner = container.querySelector(`.${styles.spinner}`);
  expect(spinner).toBeTruthy();
});

it('should render as a link when href is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Button href="/domains">תחומי התמודדות</Button>
    </MemoryRouter>
  );
  const link = container.querySelector('a');
  expect(link?.getAttribute('href')).toBe('/domains');
});

it('should open external links in a new tab', () => {
  const { container } = render(
    <MemoryRouter>
      <Button href="https://helam.club" external>
        קישור חיצוני
      </Button>
    </MemoryRouter>
  );
  const link = container.querySelector('a');
  expect(link?.getAttribute('target')).toBe('_blank');
});
