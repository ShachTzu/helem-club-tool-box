import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Dropdown } from './dropdown.js';
import type { DropdownItemType } from './dropdown-item-type.js';
import styles from './dropdown.module.scss';

const ITEMS: DropdownItemType[] = [
  { id: `first`, label: `אפשרות ראשונה` },
  { id: `second`, label: `אפשרות שנייה` },
  { id: `blocked`, label: `אפשרות חסומה`, disabled: true },
];

describe(`Dropdown`, () => {
  // no manual DOM cleanup needed: @testing-library/react auto-unmounts after each test,
  // which also tears down portaled content since it is owned by the same React tree.

  it(`renders the trigger label and keeps the menu closed initially`, () => {
    const { container } = render(
      <MemoryRouter>
        <Dropdown label="תפריט" items={ITEMS} />
      </MemoryRouter>
    );

    const menu = document.body.querySelector(`.${styles.menu}`);
    expect(menu).toBeNull();

    const trigger = container.querySelector(`.${styles.defaultTrigger}`);
    expect(trigger?.textContent).toContain(`תפריט`);
  });

  it(`opens the menu when the trigger is clicked, portaled to document.body`, () => {
    const { container } = render(
      <MemoryRouter>
        <Dropdown label="תפריט" items={ITEMS} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.defaultTrigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    const menu = document.body.querySelector(`.${styles.menu}`);
    expect(menu).not.toBeNull();
    // the menu must not be a descendant of the dropdown root, confirming it escaped
    // any clipping/transformed ancestor via the portal.
    expect(container.contains(menu)).toBe(false);

    const items = document.body.querySelectorAll(`.${styles.item}`);
    expect(items.length).toBe(3);
  });

  it(`calls onSelect and closes the menu when an item is clicked`, () => {
    const handleSelect = () => {
      selected = true;
    };
    let selected = false;
    const items: DropdownItemType[] = [{ id: `first`, label: `אפשרות ראשונה`, onSelect: handleSelect }];

    const { container } = render(
      <MemoryRouter>
        <Dropdown label="תפריט" items={items} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.defaultTrigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    const item = document.body.querySelector(`.${styles.item}`) as HTMLButtonElement;
    fireEvent.click(item);

    expect(selected).toBe(true);
    const menu = document.body.querySelector(`.${styles.menu}`);
    expect(menu).toBeNull();
  });

  it(`closes the menu when clicking outside, but not when clicking inside the portaled menu`, () => {
    const { container } = render(
      <MemoryRouter>
        <div>
          <Dropdown label="תפריט" items={ITEMS} />
          <div className="outside">outside area</div>
        </div>
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.defaultTrigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);
    expect(document.body.querySelector(`.${styles.menu}`)).not.toBeNull();

    // clicking inside the portaled menu must not be treated as an outside click.
    const menuItem = document.body.querySelector(`.${styles.item}`) as HTMLButtonElement;
    fireEvent.mouseDown(menuItem);
    expect(document.body.querySelector(`.${styles.menu}`)).not.toBeNull();

    const outside = container.querySelector(`.outside`) as HTMLDivElement;
    fireEvent.mouseDown(outside);

    expect(document.body.querySelector(`.${styles.menu}`)).toBeNull();
  });

  it(`does not call onSelect for a disabled item`, () => {
    let selected = false;
    const items: DropdownItemType[] = [
      { id: `blocked`, label: `חסום`, disabled: true, onSelect: () => { selected = true; } },
    ];

    const { container } = render(
      <MemoryRouter>
        <Dropdown label="תפריט" items={items} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.defaultTrigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    const item = document.body.querySelector(`.${styles.item}`) as HTMLButtonElement;
    fireEvent.click(item);

    expect(selected).toBe(false);
  });

  it(`escapes an ancestor with overflow:hidden and a transform, which would otherwise clip a non-portaled fixed menu`, () => {
    const { container } = render(
      <MemoryRouter>
        <div style={{ overflow: `hidden`, transform: `translateX(0)`, width: 100, height: 50 }}>
          <Dropdown label="תפריט" items={ITEMS} />
        </div>
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.defaultTrigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    const menu = document.body.querySelector(`.${styles.menu}`);
    expect(menu).not.toBeNull();
    expect(menu?.parentElement).toBe(document.body);
  });
});
