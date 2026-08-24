import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { DraftEditor } from './draft-editor.js';
import {
  mockEditorWriter,
  mockNewDraft,
  mockEditingDraft,
  mockChangesRequestedDraft,
  mockEditorRevisions,
  mockEditorApprovals,
} from './draft-editor.mock.js';

const FIELDS = [
  { name: 'excerpt', label: 'תקציר', multiline: true },
  { name: 'body', label: 'גוף המאמר', multiline: true },
];

/**
 * a brand new draft, before anything has been written.
 */
export const NewDraft = () => {
  return (
    <MockProvider>
      <DraftEditor
        draftId="draft-new"
        fields={FIELDS}
        mockUser={mockEditorWriter}
        mockDraft={mockNewDraft}
        mockRevisions={[]}
        mockApprovals={[]}
      />
    </MockProvider>
  );
};

/**
 * a draft in active editing, with its version history in the sidebar.
 */
export const DraftWithHistory = () => {
  return (
    <MockProvider>
      <DraftEditor
        draftId="draft-1"
        fields={FIELDS}
        mockUser={mockEditorWriter}
        mockDraft={mockEditingDraft}
        mockRevisions={mockEditorRevisions}
        mockApprovals={mockEditorApprovals}
      />
    </MockProvider>
  );
};

/**
 * a draft the moderator sent back, with the review note shown on top.
 */
export const DraftWithChangesRequested = () => {
  return (
    <MockProvider>
      <DraftEditor
        draftId="draft-3"
        fields={FIELDS}
        mockUser={mockEditorWriter}
        mockDraft={mockChangesRequestedDraft}
        mockRevisions={mockEditorRevisions}
        mockApprovals={mockEditorApprovals}
      />
    </MockProvider>
  );
};
