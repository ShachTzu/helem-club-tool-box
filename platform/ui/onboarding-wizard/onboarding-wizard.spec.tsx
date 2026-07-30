import React from 'react';
import { render } from '@testing-library/react';
import { BasicOnboardingWizard } from './onboarding-wizard.compositions.js';

it('renders the wizard title', () => {
  const { getByText } = render(<BasicOnboardingWizard />);
  expect(getByText('כמה פרטים לפני שמתחילים')).toBeTruthy();
});

it('renders the first step fields', () => {
  const { getByText } = render(<BasicOnboardingWizard />);
  expect(getByText('שם מלא')).toBeTruthy();
});
