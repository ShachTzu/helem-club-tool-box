import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Tooltip } from './tooltip.js';
import styles from './tooltip.module.scss';

it('should render the trigger children', () => {
  const { getByText } = render(
    <MemoryRouter>
      <Tooltip content="הסבר קצר">
        <button type="button">כפתור</button>
      </Tooltip>
    </MemoryRouter>
  );

  const trigger = getByText('כפתור');
  expect(trigger).toBeTruthy();
});

it('should show the tooltip content on mouse enter', () => {
  const { container } = render(
    <MemoryRouter>
      <Tooltip content="הסבר קצר">
        <button type="button">כפתור</button>
      </Tooltip>
    </MemoryRouter>
  );

  const wrapper = container.querySelector(`.${styles.wrapper}`);
  fireEvent.mouseEnter(wrapper as Element);

  const tooltip = container.querySelector(`.${styles.tooltip}`);
  expect(tooltip?.className).toContain(styles.visible);
});

it('should hide the tooltip content on mouse leave', () => {
  const { container } = render(
    <MemoryRouter>
      <Tooltip content="הסבר קצר">
        <button type="button">כפתור</button>
      </Tooltip>
    </MemoryRouter>
  );

  const wrapper = container.querySelector(`.${styles.wrapper}`);
  fireEvent.mouseEnter(wrapper as Element);
  fireEvent.mouseLeave(wrapper as Element);

  const tooltip = container.querySelector(`.${styles.tooltip}`);
  expect(tooltip?.className).not.toContain(styles.visible);
});

it('should not become visible when disabled', () => {
  const { container } = render(
    <MemoryRouter>
      <Tooltip content="הסבר קצר" disabled>
        <button type="button">כפתור</button>
      </Tooltip>
    </MemoryRouter>
  );

  const wrapper = container.querySelector(`.${styles.wrapper}`);
  fireEvent.mouseEnter(wrapper as Element);

  const tooltip = container.querySelector(`.${styles.tooltip}`);
  expect(tooltip?.className).not.toContain(styles.visible);
});

it('should apply the placement class name', () => {
  const { container } = render(
    <MemoryRouter>
      <Tooltip content="הסבר קצר" placement="end">
        <button type="button">כפתור</button>
      </Tooltip>
    </MemoryRouter>
  );

  const tooltip = container.querySelector(`.${styles.tooltip}`);
  expect(tooltip?.className).toContain(styles.end);
});
