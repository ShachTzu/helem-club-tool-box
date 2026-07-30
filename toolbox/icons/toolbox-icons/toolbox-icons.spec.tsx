import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AppIcon } from './app-icon.js';
import { SubmitIcon } from './submit-icon.js';
import { FeaturedIcon } from './featured-icon.js';
import { ExternalLinkIcon } from './external-link-icon.js';

it('should render the app icon as an svg', () => {
  const { container } = render(
    <MemoryRouter>
      <AppIcon />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});

it('should render the submit icon with an accessible label', () => {
  const { container } = render(
    <MemoryRouter>
      <SubmitIcon title="הגשת כלי" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('aria-label')).toBe('הגשת כלי');
  expect(svg?.getAttribute('role')).toBe('img');
});

it('should render the featured icon as a filled shape by default', () => {
  const { container } = render(
    <MemoryRouter>
      <FeaturedIcon />
    </MemoryRouter>
  );
  const path = container.querySelector('path');
  expect(path?.getAttribute('fill')).toBe('currentColor');
});

it('should render the external-link icon with a custom size', () => {
  const { container } = render(
    <MemoryRouter>
      <ExternalLinkIcon size={40} />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg') as SVGSVGElement;
  expect(svg.style.width).toBe('40px');
  expect(svg.style.height).toBe('40px');
});

it('should merge a custom className onto the icon svg element', () => {
  const { container } = render(
    <MemoryRouter>
      <AppIcon className="custom-toolbox-icon" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('class')).toContain('custom-toolbox-icon');
});
