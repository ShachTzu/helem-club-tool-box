import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Tabs } from './tabs.js';
import styles from './tabs.module.scss';
import type { TabItem } from './tab-item-type.js';

const items: TabItem[] = [
  { key: `first`, label: `ראשון` },
  { key: `second`, label: `שני` },
  { key: `third`, label: `שלישי` },
];

it('should render all provided tab labels', () => {
  const { container } = render(
    <MemoryRouter>
      <Tabs items={items} />
    </MemoryRouter>
  );

  const tabButtons = container.querySelectorAll(`.${styles.tab}`);
  expect(tabButtons.length).toBe(3);
});

it('should mark the first tab as active by default when uncontrolled', () => {
  const { container } = render(
    <MemoryRouter>
      <Tabs items={items} />
    </MemoryRouter>
  );

  const tabButtons = container.querySelectorAll(`.${styles.tab}`);
  const firstTab = tabButtons[0] as HTMLButtonElement;
  expect(firstTab.classList.contains(styles.tabActive)).toBe(true);
});

it('should switch active tab on click when uncontrolled', () => {
  const { container } = render(
    <MemoryRouter>
      <Tabs items={items} />
    </MemoryRouter>
  );

  const tabButtons = container.querySelectorAll(`.${styles.tab}`);
  const secondTab = tabButtons[1] as HTMLButtonElement;
  fireEvent.click(secondTab);

  const updatedButtons = container.querySelectorAll(`.${styles.tab}`);
  const updatedSecondTab = updatedButtons[1] as HTMLButtonElement;
  expect(updatedSecondTab.classList.contains(styles.tabActive)).toBe(true);
});

it('should respect the controlled activeKey prop', () => {
  const { container } = render(
    <MemoryRouter>
      <Tabs items={items} activeKey="third" />
    </MemoryRouter>
  );

  const tabButtons = container.querySelectorAll(`.${styles.tab}`);
  const thirdTab = tabButtons[2] as HTMLButtonElement;
  expect(thirdTab.classList.contains(styles.tabActive)).toBe(true);
});

it('should call onChange with the selected key when a tab is clicked', () => {
  let selectedKey = ``;
  const handleChange = (key: string) => {
    selectedKey = key;
  };

  const { container } = render(
    <MemoryRouter>
      <Tabs items={items} activeKey="first" onChange={handleChange} />
    </MemoryRouter>
  );

  const tabButtons = container.querySelectorAll(`.${styles.tab}`);
  const secondTab = tabButtons[1] as HTMLButtonElement;
  fireEvent.click(secondTab);

  expect(selectedKey).toBe(`second`);
});

it('should not change active tab internally when controlled', () => {
  const { container } = render(
    <MemoryRouter>
      <Tabs items={items} activeKey="first" onChange={() => {}} />
    </MemoryRouter>
  );

  const tabButtons = container.querySelectorAll(`.${styles.tab}`);
  const secondTab = tabButtons[1] as HTMLButtonElement;
  fireEvent.click(secondTab);

  const updatedButtons = container.querySelectorAll(`.${styles.tab}`);
  const firstTab = updatedButtons[0] as HTMLButtonElement;
  expect(firstTab.classList.contains(styles.tabActive)).toBe(true);
});
