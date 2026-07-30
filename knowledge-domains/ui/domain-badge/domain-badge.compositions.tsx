import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { DomainBadge } from './domain-badge.js';

const domains = [
  { id: 'anxiety', slug: 'anxiety', name: `חרדה` },
  { id: 'sleep', slug: 'sleep', name: `שינה` },
  { id: 'emotional-regulation', slug: 'emotional-regulation', name: `ויסות רגשי` },
];

export const BasicDomainBadge = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <DomainBadge domains={domains} />
      </div>
    </MockProvider>
  );
};

export const SingleDomainBadge = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <DomainBadge domains={[{ id: 'sleep', slug: 'sleep', name: `שינה` }]} />
      </div>
    </MockProvider>
  );
};

export const DomainBadgeOnArticleCard = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 360, border: '1px solid #ddd', borderRadius: 12 }}>
        <h3 style={{ marginTop: 0 }}>נשימות 4-7-8 להרגעה מהירה</h3>
        <p>תרגיל נשימה קצר שיעזור לכם לווסת התקף חרדה תוך דקות.</p>
        <DomainBadge
          domains={[
            { id: 'anxiety', slug: 'anxiety', name: `חרדה` },
            { id: 'mindfulness-breathing', slug: 'mindfulness-breathing', name: `מיינדפולנס ונשימות` },
          ]}
        />
      </div>
    </MockProvider>
  );
};
