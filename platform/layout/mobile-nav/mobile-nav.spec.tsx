import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { HomeIcon, ToolboxIcon } from '@helemclub/platform.icons.helam-icons';
import { MobileNav } from './mobile-nav.js';
import type { MobileNavItem } from './mobile-nav-item-type.js';
import styles from './mobile-nav.module.scss';

const testItems: MobileNavItem[] = [
  { label: `בית`, path: `/`, icon: HomeIcon, order: 0 },
  { label: `כלים`, path: `/toolbox`, icon: ToolboxIcon, order: 1 },
];

it(`should render a navigation item for each entry`, () => {
  const { container } = render(
    <MemoryRouter initialEntries={[`/`]}>
      <MobileNav items={testItems} />
    </MemoryRouter>
  );
  const navItems = container.querySelectorAll(`.${styles.navItem}`);
  expect(navItems.length).toBe(testItems.length);
});

it(`should render the label of each navigation item`, () => {
  const { getByText } = render(
    <MemoryRouter initialEntries={[`/`]}>
      <MobileNav items={testItems} />
    </MemoryRouter>
  );
  expect(getByText(`בית`)).toBeTruthy();
  expect(getByText(`כלים`)).toBeTruthy();
});

it(`should mark the item matching the current route as active`, () => {
  const { container } = render(
    <MemoryRouter initialEntries={[`/toolbox`]}>
      <MobileNav items={testItems} />
    </MemoryRouter>
  );
  const activeItems = container.querySelectorAll(`.${styles.navItemActive}`);
  expect(activeItems.length).toBe(1);
  expect(activeItems[0].textContent).toContain(`כלים`);
});

it(`should mark the home item as active only on the root route`, () => {
  const { container } = render(
    <MemoryRouter initialEntries={[`/toolbox`]}>
      <MobileNav items={testItems} />
    </MemoryRouter>
  );
  const activeItems = container.querySelectorAll(`.${styles.navItemActive}`);
  const activeLabels = Array.from(activeItems).map((el) => el.textContent);
  expect(activeLabels.includes(`בית`)).toBe(false);
});

it(`should apply a custom class name to the root element`, () => {
  const { container } = render(
    <MemoryRouter initialEntries={[`/`]}>
      <MobileNav items={testItems} className="custom-nav" />
    </MemoryRouter>
  );
  const nav = container.querySelector(`.${styles.mobileNav}`);
  expect(nav?.classList.contains(`custom-nav`)).toBe(true);
});

it(`should navigate active state when clicking a different item`, () => {
  const { container, getByText } = render(
    <MemoryRouter initialEntries={[`/`]}>
      <MobileNav items={testItems} />
    </MemoryRouter>
  );
  const toolboxLink = getByText(`כלים`).closest(`a`) as HTMLAnchorElement;
  fireEvent.click(toolboxLink);
  expect(toolboxLink.getAttribute(`href`)).toBe(`/toolbox`);
});
