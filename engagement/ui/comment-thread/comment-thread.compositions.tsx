import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { CommentThread } from './comment-thread.js';
import { mockCommentThreadComments } from './comment-thread.mock.js';

export const AnonymousViewerCommentThread = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 640 }}>
        <CommentThread
          targetType="app"
          targetId="meditation-timer"
          parentLabel="הכלי"
          mockComments={mockCommentThreadComments()}
          mockUser={null}
        />
      </div>
    </MockProvider>
  );
};

export const SignedInMemberCommentThread = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 640 }}>
        <CommentThread
          targetType="post"
          targetId="breathing-exercise"
          parentLabel="הכתבה"
          mockComments={mockCommentThreadComments()}
          mockUser={{
            id: `u1`,
            email: `roi@helam.club`,
            displayName: `רואי כהן`,
            role: `member`,
            provider: `email`,
            createdAt: new Date(`2023-01-01`).toISOString(),
          }}
        />
      </div>
    </MockProvider>
  );
};

export const EmptyCommentThread = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 640 }}>
        <CommentThread
          targetType="record"
          targetId="grounding-practice"
          parentLabel="ההקלטה"
          mockComments={[]}
          mockUser={null}
        />
      </div>
    </MockProvider>
  );
};
