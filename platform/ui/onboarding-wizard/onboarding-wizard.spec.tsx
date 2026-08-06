import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { BasicOnboardingWizard, GoogleSignUpWizard } from './onboarding-wizard.compositions.js';

it('renders the wizard title and the first step', () => {
  const { getByText } = render(<BasicOnboardingWizard />);
  expect(getByText('כמה פרטים לפני שמתחילים')).toBeTruthy();
  expect(getByText('שם מלא')).toBeTruthy();
  expect(getByText('מספר טלפון')).toBeTruthy();
});

it('pre-fills what a Google sign-up already told us', () => {
  const { container } = render(<GoogleSignUpWizard />);
  const values = Array.from(container.querySelectorAll('input')).map((input) => input.value);
  expect(values).toContain('רותם לוי');
  expect(values).toContain('rotem@example.com');
});

it('blocks the first step until there is a name and a valid phone', () => {
  const { container, getByText } = render(<BasicOnboardingWizard />);
  const next = getByText('המשך').closest('button') as HTMLButtonElement;
  expect(next.disabled).toBe(true);

  const inputs = Array.from(container.querySelectorAll('input'));
  fireEvent.change(inputs[0], { target: { value: 'רותם לוי' } });
  fireEvent.change(inputs[1], { target: { value: '050' } });
  expect(next.disabled).toBe(true);

  fireEvent.change(inputs[1], { target: { value: '050-1234567' } });
  expect(next.disabled).toBe(false);
});
