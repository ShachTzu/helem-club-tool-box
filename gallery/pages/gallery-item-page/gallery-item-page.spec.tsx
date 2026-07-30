import React from 'react';
import { render } from '@testing-library/react';
import { BasicGalleryItemPage, GalleryItemNotFound } from './gallery-item-page.compositions.js';

it('renders the gallery breadcrumb', () => {
  const { getByText } = render(<BasicGalleryItemPage />);
  expect(getByText('גלריית PTSDART')).toBeTruthy();
});

it('renders a not-found state for a missing item', () => {
  const { getByText } = render(<GalleryItemNotFound />);
  expect(getByText('היצירה לא נמצאה')).toBeTruthy();
});
