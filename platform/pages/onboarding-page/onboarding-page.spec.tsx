import React from 'react';
import { render } from '@testing-library/react';
import {
  BasicOnboardingPage,
  AwaitingModeratorApproval,
  PendingApprovalNoticeForMember,
} from './onboarding-page.compositions.js';

it('renders the onboarding wizard', () => {
  const { getByText } = render(<BasicOnboardingPage />);
  expect(getByText('כמה פרטים לפני שמתחילים')).toBeTruthy();
});

it('renders without crashing', () => {
  const { container } = render(<BasicOnboardingPage />);
  expect(container.firstChild).toBeTruthy();
});

it('shows the pending-approval notice instead of the wizard while awaiting a decision', () => {
  const { getByText, queryByText } = render(<AwaitingModeratorApproval />);
  expect(getByText('ממתין לאישור')).toBeTruthy();
  expect(queryByText('כמה פרטים לפני שמתחילים')).toBeNull();
});

it('explains that participation opens once membership is approved', () => {
  const { getByText } = render(<AwaitingModeratorApproval />);
  expect(getByText(/פרסום תכנים, תגובות/)).toBeTruthy();
});

it('personalises the notice with the member display name', () => {
  const { getByText } = render(<PendingApprovalNoticeForMember />);
  expect(getByText('תודה, שירה אזולאי!')).toBeTruthy();
});
