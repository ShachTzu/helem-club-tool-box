import React from 'react';
import { render } from '@testing-library/react';
import { BasicRecordPage } from './record-page.compositions.js';

it('renders the record breadcrumb', () => {
  const { getByText } = render(<BasicRecordPage />);
  expect(getByText('ספריית הידע')).toBeTruthy();
});

it('renders without crashing', () => {
  const { container } = render(<BasicRecordPage />);
  expect(container.firstChild).toBeTruthy();
});
