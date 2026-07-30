import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Textarea } from './textarea.js';
import styles from './textarea.module.scss';

it('should render the label text', () => {
  const { container } = render(
    <MemoryRouter>
      <Textarea label="הוספת תגובה" />
    </MemoryRouter>
  );

  const label = container.querySelector(`.${styles.label}`);
  expect(label?.textContent).toContain('הוספת תגובה');
});

it('should render the placeholder text', () => {
  const { container } = render(
    <MemoryRouter>
      <Textarea placeholder="כתבו כאן משהו" />
    </MemoryRouter>
  );

  const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
  expect(textarea.placeholder).toBe('כתבו כאן משהו');
});

it('should call onChange with the updated value', () => {
  const handleChange = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <Textarea value="" onChange={handleChange} />
    </MemoryRouter>
  );

  const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
  fireEvent.change(textarea, { target: { value: 'שלום עולם' } });

  expect(handleChange).toHaveBeenCalledWith('שלום עולם');
});

it('should apply the error class when an error message is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Textarea error="שדה חובה" />
    </MemoryRouter>
  );

  const textarea = container.querySelector('textarea');
  expect(textarea?.className).toContain(styles.error);
});

it('should render the error message text', () => {
  const { container } = render(
    <MemoryRouter>
      <Textarea error="שדה חובה" />
    </MemoryRouter>
  );

  const errorText = container.querySelector(`.${styles.errorText}`);
  expect(errorText?.textContent).toBe('שדה חובה');
});

it('should render a character counter when maxLength is set', () => {
  const { container } = render(
    <MemoryRouter>
      <Textarea value="שלום" onChange={() => {}} maxLength={100} />
    </MemoryRouter>
  );

  const counter = container.querySelector(`.${styles.counter}`);
  expect(counter?.textContent).toBe('4/100');
});

it('should clip the value to maxLength when changed', () => {
  const handleChange = vi.fn();
  const { container } = render(
    <MemoryRouter>
      <Textarea value="12345" onChange={handleChange} maxLength={6} />
    </MemoryRouter>
  );

  const textarea = container.querySelector('textarea') as HTMLTextAreaElement;
  fireEvent.change(textarea, { target: { value: '1234567890' } });

  expect(handleChange).toHaveBeenCalledWith('123456');
});
