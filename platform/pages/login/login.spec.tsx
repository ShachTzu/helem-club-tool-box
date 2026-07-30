import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Login } from './login.js';

it(`renders the welcome heading`, () => {
  const { container } = render(
    <MockProvider>
      <Login />
    </MockProvider>
  );

  const heading = container.querySelector(`h2`);
  expect(heading?.textContent).toContain(`ברוכים הבאים`);
});

it(`renders the google sign-in button`, () => {
  const { container } = render(
    <MockProvider>
      <Login />
    </MockProvider>
  );

  const buttons = container.querySelectorAll(`button`);
  const googleButton = Array.from(buttons).find((button) =>
    button.textContent?.includes(`התחברות עם Google`)
  );
  expect(googleButton).toBeTruthy();
});

it(`updates the email field value when typing`, () => {
  const { container } = render(
    <MockProvider>
      <Login />
    </MockProvider>
  );

  const input = container.querySelector(`input[type="email"]`) as HTMLInputElement;
  fireEvent.change(input, { target: { value: `visitor@example.com` } });

  expect(input.value).toBe(`visitor@example.com`);
});

it(`shows a validation error when submitting an empty email`, () => {
  const { container } = render(
    <MockProvider>
      <Login />
    </MockProvider>
  );

  const buttons = container.querySelectorAll(`button`);
  const submitButton = Array.from(buttons).find((button) =>
    button.textContent?.includes(`שליחת קוד למייל`)
  ) as HTMLButtonElement;
  fireEvent.click(submitButton);

  expect(container.textContent).toContain(`נא להזין כתובת מייל תקינה`);
});

it(`stays on the email step when the form first renders`, () => {
  const { container } = render(
    <MockProvider>
      <Login />
    </MockProvider>
  );

  const codeInput = container.querySelector(`input[placeholder="הזינו את הקוד שקיבלתם"]`);
  expect(codeInput).toBeFalsy();
});
