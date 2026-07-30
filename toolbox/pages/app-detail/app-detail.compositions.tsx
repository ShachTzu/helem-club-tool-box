import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { AppDetail } from './app-detail.js';
import { mockAppDetailData, mockGroundMeAppData, mockAppDetailReviewsData } from './app-detail.mock.js';

export const BasicAppDetail = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <AppDetail app={mockAppDetailData()} reviews={[]} />
      </div>
    </MockProvider>
  );
};

export const FeaturedAppWithReviews = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <AppDetail app={mockGroundMeAppData()} reviews={mockAppDetailReviewsData()} />
      </div>
    </MockProvider>
  );
};

export const AppWithoutOriginatorOrReviews = () => {
  const app = mockAppDetailData();
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <AppDetail
          app={{ ...app, originatorName: undefined, ratingCount: 0, avgRating: 0, ratingHistogram: [0, 0, 0, 0, 0] }}
          reviews={[]}
        />
      </div>
    </MockProvider>
  );
};
