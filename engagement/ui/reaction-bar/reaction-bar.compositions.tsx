import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ReactionBar } from './reaction-bar.js';

const likedSummary = {
  counts: [
    { type: `like`, count: 24 },
    { type: `heart`, count: 6 },
    { type: `hug`, count: 3 },
  ],
  myReaction: `like`,
};

const unreactedSummary = {
  counts: [
    { type: `like`, count: 11 },
    { type: `heart`, count: 2 },
  ],
  myReaction: undefined,
};

const emptySummary = {
  counts: [],
  myReaction: undefined,
};

export const LikedReactionBar = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ReactionBar
          targetType="post"
          targetId="post-finding-calm-in-the-storm"
          mockData={likedSummary}
          mockDeviceId="device-1"
        />
      </div>
    </MockProvider>
  );
};

export const UnreactedReactionBar = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ReactionBar
          targetType="event"
          targetId="event-community-circle"
          mockData={unreactedSummary}
          mockDeviceId="device-2"
        />
      </div>
    </MockProvider>
  );
};

export const EmptyReactionBar = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ReactionBar
          targetType="gallery"
          targetId="gallery-item-1"
          mockData={emptySummary}
          mockDeviceId="device-3"
          showTotal={false}
        />
      </div>
    </MockProvider>
  );
};
