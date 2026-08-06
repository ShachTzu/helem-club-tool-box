import React from 'react';
import { render } from '@testing-library/react';
import {
  BasicOnboardingPage,
  WaitingForApproval,
  ApprovedMember,
} from './onboarding-page.compositions.js';

it('renders the onboarding wizard for a fresh account', () => {
  const { getByText } = render(<BasicOnboardingPage />);
  expect(getByText('כמה פרטים לפני שמתחילים')).toBeTruthy();
});

it('shows the waiting-for-approval state instead of the wizard once submitted', () => {
  const { getByText, queryByText } = render(<WaitingForApproval />);
  expect(getByText('קיבלנו את הפרטים שלך')).toBeTruthy();
  expect(queryByText('כמה פרטים לפני שמתחילים')).toBeNull();
});

it('welcomes an approved member', () => {
  const { getByText } = render(<ApprovedMember />);
  expect(getByText('ברוכים הבאים להלם קלאב')).toBeTruthy();
});
