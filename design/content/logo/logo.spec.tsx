import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Logo } from './logo.js';
import { resolveAssetSrc } from './resolve-asset-src.js';
import styles from './logo.module.scss';

it('should label the link with the wordmark for screen readers', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.getAttribute(`aria-label`)).toBe(`הלם קלאב`);
});

it('should render the mark as decorative, since the link carries the label', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const image = container.querySelector(`img`);
  expect(image?.getAttribute(`alt`)).toBe(``);
});

it('should render a different mark for each color variant', () => {
  const renderVariantSrc = (variant: 'dark' | 'light') => {
    const { container } = render(
      <MemoryRouter>
        <Logo variant={variant} />
      </MemoryRouter>
    );
    return container.querySelector(`img`)?.getAttribute(`src`);
  };
  const darkSurfaceSrc = renderVariantSrc(`dark`);
  const lightSurfaceSrc = renderVariantSrc(`light`);
  expect(darkSurfaceSrc).toBeTruthy();
  expect(lightSurfaceSrc).toBeTruthy();
  expect(darkSurfaceSrc).not.toBe(lightSurfaceSrc);
});

it('should render the mark from the root-served url, which is what production actually serves', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const source = container.querySelector(`img`)?.getAttribute(`src`) || ``;
  expect(source.startsWith(`/public/`)).toBe(false);
  expect(source.startsWith(`/`)).toBe(true);
});

it('should collapse both bundler asset forms onto the same served url', () => {
  const serverForm = resolveAssetSrc(`static/images/mark.png`);
  const browserForm = resolveAssetSrc(`/public/static/images/mark.png`);
  expect(serverForm).toBe(`/static/images/mark.png`);
  expect(browserForm).toBe(serverForm);
});

it('should swap to the dev-server static root when the primary url never loads, even without an error event', async () => {
  // simulates the dev server: the `<img>` is server-rendered and its load
  // already failed silently before React hydrates and attaches `onError` —
  // the browser never re-fires an event for a listener that arrives late.
  Object.defineProperty(HTMLImageElement.prototype, `complete`, {
    configurable: true,
    get: () => true,
  });
  Object.defineProperty(HTMLImageElement.prototype, `naturalWidth`, {
    configurable: true,
    get: () => 0,
  });

  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );

  await new Promise((resolve) => setTimeout(resolve, 0));

  const source = container.querySelector(`img`)?.getAttribute(`src`) || ``;
  expect(source.startsWith(`/public/`)).toBe(true);

  // @ts-expect-error — restore the jsdom defaults for the remaining tests.
  delete HTMLImageElement.prototype.complete;
  // @ts-expect-error — restore the jsdom defaults for the remaining tests.
  delete HTMLImageElement.prototype.naturalWidth;
});

it('should leave absolute and inlined asset urls untouched', () => {
  expect(resolveAssetSrc(`https://cdn.example.com/mark.png`)).toBe(`https://cdn.example.com/mark.png`);
  expect(resolveAssetSrc(`data:image/png;base64,AAA`)).toBe(`data:image/png;base64,AAA`);
});

it('should link to the homepage by default', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.getAttribute(`href`)).toBe(`/`);
});

it('should link to a custom href when provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo href="/dashboard" />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.getAttribute(`href`)).toBe(`/dashboard`);
});

it('should apply the dark variant class by default', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.className).toContain(styles.dark);
});

it('should apply the light variant class when specified', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo variant="light" />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.className).toContain(styles.light);
});

it('should apply the requested size class', () => {
  const { container } = render(
    <MemoryRouter>
      <Logo size="large" />
    </MemoryRouter>
  );
  const anchor = container.querySelector(`a`);
  expect(anchor?.className).toContain(styles.sizeLarge);
});
