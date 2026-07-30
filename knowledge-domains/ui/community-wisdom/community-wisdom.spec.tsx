import React from 'react';
import { render } from '@testing-library/react';
import { FullCommunityWisdom, CompactCommunityWisdom } from './community-wisdom.compositions.js';

it('renders the community wisdom hub title', () => {
  const { getAllByText } = render(<FullCommunityWisdom />);
  expect(getAllByText('חוכמת הקהילה').length).toBeGreaterThan(0);
});

it('renders a see-all CTA in compact mode', () => {
  const { getByText } = render(<CompactCommunityWisdom />);
  expect(getByText('לכל חוכמת הקהילה ←')).toBeTruthy();
});
