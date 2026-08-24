import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { DraftIcon } from './draft-icon.js';
import { ReviewIcon } from './review-icon.js';
import { ApproveIcon } from './approve-icon.js';
import { RejectIcon } from './reject-icon.js';
import { ChangesRequestedIcon } from './changes-requested-icon.js';
import { HistoryIcon } from './history-icon.js';
import { DiffIcon } from './diff-icon.js';
import { PublishIcon } from './publish-icon.js';
import { RestoreIcon } from './restore-icon.js';
import { LibraryIcon } from './library-icon.js';

export const EditorialWorkflowIcons = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: 24,
          background: 'var(--colors-surface-background)',
        }}
      >
        <IconTile label="טיוטה">
          <DraftIcon color="primary" size="large" title="טיוטה" />
        </IconTile>
        <IconTile label="בבדיקה">
          <ReviewIcon color="primary" size="large" title="בבדיקה" />
        </IconTile>
        <IconTile label="אושר">
          <ApproveIcon color="primary" size="large" title="אושר" />
        </IconTile>
        <IconTile label="נדחה">
          <RejectIcon color="primary" size="large" title="נדחה" />
        </IconTile>
        <IconTile label="נדרשים שינויים">
          <ChangesRequestedIcon color="primary" size="large" title="נדרשים שינויים" />
        </IconTile>
      </div>
    </MemoryRouter>
  );
};

export const RevisionAndPublishingIcons = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          gap: 24,
          alignItems: 'center',
          flexWrap: 'wrap',
          padding: 24,
          background: 'var(--colors-surface-background)',
        }}
      >
        <IconTile label="היסטוריה">
          <HistoryIcon color="secondary" size="large" title="היסטוריה" />
        </IconTile>
        <IconTile label="השוואת גרסאות">
          <DiffIcon color="secondary" size="large" title="השוואת גרסאות" />
        </IconTile>
        <IconTile label="פרסום">
          <PublishIcon color="secondary" size="large" title="פרסום" />
        </IconTile>
        <IconTile label="שחזור">
          <RestoreIcon color="secondary" size="large" title="שחזור" />
        </IconTile>
        <IconTile label="ספריית הידע">
          <LibraryIcon color="secondary" size="large" title="ספריית הידע" />
        </IconTile>
      </div>
    </MemoryRouter>
  );
};

export const IconColorsAndSizes = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: 20, alignItems: 'center', padding: 24 }}>
        <ApproveIcon color="primary" size="small" title="אושר - קטן" />
        <ApproveIcon color="accent" size="medium" title="אושר - בינוני" />
        <ApproveIcon color="secondary" size="large" title="אושר - גדול" />
        <ApproveIcon color="muted" size={40} title="אושר - מותאם אישית" />
      </div>
    </MemoryRouter>
  );
};

function IconTile({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 8,
        background: 'var(--colors-surface-primary)',
        border: '1px solid var(--colors-border)',
        borderRadius: 'var(--borders-radius-medium)',
        padding: 16,
        minWidth: 96,
      }}
    >
      {children}
      <span style={{ fontSize: 12, color: 'var(--colors-text-secondary)' }}>{label}</span>
    </div>
  );
}
