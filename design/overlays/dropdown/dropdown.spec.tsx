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
  it(`renders the trigger label and keeps the menu closed initially`, () => {
    const { container } = render(
      <MemoryRouter>
        <Dropdown label="תפריט" items={ITEMS} />
      </MemoryRouter>
    );

    const menu = container.querySelector(`.${styles.menu}`);
    expect(menu).toBeNull();

    const trigger = container.querySelector(`.${styles.defaultTrigger}`);
    expect(trigger?.textContent).toContain(`תפריט`);
  });

  it(`opens the menu when the trigger is clicked`, () => {
    const { container } = render(
      <MemoryRouter>
        <Dropdown label="תפריט" items={ITEMS} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.defaultTrigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    const menu = container.querySelector(`.${styles.menu}`);
    expect(menu).not.toBeNull();

    const items = container.querySelectorAll(`.${styles.item}`);
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

    const item = container.querySelector(`.${styles.item}`) as HTMLButtonElement;
    fireEvent.click(item);

    expect(selected).toBe(true);
    const menu = container.querySelector(`.${styles.menu}`);
    expect(menu).toBeNull();
  });

  it(`closes the menu when clicking outside`, () => {
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
    expect(container.querySelector(`.${styles.menu}`)).not.toBeNull();

    const outside = container.querySelector(`.outside`) as HTMLDivElement;
    fireEvent.mouseDown(outside);

    expect(container.querySelector(`.${styles.menu}`)).toBeNull();
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

    const item = container.querySelector(`.${styles.item}`) as HTMLButtonElement;
    fireEvent.click(item);

    expect(selected).toBe(false);
  });

  it(`applies the alignEnd class when align is set to end`, () => {
    const { container } = render(
      <MemoryRouter>
        <Dropdown label="תפריט" items={ITEMS} align="end" />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.defaultTrigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    const menu = container.querySelector(`.${styles.menu}`);
    expect(menu?.className).toContain(styles.alignEnd);
  });
});
