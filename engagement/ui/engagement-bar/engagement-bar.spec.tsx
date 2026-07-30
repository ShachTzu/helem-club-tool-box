import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { EngagementBar } from './engagement-bar.js';
import styles from './engagement-bar.module.scss';

const reactions = {
  counts: [
    { type: `like`, count: 11 },
    { type: `heart`, count: 2 },
  ],
  myReaction: undefined,
};

const comments = [
  {
    id: `c1`,
    targetType: `post`,
    targetId: `post-1`,
    text: `תגובה ראשונה`,
    displayName: `דנה`,
    isAnonymous: false,
    membersOnly: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: `c2`,
    targetType: `post`,
    targetId: `post-1`,
    text: `תגובה שנייה`,
    isAnonymous: true,
    membersOnly: false,
    createdAt: new Date().toISOString(),
  },
];

it(`should render the comment count from the provided mock comments`, () => {
  const { container } = render(
    <MockProvider>
      <EngagementBar
        targetType="post"
        targetId="post-1"
        mockReactions={reactions}
        mockComments={comments}
        mockDeviceId="device-1"
      />
    </MockProvider>
  );

  const commentCount = container.querySelector(`.${styles.commentCount}`);
  expect(commentCount?.textContent).toBe(`2`);
});

it(`should call onCommentsClick when the comment button is clicked`, () => {
  let clicked = false;

  const { container } = render(
    <MockProvider>
      <EngagementBar
        targetType="post"
        targetId="post-1"
        mockReactions={reactions}
        mockComments={comments}
        mockDeviceId="device-2"
        onCommentsClick={() => {
          clicked = true;
        }}
      />
    </MockProvider>
  );

  const commentButton = container.querySelector(`.${styles.commentButton}`) as HTMLButtonElement;
  fireEvent.click(commentButton);

  expect(clicked).toBe(true);
});

it(`should render the share buttons section`, () => {
  const { container } = render(
    <MockProvider>
      <EngagementBar
        targetType="post"
        targetId="post-1"
        mockReactions={reactions}
        mockComments={comments}
        mockDeviceId="device-3"
      />
    </MockProvider>
  );

  const shareSection = container.querySelector(`.${styles.shareSection}`);
  expect(shareSection?.children.length).toBeGreaterThan(0);
});

it(`should apply a custom class name to the root element`, () => {
  const { container } = render(
    <MockProvider>
      <EngagementBar
        targetType="post"
        targetId="post-1"
        mockReactions={reactions}
        mockComments={comments}
        mockDeviceId="device-4"
        className="custom-engagement-bar"
      />
    </MockProvider>
  );

  const root = container.querySelector(`.${styles.engagementBar}`);
  expect(root?.className).toContain(`custom-engagement-bar`);
});
