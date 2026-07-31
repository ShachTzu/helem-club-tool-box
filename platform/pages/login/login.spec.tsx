import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
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

it(`renders the google sign-in button when a token resolver is provided`, () => {
  const { container } = render(
    <MockProvider>
      <Login getGoogleIdToken={() => Promise.resolve(`token`)} />
    </MockProvider>
  );

  const buttons = container.querySelectorAll(`button`);
  const googleButton = Array.from(buttons).find((button) =>
    button.textContent?.includes(`התחברות עם Google`)
  );
  expect(googleButton).toBeTruthy();
});

it(`hides the google button when google sign-in is not configured`, () => {
  const { container } = render(
    <MockProvider>
      <Login />
    </MockProvider>
  );

  const buttons = container.querySelectorAll(`button`);
  const googleButton = Array.from(buttons).find((button) =>
    button.textContent?.includes(`התחברות עם Google`)
  );
  expect(googleButton).toBeFalsy();
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

it(`does not show an error when the member dismisses the google chooser`, async () => {
  const { container } = render(
    <MockProvider>
      <Login getGoogleIdToken={() => Promise.resolve(null)} />
    </MockProvider>
  );

  const buttons = container.querySelectorAll(`button`);
  const googleButton = Array.from(buttons).find((button) =>
    button.textContent?.includes(`התחברות עם Google`)
  ) as HTMLButtonElement;
  fireEvent.click(googleButton);

  await waitFor(() => {
    expect(container.textContent).not.toContain(`ההתחברות עם Google לא הושלמה`);
  });
});
