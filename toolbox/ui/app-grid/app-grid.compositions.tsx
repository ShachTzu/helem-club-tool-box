import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockApps } from '@helemclub/toolbox.entities.app';
import { AppGrid } from './app-grid.js';

export const BasicAppGrid = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <AppGrid />
      </div>
    </MockProvider>
  );
};

export const FilteredAppGrid = () => {
  const apps = mockApps()
    .map((app) => app.toObject())
    .filter((app) => app.isFeatured);

  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <h2 style={{ marginTop: 0 }}>כלים מומלצים ע&quot;י הקהילה</h2>
        <AppGrid apps={apps} />
      </div>
    </MockProvider>
  );
};

export const EmptyAppGrid = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <AppGrid
          apps={[]}
          emptyTitle="לא נמצאו כלים בתחום שבחרתם"
          emptyDescription="נסו לבחור תחום אחר או לאפס את הסינון כדי לראות את כל הכלים בארגז."
          emptyActionLabel="איפוס סינון"
          emptyActionHref="/toolbox"
        />
      </div>
    </MockProvider>
  );
};
