import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { RoleSelector } from './role-selector.js';
import styles from './role-selector.module.scss';

describe(`RoleSelector`, () => {
  it(`renders the label of the currently selected role`, () => {
    const { container } = render(
      <MemoryRouter>
        <RoleSelector value="moderator" />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`);
    expect(trigger?.textContent).toContain(`מודרטור`);
  });

  it(`opens the menu with all role options when clicked`, () => {
    const { container } = render(
      <MemoryRouter>
        <RoleSelector value="member" />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    // the menu is portaled to document.body by the underlying Dropdown, so it is
    // not a descendant of `container`.
    const items = document.body.querySelectorAll(`button[role="menuitem"]`);
    expect(items.length).toBe(4);
  });

  it(`calls onChange with the selected role`, () => {
    let selectedRole: string | undefined;
    const { container } = render(
      <MemoryRouter>
        <RoleSelector value="member" onChange={(role) => { selectedRole = role; }} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
    fireEvent.click(trigger);

    const items = document.body.querySelectorAll(`button[role="menuitem"]`);
    const adminItem = Array.from(items).find((item) => item.textContent?.includes(`אדמין`)) as HTMLButtonElement;
    fireEvent.click(adminItem);

    expect(selectedRole).toBe(`admin`);
  });

  it(`does not open the menu when disabled`, () => {
    const { container } = render(
      <MemoryRouter>
        <RoleSelector value="member" disabled />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLButtonElement;
    expect(trigger.disabled).toBe(true);
  });
});
