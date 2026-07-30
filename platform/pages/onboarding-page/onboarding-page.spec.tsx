import React from 'react';
import { render } from '@testing-library/react';
import { BasicOnboardingPage } from './onboarding-page.compositions.js';

it('renders the onboarding wizard', () => {
  const { getByText } = render(<BasicOnboardingPage />);
  expect(getByText('כמה פרטים לפני שמתחילים')).toBeTruthy();
});

it('renders without crashing', () => {
  const { container } = render(<BasicOnboardingPage />);
  expect(container.firstChild).toBeTruthy();
});
