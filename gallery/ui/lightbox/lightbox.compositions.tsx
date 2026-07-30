import React, { useState } from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockGalleryItems } from '@helemclub/gallery.entities.gallery-item';
import { Lightbox } from './lightbox.js';

const items = mockGalleryItems().map((item) => item.toObject());

export const BasicLightbox = () => {
  const [open, setOpen] = useState(true);

  return (
    <MockProvider>
      <div style={{ padding: 32 }}>
        <button onClick={() => setOpen(true)}>פתיחת יצירה</button>
        <Lightbox open={open} onClose={() => setOpen(false)} item={items[0]} />
      </div>
    </MockProvider>
  );
};

export const LightboxWithNavigation = () => {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(true);

  return (
    <MockProvider>
      <div style={{ padding: 32 }}>
        <button onClick={() => setOpen(true)}>פתיחת גלריה</button>
        <Lightbox
          open={open}
          onClose={() => setOpen(false)}
          item={items[index]}
          hasPrev={index > 0}
          hasNext={index < items.length - 1}
          onPrev={() => setIndex((current) => Math.max(0, current - 1))}
          onNext={() => setIndex((current) => Math.min(items.length - 1, current + 1))}
          currentIndex={index + 1}
          totalCount={items.length}
        />
      </div>
    </MockProvider>
  );
};

export const VideoLightbox = () => {
  const [open, setOpen] = useState(true);
  const videoItem = items.find((item) => item.mediaType === `video`) || items[0];

  return (
    <MockProvider>
      <div style={{ padding: 32 }}>
        <button onClick={() => setOpen(true)}>צפייה בסרטון</button>
        <Lightbox open={open} onClose={() => setOpen(false)} item={videoItem} />
      </div>
    </MockProvider>
  );
};
