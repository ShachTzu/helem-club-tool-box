import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { MockedProvider } from '@apollo/client/testing/react/index.js';
import { mockGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { GalleryPage } from './gallery-page.js';
import styles from './gallery-page.module.scss';

const items = [
  mockGalleryItem({ slug: `first-item`, title: `יצירה ראשונה`, mediaType: `image` }).toObject(),
  mockGalleryItem({ slug: `second-item`, title: `יצירה שנייה`, mediaType: `video` }).toObject(),
];

describe('GalleryPage', () => {
  it('should render the page title and subtitle', () => {
    const { container } = render(
      <MockedProvider>
        <MemoryRouter>
          <GalleryPage mockItems={items} title="כותרת בדיקה" subtitle="תת כותרת בדיקה" />
        </MemoryRouter>
      </MockedProvider>
    );

    const title = container.querySelector(`.${styles.title}`);
    const subtitle = container.querySelector(`.${styles.subtitle}`);
    expect(title?.textContent).toBe(`כותרת בדיקה`);
    expect(subtitle?.textContent).toBe(`תת כותרת בדיקה`);
  });

  it('should render the item count in the section title', () => {
    const { container } = render(
      <MockedProvider>
        <MemoryRouter>
          <GalleryPage mockItems={items} />
        </MemoryRouter>
      </MockedProvider>
    );

    const sectionTitle = container.querySelector(`.${styles.sectionTitle}`);
    expect(sectionTitle?.textContent).toBe(`2 יצירות`);
  });

  it('should render a media type filter button for each option', () => {
    const { container } = render(
      <MockedProvider>
        <MemoryRouter>
          <GalleryPage mockItems={items} />
        </MemoryRouter>
      </MockedProvider>
    );

    const buttons = container.querySelectorAll(`.${styles.mediaTypeButton}`);
    expect(buttons.length).toBe(3);
  });

  it('should mark the "all" media type button as active by default', () => {
    const { container } = render(
      <MockedProvider>
        <MemoryRouter>
          <GalleryPage mockItems={items} />
        </MemoryRouter>
      </MockedProvider>
    );

    const buttons = container.querySelectorAll(`.${styles.mediaTypeButton}`);
    expect(buttons[0].className).toContain(styles.mediaTypeButtonActive);
  });

  it('should switch the active media type button when clicked', () => {
    const { container } = render(
      <MockedProvider>
        <MemoryRouter>
          <GalleryPage mockItems={items} />
        </MemoryRouter>
      </MockedProvider>
    );

    const buttons = container.querySelectorAll(`.${styles.mediaTypeButton}`);
    fireEvent.click(buttons[1] as HTMLButtonElement);

    expect(buttons[1].className).toContain(styles.mediaTypeButtonActive);
    expect(buttons[0].className).not.toContain(styles.mediaTypeButtonActive);
  });
});
