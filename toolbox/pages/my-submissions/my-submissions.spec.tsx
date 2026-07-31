import React from 'react';
import { render } from '@testing-library/react';
import { BasicMySubmissions, EmptyMySubmissions } from './my-submissions.compositions.js';

it('renders the member submissions with the page title', () => {
  const { getByText } = render(<BasicMySubmissions />);
  expect(getByText('ההגשות שלי')).toBeTruthy();
  expect(getByText('נשימה רגועה')).toBeTruthy();
});

it('shows an empty state with a submit CTA when there are no submissions', () => {
  const { getByText } = render(<EmptyMySubmissions />);
  expect(getByText('➕ הגשת כלי')).toBeTruthy();
});
