import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { LibraryWorkspace } from './library-workspace.js';
import {
  mockWorkspaceDrafts,
  mockWorkspaceWriter,
  mockWorkspaceModerator,
} from './library-workspace.mock.js';

/**
 * a writer with drafts across every editorial status.
 */
export const WriterWithDrafts = () => {
  return (
    <MockProvider>
      <LibraryWorkspace mockUser={mockWorkspaceWriter} mockDrafts={mockWorkspaceDrafts} />
    </MockProvider>
  );
};

/**
 * a moderator, who can toggle to see every draft in the system.
 */
export const ModeratorView = () => {
  return (
    <MockProvider>
      <LibraryWorkspace mockUser={mockWorkspaceModerator} mockDrafts={mockWorkspaceDrafts} />
    </MockProvider>
  );
};

/**
 * a writer who has not started writing yet.
 */
export const EmptyWorkspace = () => {
  return (
    <MockProvider>
      <LibraryWorkspace mockUser={mockWorkspaceWriter} mockDrafts={[]} />
    </MockProvider>
  );
};

/**
 * the workspace while drafts are still loading.
 */
export const LoadingWorkspace = () => {
  return (
    <MockProvider>
      <LibraryWorkspace mockUser={mockWorkspaceWriter} mockDrafts={[]} mockLoading />
    </MockProvider>
  );
};
