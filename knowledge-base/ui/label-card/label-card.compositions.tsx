import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockLabels } from '@helemclub/knowledge-base.entities.label';
import { LabelCard } from './label-card.js';

const labels = mockLabels();

export const BasicLabelCard = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 320 }}>
        <LabelCard label={labels[0].toObject()} />
      </div>
    </MockProvider>
  );
};

export const LabelCardsGrid = () => {
  return (
    <MockProvider>
      <div
        style={{
          padding: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
          gap: 18,
        }}
      >
        {labels.map((label) => (
          <LabelCard key={label.slug} label={label.toObject()} />
        ))}
      </div>
    </MockProvider>
  );
};

export const LabelCardWithoutDescription = () => {
  const label = labels[2].toObject();
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 320 }}>
        <LabelCard label={{ ...label, description: undefined }} />
      </div>
    </MockProvider>
  );
};
