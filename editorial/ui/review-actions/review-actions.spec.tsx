import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { mockDrafts } from '@helemclub/editorial.entities.draft';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import type { ReviewActionsUser } from './review-actions-user-type.js';
import { ReviewActions } from './review-actions.js';
import styles from './review-actions.module.scss';

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

describe(`ReviewActions`, () => {
  it(`shows the submit-for-review action for the author of a draft`, () => {
    const draft = { ...baseDraft, status: `draft` as const, authorId: writerUser.id };

    const { getByText } = render(
      <MockProvider>
        <ReviewActions draft={draft} mockUser={writerUser} />
      </MockProvider>
    );

    expect(getByText(`שלח לביקורת`)).toBeTruthy();
  });

  it(`does not show the submit action for a draft that belongs to another author`, () => {
    const draft = { ...baseDraft, status: `draft` as const, authorId: `someone-else` };

    const { queryByText } = render(
      <MockProvider>
        <ReviewActions draft={draft} mockUser={writerUser} />
      </MockProvider>
    );

    expect(queryByText(`שלח לביקורת`)).toBeFalsy();
  });

  it(`shows moderator actions for a draft in review`, () => {
    const draft = { ...baseDraft, status: `in_review` as const, authorId: `user-102` };

    const { getByText } = render(
      <MockProvider>
        <ReviewActions draft={draft} mockUser={moderatorUser} />
      </MockProvider>
    );

    expect(getByText(`אשר`)).toBeTruthy();
    expect(getByText(`בקש תיקונים`)).toBeTruthy();
    expect(getByText(`דחה`)).toBeTruthy();
  });

  it(`shows the publish action for a moderator on an approved draft`, () => {
    const draft = { ...baseDraft, status: `approved` as const, authorId: `user-103` };

    const { getByText } = render(
      <MockProvider>
        <ReviewActions draft={draft} mockUser={moderatorUser} />
      </MockProvider>
    );

    expect(getByText(`פרסם`)).toBeTruthy();
  });

  it(`shows a no-permission message when the user cannot act on the draft`, () => {
    const draft = { ...baseDraft, status: `in_review` as const, authorId: `user-102` };

    const { container } = render(
      <MockProvider>
        <ReviewActions draft={draft} mockUser={writerUser} />
      </MockProvider>
    );

    const message = container.querySelector(`.${styles.statusMessage}`);
    expect(message?.textContent).toContain(`אין פעולות עריכה זמינות`);
  });

  it(`requires a note before confirming a request-changes action`, async () => {
    const draft = { ...baseDraft, status: `in_review` as const, authorId: `user-102` };

    const { getByText, container } = render(
      <MockProvider>
        <ReviewActions draft={draft} mockUser={moderatorUser} />
      </MockProvider>
    );

    fireEvent.click(getByText(`בקש תיקונים`));

    const confirmButton = await waitFor(() => getByText(`שליחת הבקשה`));
    fireEvent.click(confirmButton);

    await waitFor(() => {
      const errorText = container.querySelector(`textarea`)?.parentElement?.textContent;
      expect(errorText).toContain(`יש להזין נימוק`);
    });
  });

  it(`closes the modal when cancel is clicked`, async () => {
    const draft = { ...baseDraft, status: `in_review` as const, authorId: `user-102` };

    const { getByText, queryByText } = render(
      <MockProvider>
        <ReviewActions draft={draft} mockUser={moderatorUser} />
      </MockProvider>
    );

    fireEvent.click(getByText(`דחה`));
    const cancelButton = await waitFor(() => getByText(`ביטול`));
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(queryByText(`ביטול`)).toBeFalsy();
    });
  });
});
