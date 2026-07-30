import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { RatingSummary } from './rating-summary.js';

export const BasicRatingSummary = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 480 }}>
        <RatingSummary
          averageRating={4.7}
          ratingCount={96}
          ratingHistogram={[2, 3, 6, 20, 65]}
        />
      </div>
    </MockProvider>
  );
};

export const LowRatingSummary = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 480 }}>
        <RatingSummary
          averageRating={2.3}
          ratingCount={41}
          ratingHistogram={[14, 12, 8, 5, 2]}
        />
      </div>
    </MockProvider>
  );
};

export const RatingSummaryInCard = () => {
  return (
    <MockProvider>
      <div
        style={{
          padding: 24,
          background: 'var(--colors-surface-primary)',
          borderRadius: 'var(--borders-radius-large)',
          boxShadow: 'var(--effects-shadows-card)',
          maxWidth: 520,
        }}
      >
        <h3
          style={{
            margin: '0 0 14px',
            fontSize: 'var(--typography-sizes-heading-h4)',
            fontWeight: 'var(--typography-font-weight-extra-bold)',
            color: 'var(--colors-primary-default)',
          }}
        >
          דירוגים וביקורות
        </h3>
        <RatingSummary
          averageRating={4.9}
          ratingCount={143}
          ratingHistogram={[1, 1, 4, 15, 122]}
        />
      </div>
    </MockProvider>
  );
};
