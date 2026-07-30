import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TextInput } from './text-input.js';
import styles from './text-input.module.scss';

it('should render the label text', () => {
  const { container } = render(
    <MemoryRouter>
      <TextInput label="שם מלא" />
    </MemoryRouter>
  );
  const label = container.querySelector(`.${styles.label}`);
  expect(label?.textContent).toContain('שם מלא');
});

it('should render the placeholder', () => {
  const { container } = render(
    <MemoryRouter>
      <TextInput placeholder="כתובת דוא&quot;ל" />
    </MemoryRouter>
  );
  const input = container.querySelector('input') as HTMLInputElement;
  expect(input.placeholder).toBe('כתובת דוא"ל');
});

it('should call onChange with the new value', () => {
  let currentValue = '';
  const handleChange = (value: string) => {
    currentValue = value;
  };

  const { container } = render(
    <MemoryRouter>
      <TextInput value="" onChange={(value) => handleChange(value)} />
    </MemoryRouter>
  );

  const input = container.querySelector('input') as HTMLInputElement;
  fireEvent.change(input, { target: { value: 'שלום' } });

  expect(currentValue).toBe('שלום');
});

it('should render error text and apply the error container class', () => {
  const { container } = render(
    <MemoryRouter>
      <TextInput error="שדה חובה" />
    </MemoryRouter>
  );

  const errorText = container.querySelector(`.${styles.errorText}`);
  const errorContainer = container.querySelector(`.${styles.inputContainerError}`);

  expect(errorText?.textContent).toBe('שדה חובה');
  expect(errorContainer).toBeTruthy();
});

it('should render helper text when there is no error', () => {
  const { container } = render(
    <MemoryRouter>
      <TextInput helperText="נשתמש בזה רק לעדכונים" />
    </MemoryRouter>
  );

  const helperText = container.querySelector(`.${styles.helperText}`);
  expect(helperText?.textContent).toBe('נשתמש בזה רק לעדכונים');
});

it('should render an icon when provided', () => {
  const { container } = render(
    <MemoryRouter>
      <TextInput icon={<span className="my-icon">@</span>} />
    </MemoryRouter>
  );

  const icon = container.querySelector(`.${styles.icon}`);
  expect(icon).toBeTruthy();
});

it('should set the input type according to the type prop', () => {
  const { container } = render(
    <MemoryRouter>
      <TextInput type="email" />
    </MemoryRouter>
  );

  const input = container.querySelector('input') as HTMLInputElement;
  expect(input.type).toBe('email');
});
