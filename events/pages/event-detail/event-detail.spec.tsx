import React from 'react';
import { render } from '@testing-library/react';
import { EventNotFound } from './event-detail.compositions.js';

it('renders a not-found state for a missing event', () => {
  const { getByText } = render(<EventNotFound />);
  expect(getByText('האירוע לא נמצא')).toBeTruthy();
});

it('renders the not-found action link', () => {
  const { getByText } = render(<EventNotFound />);
  expect(getByText('חזרה לאירועים')).toBeTruthy();
});
