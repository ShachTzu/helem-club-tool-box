import React, { useState } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { ShareButtons } from './share-buttons.js';
import type { ShareNetwork } from './share-network-type.js';

export const BasicShareButtons = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 24, background: 'var(--colors-surface-background)' }}>
        <ShareButtons
          url="https://helam.club/blog/hachlama-mehatgobut"
          title="שביל ההחלמה מהתגובתיות — כתבה מהבלוג של הלם קלאב"
        />
      </div>
    </MemoryRouter>
  );
};

export const ShareButtonsOnCard = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 24, background: 'var(--colors-surface-background)' }}>
        <div
          style={{
            background: 'var(--colors-surface-primary)',
            border: '1px solid var(--colors-border)',
            borderRadius: 'var(--borders-radius-large)',
            boxShadow: 'var(--effects-shadows-card)',
            padding: 22,
            maxWidth: 420,
          }}
        >
          <h3
            style={{
              margin: '0 0 8px',
              fontSize: 'var(--typography-sizes-heading-h4)',
              color: 'var(--colors-primary-default)',
            }}
          >
            אפליקציית תרגול נשימות להרגעה מהירה
          </h3>
          <p
            style={{
              margin: '0 0 16px',
              fontSize: 'var(--typography-sizes-body-default)',
              color: 'var(--colors-text-secondary)',
            }}
          >
            כלי פשוט ויעיל שממליצה עליו הקהילה, מתאים גם לרגעי חרדה בזמן אמת.
          </p>
          <ShareButtons
            url="https://helam.club/toolbox/breathe-app"
            title="אפליקציית תרגול נשימות להרגעה מהירה — מומלץ ע׳י הקהילה"
          />
        </div>
      </div>
    </MemoryRouter>
  );
};

export const ShareButtonsWithCallback = () => {
  const [lastShared, setLastShared] = useState<ShareNetwork | null>(null);

  return (
    <MemoryRouter>
      <div style={{ padding: 24, background: 'var(--colors-surface-background)' }}>
        <ShareButtons
          url="https://helam.club/events/mifgash-tmicha"
          title="מפגש תמיכה חודשי — הלם קלאב"
          label="שתפו את המפגש:"
          onShare={(network) => setLastShared(network)}
        />
        {lastShared && (
          <p
            style={{
              marginTop: 12,
              fontSize: 'var(--typography-sizes-body-small)',
              color: 'var(--colors-text-secondary)',
            }}
          >
            שותף לאחרונה דרך: {lastShared}
          </p>
        )}
      </div>
    </MemoryRouter>
  );
};
