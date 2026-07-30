import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { GalleryGrid } from './gallery-grid.js';
import styles from './gallery-grid.module.scss';

const items = [
  mockGalleryItem({ slug: `first-item`, title: `יצירה ראשונה` }).toObject(),
  mockGalleryItem({ slug: `second-item`, title: `יצירה שנייה` }).toObject(),
];

describe('GalleryGrid', () => {
  it('should render a tile wrapper for each item', () => {
    const { container } = render(
      <MemoryRouter>
        <GalleryGrid items={items} />
      </MemoryRouter>
    );

    const wrappers = container.querySelectorAll(`.${styles.tileWrapper}`);
    expect(wrappers.length).toBe(2);
  });

  it('should render the empty state when there are no items', () => {
    const { container } = render(
      <MemoryRouter>
        <GalleryGrid items={[]} />
      </MemoryRouter>
    );

    const emptyWrapper = container.querySelector(`.${styles.emptyWrapper}`);
    expect(emptyWrapper).toBeTruthy();
  });

  it('should call onOpenItem with the item slug when a tile is clicked', () => {
    const onOpenItem = vi.fn();
    const { container } = render(
      <MemoryRouter>
        <GalleryGrid items={items} onOpenItem={onOpenItem} />
      </MemoryRouter>
    );

    const buttons = container.querySelectorAll('button');
    fireEvent.click(buttons[0] as HTMLButtonElement);

    expect(onOpenItem).toHaveBeenCalledWith('first-item');
  });
});
