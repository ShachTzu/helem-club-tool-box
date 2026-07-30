import React from 'react';
import { render } from '@testing-library/react';
import { BasicToolboxCatalog, EmptyToolboxCatalog } from './toolbox-catalog.compositions.js';

it('renders the catalog hero title', () => {
  const { getByText } = render(<BasicToolboxCatalog />);
  expect(getByText('אפליקציות שעוזרות באמת להתמודד')).toBeTruthy();
});

it('renders the hero even when there are no apps', () => {
  const { getByText } = render(<EmptyToolboxCatalog />);
  expect(getByText('ארגז הכלים')).toBeTruthy();
});
