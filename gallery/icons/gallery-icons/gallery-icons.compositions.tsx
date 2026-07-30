import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ImageIcon } from './image-icon.js';
import { VideoIcon } from './video-icon.js';
import { ArtIcon } from './art-icon.js';

export const GalleryIconsMediaTypes = () => {
  return (
    <MockProvider>
      <div style={{ display: 'flex', gap: 24, alignItems: 'center', padding: 24 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <ImageIcon size="large" color="primary" />
          <span>תמונה</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <VideoIcon size="large" color="primary" />
          <span>וידאו</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
          <ArtIcon size="large" color="primary" />
          <span>אמנות</span>
        </div>
      </div>
    </MockProvider>
  );
};

export const GalleryIconsColors = () => {
  return (
    <MockProvider>
      <div
        style={{
          display: 'flex',
          gap: 20,
          alignItems: 'center',
          padding: 24,
          background: 'var(--colors-surface-background)',
        }}
      >
        <ImageIcon color="primary" />
        <ImageIcon color="secondary" />
        <ImageIcon color="accent" />
        <VideoIcon color="muted" />
        <div style={{ background: 'var(--colors-primary-default)', padding: 8, borderRadius: 'var(--borders-radius-medium)' }}>
          <ArtIcon color="inverse" />
        </div>
      </div>
    </MockProvider>
  );
};

export const GalleryIconsInFilterChips = () => {
  const chips = [
    { label: `תמונות`, icon: <ImageIcon size="small" color="primary" /> },
    { label: `וידאו`, icon: <VideoIcon size="small" color="primary" /> },
    { label: `אמנות`, icon: <ArtIcon size="small" color="primary" /> },
  ];

  return (
    <MockProvider>
      <div style={{ display: 'flex', gap: 12, padding: 24 }}>
        {chips.map((chip) => (
          <div
            key={chip.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              padding: '6px 14px',
              borderRadius: 'var(--borders-radius-pill)',
              background: 'var(--colors-surface-secondary)',
              border: '1px solid var(--colors-border)',
              color: 'var(--colors-text-primary)',
            }}
          >
            {chip.icon}
            <span>{chip.label}</span>
          </div>
        ))}
      </div>
    </MockProvider>
  );
};
