import React from 'react';
import { render } from '@testing-library/react';
import { BasicKnowledgeLibraryLobby, EmptyKnowledgeLibraryLobby } from './knowledge-library-lobby.compositions.js';
import { MOCK_TOP_LEVEL_PAGES } from './knowledge-library-lobby.mock.js';

it('renders the knowledge library title', () => {
  const { getByText } = render(<BasicKnowledgeLibraryLobby />);
  expect(getByText('ספריית הידע')).toBeTruthy();
});

it('renders a tile for every top-level page', () => {
  const { getByText } = render(<BasicKnowledgeLibraryLobby />);
  MOCK_TOP_LEVEL_PAGES.forEach((page) => {
    expect(getByText(page.title)).toBeTruthy();
  });
});

it('shows an empty state when there is no content yet', () => {
  const { getByText } = render(<EmptyKnowledgeLibraryLobby />);
  expect(getByText('עדיין אין תוכן בספריית הידע.')).toBeTruthy();
});
