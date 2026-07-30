import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ImageIcon } from './image-icon.js';
import { VideoIcon } from './video-icon.js';
import { ArtIcon } from './art-icon.js';

it('should render the image icon as an svg element', () => {
  const { container } = render(
    <MemoryRouter>
      <ImageIcon />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});

it('should render the video icon as an svg element', () => {
  const { container } = render(
    <MemoryRouter>
      <VideoIcon />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});

it('should render the art icon as an svg element', () => {
  const { container } = render(
    <MemoryRouter>
      <ArtIcon />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg).toBeTruthy();
});

it('should set a default hebrew accessible label for the image icon', () => {
  const { container } = render(
    <MemoryRouter>
      <ImageIcon />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('aria-label')).toBe('תמונה');
});

it('should override the accessible label when a custom title is given', () => {
  const { container } = render(
    <MemoryRouter>
      <VideoIcon title="סרטון קהילתי" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('aria-label')).toBe('סרטון קהילתי');
});

it('should merge a custom className onto the art icon svg element', () => {
  const { container } = render(
    <MemoryRouter>
      <ArtIcon className="custom-art-icon" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('class')).toContain('custom-art-icon');
});

it('should set explicit pixel dimensions when size is a number', () => {
  const { container } = render(
    <MemoryRouter>
      <ImageIcon size={40} />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg') as SVGSVGElement;
  expect(svg.style.width).toBe('40px');
  expect(svg.style.height).toBe('40px');
});
