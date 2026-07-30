import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import type { PlainComment } from '@helemclub/engagement.entities.comment';
import { CommentThread } from './comment-thread.js';
import styles from './comment-thread.module.scss';

const baseComment: PlainComment = {
  id: `c1`,
  targetType: `app`,
  targetId: `meditation-timer`,
  text: `תודה על השיתוף.`,
  displayName: `מיכל ר.`,
  isAnonymous: false,
  membersOnly: false,
  createdAt: new Date(`2024-01-01`).toISOString(),
};

const membersOnlyComment: PlainComment = {
  id: `c2`,
  targetType: `app`,
  targetId: `meditation-timer`,
  text: `תוכן לחברים בלבד.`,
  displayName: `רואי כהן`,
  isAnonymous: false,
  membersOnly: true,
  createdAt: new Date(`2024-01-02`).toISOString(),
};

const hiddenComment: PlainComment = {
  id: `c3`,
  targetType: `app`,
  targetId: `meditation-timer`,
  text: `תוכן שהוסתר.`,
  displayName: `אורח`,
  isAnonymous: true,
  membersOnly: false,
  hidden: true,
  createdAt: new Date(`2024-01-03`).toISOString(),
};

it(`renders a visible comment's text`, () => {
  const { container } = render(
    <MockProvider>
      <CommentThread mockComments={[baseComment]} mockUser={null} />
    </MockProvider>
  );

  const commentText = container.querySelector(`.${styles.commentText}`);
  expect(commentText?.textContent).toBe(baseComment.text);
});

it(`excludes hidden comments from the thread`, () => {
  const { container } = render(
    <MockProvider>
      <CommentThread mockComments={[baseComment, hiddenComment]} mockUser={null} />
    </MockProvider>
  );

  const rows = container.querySelectorAll(`.${styles.commentRow}`);
  expect(rows.length).toBe(1);
});

it(`shows a join placeholder for members-only comments to anonymous viewers`, () => {
  const { container } = render(
    <MockProvider>
      <CommentThread mockComments={[baseComment, membersOnlyComment]} mockUser={null} />
    </MockProvider>
  );

  const gatedRows = container.querySelectorAll(`.${styles.gatedRow}`);
  const commentRows = container.querySelectorAll(`.${styles.commentRow}`);
  expect(gatedRows.length).toBe(1);
  expect(commentRows.length).toBe(1);
});

it(`reveals members-only comments to a signed-in member`, () => {
  const { container } = render(
    <MockProvider>
      <CommentThread
        mockComments={[baseComment, membersOnlyComment]}
        mockUser={{
          id: `u1`,
          email: `roi@helam.club`,
          displayName: `רואי כהן`,
          role: `member`,
          provider: `email`,
          createdAt: new Date(`2023-01-01`).toISOString(),
        }}
      />
    </MockProvider>
  );

  const commentRows = container.querySelectorAll(`.${styles.commentRow}`);
  const gatedRows = container.querySelectorAll(`.${styles.gatedRow}`);
  expect(commentRows.length).toBe(2);
  expect(gatedRows.length).toBe(0);
});

it(`shows the comment count in the heading`, () => {
  const { container } = render(
    <MockProvider>
      <CommentThread mockComments={[baseComment, membersOnlyComment]} mockUser={null} />
    </MockProvider>
  );

  const heading = container.querySelector(`.${styles.heading}`);
  expect(heading?.textContent).toBe(`תגובות (2)`);
});

it(`forces the anonymous toggle on for anonymous viewers`, () => {
  const { container } = render(
    <MockProvider>
      <CommentThread mockComments={[]} mockUser={null} />
    </MockProvider>
  );

  const toggle = container.querySelector(`.${styles.anonymousToggle}`);
  expect(toggle?.getAttribute(`aria-pressed`)).toBe(`true`);
  expect(toggle).toHaveProperty(`disabled`, true);
});

it(`allows a signed-in member to toggle the anonymous switch`, () => {
  const { container } = render(
    <MockProvider>
      <CommentThread
        mockComments={[]}
        mockUser={{
          id: `u1`,
          email: `roi@helam.club`,
          displayName: `רואי כהן`,
          role: `member`,
          provider: `email`,
          createdAt: new Date(`2023-01-01`).toISOString(),
        }}
      />
    </MockProvider>
  );

  const toggle = container.querySelector(`.${styles.anonymousToggle}`);
  expect(toggle?.getAttribute(`aria-pressed`)).toBe(`false`);

  fireEvent.click(toggle as Element);

  const toggleAfter = container.querySelector(`.${styles.anonymousToggle}`);
  expect(toggleAfter?.getAttribute(`aria-pressed`)).toBe(`true`);
});

it(`marks a comment as reported after clicking the report button`, () => {
  const { container } = render(
    <MockProvider>
      <CommentThread mockComments={[baseComment]} mockUser={null} />
    </MockProvider>
  );

  const reportButton = container.querySelector(`.${styles.reportButton}`);
  expect(reportButton?.textContent).toContain(`דיווח`);

  fireEvent.click(reportButton as Element);

  const reportButtonAfter = container.querySelector(`.${styles.reportButton}`);
  expect(reportButtonAfter?.textContent).toContain(`הדיווח נשלח`);
});
