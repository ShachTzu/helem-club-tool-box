import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Signup } from './signup.js';
import styles from './signup.module.scss';

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

  const submitButton = container.querySelectorAll('button')[1] as HTMLButtonElement;
  fireEvent.click(submitButton);

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

  const submitButton = container.querySelectorAll('button')[1] as HTMLButtonElement;
  fireEvent.click(submitButton);

  const errorText = container.querySelector(`.${styles.errorText}`);
  expect(errorText?.textContent).toContain(`תקינה`);
});

it('shows an error when Google signup is triggered without an integration', () => {
  const { container } = render(
    <MockProvider>
      <Signup />
    </MockProvider>
  );

  const googleButton = container.querySelector(`.${styles.googleButton}`) as HTMLButtonElement;
  fireEvent.click(googleButton);

  const errorText = container.querySelector(`.${styles.errorText}`);
  expect(errorText).not.toBeNull();
});
