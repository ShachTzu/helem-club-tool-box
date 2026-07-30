import React from 'react';
import { render } from '@testing-library/react';
import { BasicWisdomPage } from './wisdom-page.compositions.js';

it('renders the wisdom page hero title', () => {
  const { getAllByText } = render(<BasicWisdomPage />);
  expect(getAllByText('חוכמת הקהילה').length).toBeGreaterThan(0);
});

it('renders the ecosystem hub eyebrow', () => {
  const { getByText } = render(<BasicWisdomPage />);
  expect(getByText('המרכז של הלם קלאב')).toBeTruthy();
});
