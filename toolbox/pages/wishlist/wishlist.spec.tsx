import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Wishlist } from './wishlist.js';
import type { WishlistIdea } from './wishlist-idea-type.js';

const ideas: WishlistIdea[] = [
  {
    id: 'a',
    title: 'רעיון ראשון',
    description: 'תיאור ראשון',
    domains: ['שינה'],
    votes: 5,
    status: 'נאסף',
    author: 'דנה',
  },
  {
    id: 'b',
    title: 'רעיון שני',
    description: 'תיאור שני',
    domains: ['עבודה וקריירה'],
    votes: 20,
    status: 'בפיתוח',
    author: 'יוסי',
  },
];

it('renders the wishlist hero title', () => {
  const { getByText } = render(
    <MockProvider>
      <Wishlist ideas={ideas} />
    </MockProvider>
  );
  expect(getByText('רשימת המשאלות של הקהילה')).toBeTruthy();
});

it('renders every idea passed in', () => {
  const { getByText } = render(
    <MockProvider>
      <Wishlist ideas={ideas} />
    </MockProvider>
  );
  expect(getByText('רעיון ראשון')).toBeTruthy();
  expect(getByText('רעיון שני')).toBeTruthy();
});

it('increments the vote count when the vote button is clicked', () => {
  const { getByLabelText, getByText } = render(
    <MockProvider>
      <Wishlist ideas={ideas} />
    </MockProvider>
  );
  const voteButton = getByLabelText('הצבעה לרעיון: רעיון ראשון');
  fireEvent.click(voteButton);
  expect(getByText('6')).toBeTruthy();
});
