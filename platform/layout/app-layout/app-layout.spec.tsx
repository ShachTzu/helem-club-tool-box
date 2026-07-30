import React from 'react';
import { render } from '@testing-library/react';
import { BasicAppLayout, SignedInAppLayout } from './app-layout.compositions.js';

it('renders the page content inside the shell', () => {
  const { getByText } = render(<BasicAppLayout />);
  expect(getByText('תוכן העמוד')).toBeTruthy();
});

it('renders a personalized greeting for a signed-in member', () => {
  const { getByText } = render(<SignedInAppLayout />);
  expect(getByText('שלום, דנה 👋')).toBeTruthy();
});
