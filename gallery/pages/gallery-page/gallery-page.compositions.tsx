import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { mockGalleryItems } from '@helemclub/gallery.entities.gallery-item';
import { GalleryPage } from './gallery-page.js';

const items = mockGalleryItems().map((item) => item.toObject());

const extraItems = [
  ...items,
  {
    id: `4`,
    slug: `together-again`,
    title: `יחד שוב`,
    description: `יצירה על חיבור מחדש עם משפחה אחרי תקופה קשה.`,
    mediaType: `image` as const,
    mediaUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_serene_illustration_of_light_b_0_1785184760843.png',
    thumbnailUrl:
      'https://storage.googleapis.com/bit-generated-images/images/image_serene_illustration_of_light_b_0_1785184760843.png',
    artistName: `שירה ב.`,
    domains: [`משפחה, זוגיות ויחסים`],
    createdAt: `2026-04-10T09:00:00.000Z`,
  },
];

export const BasicGalleryPage = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <GalleryPage mockItems={items} />
      </HelamTheme>
    </MemoryRouter>
  );
};

export const GalleryPageWithMoreItems = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <GalleryPage mockItems={extraItems} />
      </HelamTheme>
    </MemoryRouter>
  );
};

export const EmptyGalleryPage = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <GalleryPage
          mockItems={[]}
          title="עדיין אין יצירות"
          subtitle="ברגע שיצירות חדשות יתווספו לגלריה, הן יופיעו כאן."
        />
      </HelamTheme>
    </MemoryRouter>
  );
};
