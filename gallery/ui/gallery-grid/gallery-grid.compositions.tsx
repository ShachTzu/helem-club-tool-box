import React, { useState } from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockGalleryItem, mockGalleryItems } from '@helemclub/gallery.entities.gallery-item';
import { GalleryGrid } from './gallery-grid.js';

const items = mockGalleryItems().map((item) => item.toObject());

const singleDomainItems = [
  mockGalleryItem({
    slug: `quiet-morning`,
    title: `בוקר שקט`,
    artistName: `רותם ש.`,
    mediaType: `image`,
    domains: [`ויסות רגשי`],
  }).toObject(),
  mockGalleryItem({
    slug: `open-window`,
    title: `חלון פתוח`,
    artistName: `יעל מ.`,
    mediaType: `image`,
    mediaUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_serene_illustration_of_light_b_0_1785184760843.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_serene_illustration_of_light_b_0_1785184760843.png',
    domains: [`דיכאון ותחושת תקיעות`],
  }).toObject(),
];

export const BasicGalleryGrid = () => {
  const [openedSlug, setOpenedSlug] = useState<string | null>(null);

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <GalleryGrid items={items} onOpenItem={(slug) => setOpenedSlug(slug)} />
        {openedSlug && <p style={{ marginTop: 16 }}>נפתחה יצירה: {openedSlug}</p>}
      </div>
    </MockProvider>
  );
};

export const SmallGalleryGrid = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <GalleryGrid items={singleDomainItems} />
      </div>
    </MockProvider>
  );
};

export const EmptyGalleryGrid = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <GalleryGrid
          items={[]}
          emptyTitle="לא נמצאו יצירות"
          emptyDescription="נסו לשנות את הסינון או להוסיף יצירה חדשה לגלריה."
        />
      </div>
    </MockProvider>
  );
};
