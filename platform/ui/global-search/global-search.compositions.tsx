import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockSearchResults, mockSearchResult } from '@helemclub/platform.entities.search-result';
import { GlobalSearch } from './global-search.js';

export const BasicGlobalSearch = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32, background: `#0B1A30` }}>
        <GlobalSearch mockResults={mockSearchResults()} />
      </div>
    </MockProvider>
  );
};

export const GlobalSearchWithOpenResults = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32, background: `#F6F8FA`, minHeight: 420 }}>
        <GlobalSearch
          mockResults={[
            mockSearchResult({ title: `נשימה 4-7-8`, type: `app` }),
            mockSearchResult({
              title: `איך להתמודד עם מחשבות טורדניות`,
              type: `blog`,
              excerpt: `מאמר על טכניקות מעשיות להתמודדות עם מחשבות חוזרות ובלתי רצויות.`,
              imageUrl: undefined,
            }),
            mockSearchResult({
              title: `מפגש קבוצתי - חוכמת הקהילה`,
              type: `event`,
              excerpt: `מפגש חודשי לשיתוף חוויות בין חברי הקהילה.`,
            }),
          ]}
        />
      </div>
    </MockProvider>
  );
};

export const EmptyGlobalSearch = () => {
  return (
    <MockProvider>
      <div style={{ padding: 32, background: `#F6F8FA` }}>
        <GlobalSearch mockResults={[]} />
      </div>
    </MockProvider>
  );
};
