import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockAppsData } from '@helemclub/toolbox.hooks.use-apps';
import { PostEditor } from './post-editor.js';
import { POST_EDITOR_MOCK_DOMAINS, mockPostEditorUser } from './post-editor.mock.js';

export const WriterPostEditor = () => {
  return (
    <MockProvider>
      <PostEditor
        mockDomains={POST_EDITOR_MOCK_DOMAINS}
        mockApps={mockAppsData()}
        mockUser={mockPostEditorUser()}
      />
    </MockProvider>
  );
};

export const AdminPostEditor = () => {
  return (
    <MockProvider>
      <PostEditor
        mockDomains={POST_EDITOR_MOCK_DOMAINS}
        mockApps={mockAppsData()}
        mockUser={mockPostEditorUser({ displayName: `רועי אדמין`, role: `admin` })}
      />
    </MockProvider>
  );
};

export const AnonymousAccessDenied = () => {
  return (
    <MockProvider>
      <PostEditor mockDomains={POST_EDITOR_MOCK_DOMAINS} mockApps={mockAppsData()} mockUser={null} />
    </MockProvider>
  );
};
