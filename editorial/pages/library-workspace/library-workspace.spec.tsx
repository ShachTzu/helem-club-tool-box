import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { LibraryWorkspace } from './library-workspace.js';
import {
  mockWorkspaceDrafts,
  mockWorkspaceWriter,
  mockWorkspaceModerator,
} from './library-workspace.mock.js';
import styles from './library-workspace.module.scss';

it('should render only the drafts authored by the signed-in writer', () => {
  const { container } = render(
    <MockProvider>
      <LibraryWorkspace mockUser={mockWorkspaceWriter} mockDrafts={mockWorkspaceDrafts} />
    </MockProvider>
  );

  const grid = container.querySelector(`.${styles.grid}`);
  expect(grid?.children.length).toBe(5);
});

it('should show an empty state when the writer has no drafts', () => {
  const { container } = render(
    <MockProvider>
      <LibraryWorkspace mockUser={mockWorkspaceWriter} mockDrafts={[]} />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.grid}`)).toBeFalsy();
  expect(container.querySelector(`.${styles.stateBlock}`)).toBeTruthy();
});

it('should offer moderators a toggle for viewing every draft', () => {
  const { container } = render(
    <MockProvider>
      <LibraryWorkspace mockUser={mockWorkspaceModerator} mockDrafts={mockWorkspaceDrafts} />
    </MockProvider>
  );

  const toggle = container.querySelector(`.${styles.showAllToggle} input`) as HTMLInputElement;
  expect(toggle).toBeTruthy();

  fireEvent.click(toggle);

  const grid = container.querySelector(`.${styles.grid}`);
  expect(grid?.children.length).toBe(mockWorkspaceDrafts.length);
});

it('should filter drafts by the free text search', () => {
  const { container } = render(
    <MockProvider>
      <LibraryWorkspace mockUser={mockWorkspaceWriter} mockDrafts={mockWorkspaceDrafts} />
    </MockProvider>
  );

  const input = container.querySelector(`.${styles.searchInput} input`) as HTMLInputElement;
  expect(input).toBeTruthy();

  fireEvent.change(input, { target: { value: 'לילות' } });

  const grid = container.querySelector(`.${styles.grid}`);
  expect(grid?.children.length).toBe(1);
});
