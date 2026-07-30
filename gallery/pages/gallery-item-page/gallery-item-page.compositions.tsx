import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockGalleryItems } from '@helemclub/gallery.entities.gallery-item';
import { GalleryItemPage } from './gallery-item-page.js';

const items = mockGalleryItems().map((item) => item.toObject());

/** A single gallery item rendered in full. */
export const BasicGalleryItemPage = () => (
  <MockProvider>
    <GalleryItemPage slug="quiet-after-the-storm" mockItems={items} />
  </MockProvider>
);

/** Not-found state for a missing item. */
export const GalleryItemNotFound = () => (
  <MockProvider>
    <GalleryItemPage slug="does-not-exist" mockItems={items} />
  </MockProvider>
);
