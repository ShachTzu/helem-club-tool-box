import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { GalleryTile } from './gallery-tile.js';
import styles from './gallery-tile.module.scss';

describe(`GalleryTile`, () => {
  it(`renders the item title and artist`, () => {
    const item = mockGalleryItem({
      title: `שקט אחרי הסערה`,
      artistName: `נועה ל.`,
      mediaType: `image`,
    }).toObject();

    const { container } = render(
      <MemoryRouter>
        <GalleryTile item={item} />
      </MemoryRouter>
    );

    const title = container.querySelector(`.${styles.title}`);
    const artist = container.querySelector(`.${styles.artist}`);

    expect(title?.textContent).toBe(`שקט אחרי הסערה`);
    expect(artist?.textContent).toBe(`נועה ל.`);
  });

  it(`does not render the artist line when artistName is missing`, () => {
    const item = mockGalleryItem({
      title: `אור בקצה`,
      artistName: undefined,
      mediaType: `image`,
    }).toObject();

    const { container } = render(
      <MemoryRouter>
        <GalleryTile item={item} />
      </MemoryRouter>
    );

    const artist = container.querySelector(`.${styles.artist}`);
    expect(artist).toBeNull();
  });

  it(`renders a play badge for video items`, () => {
    const item = mockGalleryItem({
      title: `נשימה והתחלה`,
      mediaType: `video`,
    }).toObject();

    const { container } = render(
      <MemoryRouter>
        <GalleryTile item={item} />
      </MemoryRouter>
    );

    const playBadge = container.querySelector(`.${styles.playBadge}`);
    expect(playBadge).toBeTruthy();
  });

  it(`does not render a play badge for image items`, () => {
    const item = mockGalleryItem({
      title: `שקט אחרי הסערה`,
      mediaType: `image`,
    }).toObject();

    const { container } = render(
      <MemoryRouter>
        <GalleryTile item={item} />
      </MemoryRouter>
    );

    const playBadge = container.querySelector(`.${styles.playBadge}`);
    expect(playBadge).toBeNull();
  });

  it(`calls onOpen with the item slug when clicked`, () => {
    const item = mockGalleryItem({
      slug: `quiet-after-the-storm`,
      mediaType: `image`,
    }).toObject();
    let openedSlug = ``;

    const { container } = render(
      <MemoryRouter>
        <GalleryTile item={item} onOpen={(slug) => { openedSlug = slug; }} />
      </MemoryRouter>
    );

    const button = container.querySelector(`.${styles.tile}`) as HTMLButtonElement;
    fireEvent.click(button);

    expect(openedSlug).toBe(`quiet-after-the-storm`);
  });
});
