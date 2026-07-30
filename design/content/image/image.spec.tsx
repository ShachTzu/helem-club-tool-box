import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Image } from './image.js';
import styles from './image.module.scss';

it('should render an image with the given src and alt', () => {
  const { container } = render(
    <MemoryRouter>
      <Image src="https://example.com/photo.jpg" alt="תמונה לדוגמה" />
    </MemoryRouter>
  );

  const img = container.querySelector('img');
  expect(img).toBeTruthy();
  expect(img?.getAttribute('src')).toBe('https://example.com/photo.jpg');
  expect(img?.getAttribute('alt')).toBe('תמונה לדוגמה');
});

it('should render the skeleton before the image has loaded', () => {
  const { container } = render(
    <MemoryRouter>
      <Image src="https://example.com/photo.jpg" alt="תמונה לדוגמה" />
    </MemoryRouter>
  );

  const skeleton = container.querySelector(`.${styles.skeleton}`);
  expect(skeleton).toBeTruthy();
});

it('should hide the skeleton and call onLoad once the image loads', () => {
  const onLoad = () => {};
  let called = false;
  const handleLoad = () => {
    called = true;
    onLoad();
  };

  const { container } = render(
    <MemoryRouter>
      <Image src="https://example.com/photo.jpg" alt="תמונה לדוגמה" onLoad={() => handleLoad()} />
    </MemoryRouter>
  );

  const img = container.querySelector('img') as HTMLImageElement;
  fireEvent.load(img);

  const skeleton = container.querySelector(`.${styles.skeleton}`);
  expect(skeleton).toBeFalsy();
  expect(called).toBe(true);
});

it('should render the error state and call onError when the image fails to load', () => {
  let called = false;
  const handleError = () => {
    called = true;
  };

  const { container } = render(
    <MemoryRouter>
      <Image src="https://example.com/broken.jpg" alt="תמונה שבורה" onError={() => handleError()} />
    </MemoryRouter>
  );

  const img = container.querySelector('img') as HTMLImageElement;
  fireEvent.error(img);

  const errorState = container.querySelector(`.${styles.errorState}`);
  expect(errorState).toBeTruthy();
  expect(called).toBe(true);
});

it('should apply the rounded pill class when rounded is set to pill', () => {
  const { container } = render(
    <MemoryRouter>
      <Image src="https://example.com/photo.jpg" alt="תמונה עגולה" rounded="pill" />
    </MemoryRouter>
  );

  const root = container.querySelector(`.${styles.roundedPill}`);
  expect(root).toBeTruthy();
});
