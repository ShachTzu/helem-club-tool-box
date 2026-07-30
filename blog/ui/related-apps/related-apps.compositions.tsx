import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { RelatedApps } from './related-apps.js';

export const BasicRelatedApps = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 900 }}>
        <RelatedApps
          domains={[`מיינדפולנס ונשימות`, `חרדה`]}
          mockApps={mockAppsData()}
        />
      </div>
    </MockProvider>
  );
};

export const RelatedAppsForTriggersPost = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 900 }}>
        <RelatedApps
          title="אפליקציות שיכולות לעזור"
          domains={[`טריגרים`, `ויסות רגשי`]}
          maxApps={2}
          mockApps={mockAppsData()}
        />
      </div>
    </MockProvider>
  );
};

export const RelatedAppsEmptyState = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 900 }}>
        <p style={{ color: 'var(--colors-text-muted)', marginBottom: 12 }}>
          כאשר אין אפליקציות רלוונטיות, הרכיב אינו מציג דבר:
        </p>
        <RelatedApps domains={[`תחום שלא קיים`]} mockApps={mockAppsData()} />
      </div>
    </MockProvider>
  );
};
