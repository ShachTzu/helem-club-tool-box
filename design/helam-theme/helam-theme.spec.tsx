import { render } from '@testing-library/react';
import { HelamTheme } from './helam-theme.js';

it('renders with the correct children', () => {
  const { getByText } = render(<HelamTheme>Hello Helam Club!</HelamTheme>);
  const rendered = getByText('Hello Helam Club!');
  expect(rendered).toBeTruthy();
});

it('applies rtl direction by default', () => {
  const { container } = render(<HelamTheme>content</HelamTheme>);
  const root = container.firstChild as HTMLElement;
  expect(root.getAttribute('dir')).toBe('rtl');
});

it('applies a custom class name', () => {
  const { container } = render(<HelamTheme className="custom-class">content</HelamTheme>);
  const root = container.firstChild as HTMLElement;
  expect(root.className.includes('custom-class')).toBe(true);
});
