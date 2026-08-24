import React, { useState } from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockRevisions } from '@helemclub/editorial.entities.revision';
import { mockApprovalEntries } from '@helemclub/editorial.entities.approval-entry';
import { RevisionTimeline } from './revision-timeline.js';

const revisions = mockRevisions().map((revision) => revision.toObject());
const approvals = mockApprovalEntries().map((approval) => approval.toObject());

export const FullTimelineWithFiveEvents = () => {
  const [selectedVersions, setSelectedVersions] = useState<number[]>([]);

  const toggleVersion = (versionNumber: number) => {
    setSelectedVersions((current) =>
      current.includes(versionNumber)
        ? current.filter((version) => version !== versionNumber)
        : [...current, versionNumber].slice(-2)
    );
  };

  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 620 }}>
        <RevisionTimeline
          revisions={revisions.slice(0, 2)}
          approvals={approvals.slice(0, 3)}
          selectedVersions={selectedVersions}
          onSelectVersion={(versionNumber) => toggleVersion(versionNumber)}
          onRestore={(versionNumber) => window.alert(`שוחזרה גרסה ${versionNumber}`)}
        />
      </div>
    </MockProvider>
  );
};

export const ShortTimeline = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 620 }}>
        <RevisionTimeline
          revisions={revisions.slice(0, 1)}
          approvals={approvals.slice(0, 2)}
        />
      </div>
    </MockProvider>
  );
};

export const CompactSidebarMode = () => {
  return (
    <MockProvider>
      <div style={{ padding: 16, maxWidth: 280, background: 'var(--colors-surface-background)' }}>
        <RevisionTimeline revisions={revisions} approvals={approvals} compact />
      </div>
    </MockProvider>
  );
};
