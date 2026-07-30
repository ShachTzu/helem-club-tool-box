import React from 'react';
import { render } from '@testing-library/react';
import { PostNotFound } from './post-page.compositions.js';

it('renders a not-found state for a missing post', () => {
  const { getByText } = render(<PostNotFound />);
  expect(getByText('הכתבה לא נמצאה')).toBeTruthy();
});

it('renders the not-found action link', () => {
  const { getByText } = render(<PostNotFound />);
  expect(getByText('חזרה לבלוג')).toBeTruthy();
});
