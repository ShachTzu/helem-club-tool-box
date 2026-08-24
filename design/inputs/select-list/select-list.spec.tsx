import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SelectList } from './select-list.js';
import styles from './select-list.module.scss';

const OPTIONS = [
  { value: `anxiety`, label: `חרדה` },
  { value: `sleep`, label: `שינה` },
  { value: `work-career`, label: `עבודה וקריירה` },
];

describe(`SelectList`, () => {
  it(`renders the placeholder when no value is selected`, () => {
    const { container } = render(
      <MemoryRouter>
        <SelectList options={OPTIONS} placeholder="בחרו אפשרות" />
      </MemoryRouter>
    );

    const placeholder = container.querySelector(`.${styles.placeholder}`);
    expect(placeholder?.textContent).toBe(`בחרו אפשרות`);
  });

  it(`opens the dropdown and lists all options on click`, () => {
    const { container } = render(
      <MemoryRouter>
        <SelectList options={OPTIONS} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLDivElement;
    fireEvent.click(trigger);

    const options = container.querySelectorAll(`.${styles.option}`);
    expect(options.length).toBe(OPTIONS.length);
  });

  it(`calls onChange with the selected value in single mode`, () => {
    const handleChange = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <SelectList options={OPTIONS} onChange={handleChange} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLDivElement;
    fireEvent.click(trigger);

    const options = container.querySelectorAll(`.${styles.option}`);
    fireEvent.click(options[0]);

    expect(handleChange).toHaveBeenCalledWith(`anxiety`);
  });

  it(`renders selected options as chips in multi mode`, () => {
    const { container } = render(
      <MemoryRouter>
        <SelectList options={OPTIONS} value={[`anxiety`, `sleep`]} multiple />
      </MemoryRouter>
    );

    const chips = container.querySelectorAll(`.${styles.chip}`);
    expect(chips.length).toBe(2);
  });

  it(`calls onChange with an updated array when removing a chip`, () => {
    const handleChange = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <SelectList options={OPTIONS} value={[`anxiety`, `sleep`]} onChange={handleChange} multiple />
      </MemoryRouter>
    );

    const removeButton = container.querySelector(`.${styles.chipRemove}`) as HTMLButtonElement;
    fireEvent.click(removeButton);

    expect(handleChange).toHaveBeenCalledWith([`sleep`]);
  });

  it(`is keyboard operable: focusable trigger, opens and selects without a mouse`, () => {
    const handleChange = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <SelectList options={OPTIONS} onChange={handleChange} searchable={false} label="מגדר" />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLDivElement;
    expect(trigger.getAttribute(`role`)).toBe(`combobox`);
    expect(trigger.tabIndex).toBe(0);
    expect(trigger.getAttribute(`aria-expanded`)).toBe(`false`);

    fireEvent.keyDown(trigger, { key: `Enter` });
    expect(trigger.getAttribute(`aria-expanded`)).toBe(`true`);
    expect(container.querySelector(`[role="listbox"]`)).toBeTruthy();

    fireEvent.keyDown(trigger, { key: `ArrowDown` });
    fireEvent.keyDown(trigger, { key: `Enter` });
    expect(handleChange).toHaveBeenCalledWith(`sleep`);

    // the trigger points the screen reader at the active option while arrowing.
    fireEvent.keyDown(trigger, { key: `ArrowDown` });
    expect(trigger.getAttribute(`aria-activedescendant`)).toBeTruthy();

    fireEvent.keyDown(trigger, { key: `Escape` });
    expect(trigger.getAttribute(`aria-expanded`)).toBe(`false`);
  });

  it(`shows a selected empty-string option's label instead of the placeholder`, () => {
    // regression: an explicitly selected "none / top-level" option uses value=''.
    // the trigger must show its label, not fall back to the placeholder as if
    // nothing were selected.
    const optionsWithNone = [{ value: ``, label: `ללא (עמוד עליון)` }, ...OPTIONS];
    const { container } = render(
      <MemoryRouter>
        <SelectList options={optionsWithNone} value="" placeholder="בחרו אפשרות" />
      </MemoryRouter>
    );

    const placeholder = container.querySelector(`.${styles.placeholder}`);
    expect(placeholder).toBeNull();

    const valueText = container.querySelector(`.${styles.valueText}`);
    expect(valueText?.textContent).toBe(`ללא (עמוד עליון)`);
  });

  it(`keeps the selection when the option is pressed while the search input has focus`, () => {
    const handleChange = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <SelectList options={OPTIONS} onChange={handleChange} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLDivElement;
    fireEvent.click(trigger);

    const searchInput = container.querySelector(`.${styles.searchInput}`) as HTMLInputElement;
    searchInput.focus();

    // pressing an option blurs the search input before the click lands, which
    // used to close the dropdown and swallow the selection entirely.
    const option = container.querySelectorAll(`.${styles.option}`)[1];
    fireEvent.mouseDown(option);
    fireEvent.blur(searchInput, { relatedTarget: null });
    fireEvent.click(option);

    expect(handleChange).toHaveBeenCalledWith(`sleep`);
  });

  it(`renders a required indicator and an error message`, () => {
    const { container } = render(
      <MemoryRouter>
        <SelectList options={OPTIONS} label="עלות" required error="שדה חובה" />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLDivElement;
    expect(trigger.getAttribute(`aria-required`)).toBe(`true`);
    expect(trigger.getAttribute(`aria-invalid`)).toBe(`true`);
    expect(container.querySelector(`.${styles.errorText}`)?.textContent).toBe(`שדה חובה`);
  });

  it(`filters options based on the search query`, () => {
    const { container } = render(
      <MemoryRouter>
        <SelectList options={OPTIONS} />
      </MemoryRouter>
    );

    const trigger = container.querySelector(`.${styles.trigger}`) as HTMLDivElement;
    fireEvent.click(trigger);

    const searchInput = container.querySelector(`.${styles.searchInput}`) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: `שינה` } });

    const options = container.querySelectorAll(`.${styles.option}`);
    expect(options.length).toBe(1);
  });
});
