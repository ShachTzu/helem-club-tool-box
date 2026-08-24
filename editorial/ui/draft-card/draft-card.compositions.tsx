import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockDrafts } from '@helemclub/editorial.entities.draft';
import { DraftCard } from './draft-card.js';

const drafts = mockDrafts().map((draft) => draft.toObject());

const newDraft = {
  ...drafts[0],
  status: 'draft' as const,
  updatedAt: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
  lastReviewNote: undefined,
};

const inReviewDraft = {
  ...drafts[1],
  status: 'in_review' as const,
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  lastReviewNote: undefined,
};

const changesRequestedDraft = {
  ...drafts[2],
  status: 'changes_requested' as const,
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  lastReviewNote: `יש להוסיף כתוביות בעברית ולקצר את המבוא.`,
};

const publishedDraft = {
  ...drafts[4],
  status: 'published' as const,
  updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
};

export const NewDraft = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 380 }}>
        <DraftCard draft={newDraft} />
      </div>
    </MockProvider>
  );
};

export const DraftInReview = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 380 }}>
        <DraftCard draft={inReviewDraft} />
      </div>
    </MockProvider>
  );
};

export const DraftWithChangesRequested = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 380 }}>
        <DraftCard draft={changesRequestedDraft} />
      </div>
    </MockProvider>
  );
};

export const PublishedDraftWithActions = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 380 }}>
        <DraftCard
          draft={publishedDraft}
          actions={
            <>
              <button type="button">צפייה בגרסה שפורסמה</button>
              <button type="button">העברה לארכיון</button>
            </>
          }
        />
      </div>
    </MockProvider>
  );
};
