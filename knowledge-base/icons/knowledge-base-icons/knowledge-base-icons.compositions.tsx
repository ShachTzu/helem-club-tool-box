import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { VideoIcon } from './video-icon.js';
import { AudioIcon } from './audio-icon.js';
import { PlayIcon } from './play-icon.js';
import { LabelIcon } from './label-icon.js';

export const IconSet = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: `flex`,
          gap: 24,
          alignItems: `center`,
          padding: 24,
          background: `var(--colors-surface-background)`,
        }}
      >
        <VideoIcon size="large" color="primary" />
        <AudioIcon size="large" color="secondary" />
        <PlayIcon size="large" color="accent" />
        <LabelIcon size="large" color="primary" />
      </div>
    </MemoryRouter>
  );
};

export const MediaTypeBadges = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: `flex`,
          gap: 16,
          padding: 24,
          background: `var(--colors-surface-background)`,
        }}
      >
        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            gap: 6,
            background: `var(--colors-status-info-subtle)`,
            color: `var(--colors-status-info-default)`,
            padding: `6px 12px`,
            borderRadius: `var(--borders-radius-pill)`,
            fontWeight: `var(--typography-font-weight-bold)`,
            fontSize: `var(--typography-sizes-caption-default)`,
          }}
        >
          <VideoIcon size="small" color="current" />
          וידאו
        </div>
        <div
          style={{
            display: `flex`,
            alignItems: `center`,
            gap: 6,
            background: `var(--colors-accent-default)`,
            color: `var(--colors-text-inverse)`,
            padding: `6px 12px`,
            borderRadius: `var(--borders-radius-pill)`,
            fontWeight: `var(--typography-font-weight-bold)`,
            fontSize: `var(--typography-sizes-caption-default)`,
          }}
        >
          <AudioIcon size="small" color="inverse" />
          אודיו
        </div>
      </div>
    </MemoryRouter>
  );
};

export const ThumbnailPlayOverlay = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          position: `relative`,
          width: 280,
          aspectRatio: `16/9`,
          borderRadius: `var(--borders-radius-medium)`,
          overflow: `hidden`,
          background: `var(--effects-gradients-primary)`,
        }}
      >
        <div
          style={{
            position: `absolute`,
            inset: 0,
            display: `grid`,
            placeItems: `center`,
          }}
        >
          <PlayIcon size={48} color="inverse" />
        </div>
        <div
          style={{
            position: `absolute`,
            top: 10,
            insetInlineStart: 10,
            display: `flex`,
            alignItems: `center`,
            gap: 6,
          }}
        >
          <LabelIcon size="small" color="white" />
        </div>
      </div>
    </MemoryRouter>
  );
};
