import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import type { DraftStatus } from '@helemclub/editorial.entities.draft';
import { DraftStatusBadge } from './draft-status-badge.js';

const allStatuses: DraftStatus[] = [
  'draft',
  'in_review',
  'changes_requested',
  'approved',
  'published',
  'archived',
];

export const AllDraftStatuses = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        {allStatuses.map((status) => (
          <DraftStatusBadge key={status} status={status} />
        ))}
      </div>
    </MockProvider>
  );
};

export const WithAndWithoutIcon = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {allStatuses.map((status) => (
            <DraftStatusBadge key={status} status={status} showIcon />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          {allStatuses.map((status) => (
            <DraftStatusBadge key={status} status={status} showIcon={false} />
          ))}
        </div>
      </div>
    </MockProvider>
  );
};

export const DraftStatusBadgeSizes = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <DraftStatusBadge status="in_review" size="small" />
        <DraftStatusBadge status="in_review" size="medium" />
        <DraftStatusBadge status="in_review" size="large" />
      </div>
    </MockProvider>
  );
};
