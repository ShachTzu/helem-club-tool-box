import React from 'react';
import { render } from '@testing-library/react';
import { AllowedEditor, NotAllowed } from './manage-knowledge-library.compositions.js';

it('shows an access-denied message when the caller cannot manage the library', () => {
  const { getByText } = render(<NotAllowed />);
  expect(getByText('אין לך הרשאה לנהל את ספריית הידע.')).toBeTruthy();
});

it('renders the tabs for an allowed editor', () => {
  const { getByText } = render(<AllowedEditor />);
  expect(getByText('עמודים')).toBeTruthy();
  expect(getByText('ייבוא CSV')).toBeTruthy();
});

it('shows the admin-only permissions tab for an admin user', () => {
  const { getByText } = render(<AllowedEditor />);
  expect(getByText('הרשאות')).toBeTruthy();
});
