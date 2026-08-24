import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockDrafts, type PlainDraft } from '@helemclub/editorial.entities.draft';
import type { ReviewActionsUser } from './review-actions-user-type.js';
import { ReviewActions } from './review-actions.js';

const baseDraft = mockDrafts()[0].toObject();

const writerUser: ReviewActionsUser = {
  id: `user-101`,
  email: `noa@example.com`,
  displayName: `נועה כהן`,
  role: `writer`,
  provider: `email`,
  createdAt: `2024-01-01T00:00:00.000Z`,
  membershipStatus: `approved`,
};

const moderatorUser: ReviewActionsUser = {
  id: `user-900`,
  email: `dana@example.com`,
  displayName: `דנה מנחה`,
  role: `moderator`,
  provider: `email`,
  createdAt: `2024-01-01T00:00:00.000Z`,
  membershipStatus: `approved`,
};

const adminUser: ReviewActionsUser = {
  id: `user-999`,
  email: `admin@example.com`,
  displayName: `רועי אדמין`,
  role: `admin`,
  provider: `email`,
  createdAt: `2024-01-01T00:00:00.000Z`,
  membershipStatus: `approved`,
};

const draftStatusDraft: PlainDraft = { ...baseDraft, status: `draft`, authorId: writerUser.id };
const draftStatusInReview: PlainDraft = { ...baseDraft, status: `in_review`, authorId: `user-102` };
const draftStatusApproved: PlainDraft = { ...baseDraft, status: `approved`, authorId: `user-103` };

export const WriterOnOwnDraft = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 640 }}>
        <h3>כותבת על טיוטה שלה במצב &quot;טיוטה&quot;</h3>
        <ReviewActions
          draft={draftStatusDraft}
          mockUser={writerUser}
          onDone={(updated) => console.log(`draft updated`, updated.status)}
        />
      </div>
    </MockProvider>
  );
};

export const ModeratorOnDraftInReview = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 640 }}>
        <h3>מנחה על טיוטה במצב &quot;בביקורת&quot;</h3>
        <ReviewActions
          draft={draftStatusInReview}
          mockUser={moderatorUser}
          onDone={(updated) => console.log(`draft updated`, updated.status)}
        />
      </div>
    </MockProvider>
  );
};

export const AdminOnApprovedDraft = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 640 }}>
        <h3>אדמין על טיוטה שאושרה, מוכנה לפרסום</h3>
        <ReviewActions
          draft={draftStatusApproved}
          mockUser={adminUser}
          onDone={(updated) => console.log(`draft updated`, updated.status)}
        />
      </div>
    </MockProvider>
  );
};

export const NoPermissionAvailable = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 640 }}>
        <h3>חבר/ה קהילה ללא הרשאת עריכה על טיוטה בביקורת</h3>
        <ReviewActions draft={draftStatusInReview} mockUser={writerUser} />
      </div>
    </MockProvider>
  );
};
