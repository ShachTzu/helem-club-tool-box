import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockGalleryItems } from '@helemclub/gallery.entities.gallery-item';
import { Lightbox } from './lightbox.js';
import styles from './lightbox.module.scss';

const items = mockGalleryItems().map((item) => item.toObject());

it('should render the item title', () => {
  const { container } = render(
    <MemoryRouter>
      <Lightbox open onClose={() => {}} item={items[0]} />
    </MemoryRouter>
  );

  const rendered = container.querySelector(`.${styles.dialog}`);
  expect(rendered?.textContent).toContain(items[0].title);
});

it('should render the artist name and description', () => {
  const { container } = render(
    <MemoryRouter>
      <Lightbox open onClose={() => {}} item={items[0]} />
    </MemoryRouter>
  );

  const artist = container.querySelector(`.${styles.artist}`);
  const description = container.querySelector(`.${styles.description}`);

  expect(artist?.textContent).toEqual(items[0].artistName);
  expect(description?.textContent).toEqual(items[0].description);
});

it('should render domain badges', () => {
  const { container } = render(
    <MemoryRouter>
      <Lightbox open onClose={() => {}} item={items[0]} />
    </MemoryRouter>
  );

  const badges = container.querySelectorAll(`.${styles.domainBadge}`);
  expect(badges.length).toEqual(items[0].domains.length);
});

it('should not render navigation buttons when hasPrev and hasNext are false', () => {
  const { container } = render(
    <MemoryRouter>
      <Lightbox open onClose={() => {}} item={items[0]} hasPrev={false} hasNext={false} />
    </MemoryRouter>
  );

  const navButtons = container.querySelectorAll(`.${styles.navButton}`);
  expect(navButtons.length).toEqual(0);
});

it('should call onNext when the next button is clicked', () => {
  let clicked = false;
  const { container } = render(
    <MemoryRouter>
      <Lightbox
        open
        onClose={() => {}}
        item={items[0]}
        hasNext
        onNext={() => {
          clicked = true;
        }}
      />
    </MemoryRouter>
  );

  const nextButton = container.querySelector(`.${styles.navStart}`) as HTMLButtonElement;
  fireEvent.click(nextButton);

  expect(clicked).toEqual(true);
});

it('should call onPrev when the prev button is clicked', () => {
  let clicked = false;
  const { container } = render(
    <MemoryRouter>
      <Lightbox
        open
        onClose={() => {}}
        item={items[0]}
        hasPrev
        onPrev={() => {
          clicked = true;
        }}
      />
    </MemoryRouter>
  );

  const prevButton = container.querySelector(`.${styles.navEnd}`) as HTMLButtonElement;
  fireEvent.click(prevButton);

  expect(clicked).toEqual(true);
});

it('should render the counter when currentIndex and totalCount are provided', () => {
  const { container } = render(
    <MemoryRouter>
      <Lightbox open onClose={() => {}} item={items[0]} currentIndex={2} totalCount={5} />
    </MemoryRouter>
  );

  const counter = container.querySelector(`.${styles.counter}`);
  expect(counter?.textContent).toEqual('2 מתוך 5');
});

it('should not render the lightbox content when open is false', () => {
  const { container } = render(
    <MemoryRouter>
      <Lightbox open={false} onClose={() => {}} item={items[0]} />
    </MemoryRouter>
  );

  const dialog = container.querySelector(`.${styles.dialog}`);
  expect(dialog).toBeFalsy();
});
