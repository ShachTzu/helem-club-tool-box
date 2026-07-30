import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { SaveButton } from './save-button.js';

export const BasicSaveButton = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <SaveButton
          targetType="app"
          targetId="calm-space"
          title="Calm Space"
          url="/app/calm-space"
          mockDeviceId="composition-basic"
        />
      </div>
    </MockProvider>
  );
};

export const AlreadySavedButton = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 14 }}>
        <SaveButton
          targetType="article"
          targetId="article-42"
          title="להתמודד עם טריגרים ביום-יום"
          url="/blog/article-42"
          mockDeviceId="composition-saved"
        />
      </div>
    </MockProvider>
  );
};

export const IconOnlySaveButtons = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 14, alignItems: 'center' }}>
        <SaveButton
          targetType="event"
          targetId="event-7"
          title="מפגש קהילתי חודשי"
          url="/events/event-7"
          showLabel={false}
          size="sm"
          mockDeviceId="composition-icon-1"
        />
        <SaveButton
          targetType="gallery"
          targetId="gallery-3"
          title="יצירת PTSDART"
          url="/gallery/gallery-3"
          showLabel={false}
          size="lg"
          mockDeviceId="composition-icon-2"
        />
      </div>
    </MockProvider>
  );
};
