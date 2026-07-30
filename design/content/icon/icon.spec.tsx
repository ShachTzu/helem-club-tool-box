import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Icon } from './icon.js';
import styles from './icon.module.scss';

const CIRCLE_PATH = `M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Z`;

it('should render an svg element with the given path', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon path={CIRCLE_PATH} />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  const path = container.querySelector('path');
  expect(svg).toBeTruthy();
  expect(path?.getAttribute('d')).toBe(CIRCLE_PATH);
});

it('should render custom children instead of a path', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon>
        <circle cx="12" cy="12" r="10" />
      </Icon>
    </MemoryRouter>
  );
  const circle = container.querySelector('circle');
  expect(circle).toBeTruthy();
});

it('should apply the themed color class', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon path={CIRCLE_PATH} color="accent" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('class')).toContain(styles['color-accent']);
});

it('should set width and height based on the medium size keyword', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon path={CIRCLE_PATH} size="medium" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg') as SVGSVGElement;
  expect(svg.style.width).toBe('24px');
  expect(svg.style.height).toBe('24px');
});

it('should set an explicit pixel size when a number is given', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon path={CIRCLE_PATH} size={48} />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg') as SVGSVGElement;
  expect(svg.style.width).toBe('48px');
  expect(svg.style.height).toBe('48px');
});

it('should expose an accessible label when title is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon path={CIRCLE_PATH} title="עיגול" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('aria-label')).toBe('עיגול');
  expect(svg?.getAttribute('role')).toBe('img');
});

it('should mark the icon as decorative when no title is provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon path={CIRCLE_PATH} />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('aria-hidden')).toBe('true');
});

it('should merge a custom className onto the svg element', () => {
  const { container } = render(
    <MemoryRouter>
      <Icon path={CIRCLE_PATH} className="custom-icon" />
    </MemoryRouter>
  );
  const svg = container.querySelector('svg');
  expect(svg?.getAttribute('class')).toContain('custom-icon');
});
