import React from 'react';
import { render } from '@testing-library/react';
import { SignedInComposer, AnonymousComposer } from './comment-composer.compositions.js';

it('renders the submit action for a signed-in member', () => {
  const { getByText } = render(<SignedInComposer />);
  expect(getByText('פרסום תגובה')).toBeTruthy();
});

it('renders a sign-in prompt for anonymous visitors', () => {
  const { getByText } = render(<AnonymousComposer />);
  expect(getByText('התחברות / הרשמה')).toBeTruthy();
});
