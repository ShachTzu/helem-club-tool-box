import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { PostEditor } from './post-editor.js';
import { POST_EDITOR_MOCK_DOMAINS, mockPostEditorUser } from './post-editor.mock.js';
import styles from './post-editor.module.scss';

it('renders the editor form for a signed-in writer', () => {
  const { container } = render(
    <MockProvider>
      <PostEditor mockDomains={POST_EDITOR_MOCK_DOMAINS} mockUser={mockPostEditorUser()} />
    </MockProvider>
  );

  expect(container.textContent).toContain('כתיבת כתבה חדשה לבלוג');
});

it('shows a validation error when publishing without required fields', async () => {
  const { container } = render(
    <MockProvider>
      <PostEditor mockDomains={POST_EDITOR_MOCK_DOMAINS} mockUser={mockPostEditorUser()} />
    </MockProvider>
  );

  const publishButton = Array.from(container.querySelectorAll('button')).find((button) =>
    button.textContent?.includes('פרסום הכתבה')
  ) as HTMLButtonElement;

  fireEvent.click(publishButton);

  await waitFor(() => {
    expect(container.querySelector(`.${styles.errorText}`)).not.toBeNull();
  });
});

it('does not render the editor form for an anonymous visitor', () => {
  const { container } = render(
    <MockProvider>
      <PostEditor mockDomains={POST_EDITOR_MOCK_DOMAINS} mockUser={null} />
    </MockProvider>
  );

  expect(container.textContent).not.toContain('כתיבת כתבה חדשה לבלוג');
});

it('toggles the members-only switch when clicked', () => {
  const { container } = render(
    <MockProvider>
      <PostEditor mockDomains={POST_EDITOR_MOCK_DOMAINS} mockUser={mockPostEditorUser()} />
    </MockProvider>
  );

  const toggle = container.querySelector(`.${styles.toggle}`) as HTMLButtonElement;
  expect(container.querySelector(`.${styles.toggleActive}`)).toBeNull();

  fireEvent.click(toggle);

  expect(container.querySelector(`.${styles.toggleActive}`)).not.toBeNull();
});

it('selects an embedded app when its pill is clicked', () => {
  const apps = mockAppsData();
  const { container } = render(
    <MockProvider>
      <PostEditor mockDomains={POST_EDITOR_MOCK_DOMAINS} mockApps={apps} mockUser={mockPostEditorUser()} />
    </MockProvider>
  );

  const firstPill = container.querySelector(`.${styles.appPill}`) as HTMLButtonElement;
  expect(firstPill).not.toBeNull();

  fireEvent.click(firstPill);

  expect(firstPill.className).toContain(styles.appPillActive);
});
