import React from 'react';
import { render } from '@testing-library/react';
import { BasicEventsListing } from './events-listing.compositions.js';

it('renders the events hero title', () => {
  const { getByText } = render(<BasicEventsListing />);
  expect(getByText('אירועי קהילה')).toBeTruthy();
});

it('renders the schedule tabs', () => {
  const { getByText } = render(<BasicEventsListing />);
  expect(getByText('אירועים קרובים')).toBeTruthy();
});
