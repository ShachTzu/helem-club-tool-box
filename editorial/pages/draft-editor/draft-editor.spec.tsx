import React from 'react';
import { render } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { DraftEditor } from './draft-editor.js';
import {
  mockEditorWriter,
  mockEditingDraft,
  mockChangesRequestedDraft,
  mockEditorRevisions,
  mockEditorApprovals,
} from './draft-editor.mock.js';
import styles from './draft-editor.module.scss';

const FIELDS = [
  { name: 'excerpt', label: 'תקציר', multiline: true },
  { name: 'body', label: 'גוף המאמר', multiline: true },
];

it('should render the draft title in the editor', () => {
  const { container } = render(
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

  const titleInput = container.querySelector('input[type="text"]') as HTMLInputElement;
  expect(titleInput?.value).toBe(mockEditingDraft.title);
});

it('should surface the moderator note when changes were requested', () => {
  const { container } = render(
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

  expect(container.querySelector(`.${styles.reviewNote}`)).toBeTruthy();
});

it('should show a not-found state when the draft does not exist', () => {
  const { container } = render(
    <MockProvider>
      <DraftEditor draftId="missing" mockUser={mockEditorWriter} mockDraft={null} />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.stateBlock}`)).toBeTruthy();
  expect(container.querySelector(`.${styles.layout}`)).toBeFalsy();
});
