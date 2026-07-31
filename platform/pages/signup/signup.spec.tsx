import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Signup } from './signup.js';
import styles from './signup.module.scss';

/**
 * finds the primary submit button by its label, rather than by position —
 * the Google button is conditional, so positional lookups are brittle.
 */
function getSubmitButton(container: HTMLElement) {
  const buttons = Array.from(container.querySelectorAll('button'));
  return buttons.find((button) => button.textContent?.includes(`קבלת קוד`)) as HTMLButtonElement;
}

it('renders the signup headline and benefits', () => {
  const { container } = render(
    <MockProvider>
      <Signup />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.title}`)).not.toBeNull();
  expect(container.querySelector(`.${styles.benefits}`)).not.toBeNull();
});

it('renders a link to the login page', () => {
  const { container } = render(
    <MockProvider>
      <Signup loginHref="/auth/login" />
    </MockProvider>
  );

  const link = container.querySelector(`.${styles.loginLink}`);
  expect(link?.getAttribute('href')).toBe('/auth/login');
});

it('shows a validation error when submitting without a display name', () => {
  const { container } = render(
    <MockProvider>
      <Signup />
    </MockProvider>
  );

  fireEvent.click(getSubmitButton(container));

  const errorText = container.querySelector(`.${styles.errorText}`);
  expect(errorText).not.toBeNull();
});

it('shows a validation error when the email is invalid', () => {
  const { container } = render(
    <MockProvider>
      <Signup />
    </MockProvider>
  );

  const nameInput = container.querySelectorAll('input')[0] as HTMLInputElement;
  fireEvent.change(nameInput, { target: { value: `דנה כהן` } });

  const emailInput = container.querySelectorAll('input')[1] as HTMLInputElement;
  fireEvent.change(emailInput, { target: { value: `not-an-email` } });

  fireEvent.click(getSubmitButton(container));

  const errorText = container.querySelector(`.${styles.errorText}`);
  expect(errorText?.textContent).toContain(`תקינה`);
});

it('hides the Google button when Google sign-in is not configured', () => {
  const { container } = render(
    <MockProvider>
      <Signup />
    </MockProvider>
  );

  // rather than offering a button that cannot complete, the page falls back
  // to email-only signup.
  expect(container.querySelector(`.${styles.googleButton}`)).toBeNull();
});

it('offers Google signup when a token resolver is injected', () => {
  const { container } = render(
    <MockProvider>
      <Signup requestGoogleIdToken={() => Promise.resolve(`token`)} />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.googleButton}`)).not.toBeNull();
});
