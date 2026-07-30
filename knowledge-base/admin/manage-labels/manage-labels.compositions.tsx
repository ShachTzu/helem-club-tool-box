import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageLabels } from './manage-labels.js';
import { mockManageLabelsLabels } from './manage-labels.mock.js';

export const BasicManageLabels = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageLabels mockLabels={mockManageLabelsLabels} />
      </div>
    </MockProvider>
  );
};

export const ManageLabelsEmptyState = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageLabels mockLabels={[]} />
      </div>
    </MockProvider>
  );
};

export const ManageLabelsSingleProject = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageLabels mockLabels={[mockManageLabelsLabels[0]]} />
      </div>
    </MockProvider>
  );
};
