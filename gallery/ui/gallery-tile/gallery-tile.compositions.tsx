import React, { useState } from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockGalleryItem } from '@helemclub/gallery.entities.gallery-item';
import { GalleryTile } from './gallery-tile.js';

const imageItem = mockGalleryItem({
  slug: `quiet-after-the-storm`,
  title: `שקט אחרי הסערה`,
  artistName: `נועה ל.`,
  mediaType: `image`,
}).toObject();

const videoItem = mockGalleryItem({
  slug: `breathe-and-begin`,
  title: `נשימה והתחלה`,
  artistName: `דנה כ.`,
  mediaType: `video`,
  mediaUrl:
    'https://storage.googleapis.com/bit-generated-images/images/image_thumbnail_frame_for_a_short_mi_0_1785184760493.png',
  thumbnailUrl:
    'https://storage.googleapis.com/bit-generated-images/images/image_thumbnail_frame_for_a_short_mi_0_1785184760493.png',
}).toObject();

const noArtistItem = mockGalleryItem({
  slug: `light-at-the-edge`,
  title: `אור בקצה`,
  artistName: undefined,
  mediaType: `image`,
  mediaUrl:
    'https://storage.googleapis.com/bit-generated-images/images/image_serene_illustration_of_light_b_0_1785184760843.png',
  thumbnailUrl:
    'https://storage.googleapis.com/bit-generated-images/images/image_serene_illustration_of_light_b_0_1785184760843.png',
}).toObject();

export const BasicGalleryTile = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 260 }}>
        <GalleryTile item={imageItem} />
      </div>
    </MockProvider>
  );
};

export const VideoGalleryTile = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 260 }}>
        <GalleryTile item={videoItem} />
      </div>
    </MockProvider>
  );
};

export const MasonryGalleryTiles = () => {
  const [openedSlug, setOpenedSlug] = useState<string | null>(null);
  const items = [imageItem, videoItem, noArtistItem];

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <div style={{ columnWidth: 220, columnGap: 16 }}>
          {items.map((item) => (
            <div key={item.slug} style={{ breakInside: 'avoid', marginBottom: 16 }}>
              <GalleryTile item={item} onOpen={(slug) => setOpenedSlug(slug)} />
            </div>
          ))}
        </div>
        {openedSlug && <p style={{ marginTop: 16 }}>נפתח: {openedSlug}</p>}
      </div>
    </MockProvider>
  );
};
