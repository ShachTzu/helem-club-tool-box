import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ReactionBar } from './reaction-bar.js';
import styles from './reaction-bar.module.scss';

const unreactedSummary = {
  counts: [
    { type: `like`, count: 11 },
    { type: `heart`, count: 2 },
  ],
  myReaction: undefined,
};

const likedSummary = {
  counts: [
    { type: `like`, count: 24 },
    { type: `heart`, count: 6 },
  ],
  myReaction: `like`,
};

it(`should render an option button for each reaction type`, () => {
  const { container } = render(
    <MockProvider>
      <ReactionBar
        targetType="post"
        targetId="post-1"
        mockData={unreactedSummary}
        mockDeviceId="device-1"
      />
    </MockProvider>
  );

  const optionButtons = container.querySelectorAll(`.${styles.option}`);
  expect(optionButtons.length).toBeGreaterThan(0);
});

it(`should mark the reaction matching myReaction as active`, () => {
  const { container } = render(
    <MockProvider>
      <ReactionBar
        targetType="post"
        targetId="post-1"
        mockData={likedSummary}
        mockDeviceId="device-2"
      />
    </MockProvider>
  );

  const activeButtons = container.querySelectorAll(`.${styles.active}`);
  expect(activeButtons.length).toBe(1);
});

it(`should optimistically increment the count when selecting a new reaction`, () => {
  const { container } = render(
    <MockProvider>
      <ReactionBar
        targetType="post"
        targetId="post-1"
        mockData={unreactedSummary}
        mockDeviceId="device-3"
      />
    </MockProvider>
  );

  const optionButtons = container.querySelectorAll(`.${styles.option}`);
  const likeButton = optionButtons[0] as HTMLButtonElement;

  fireEvent.click(likeButton);

  const countLabel = likeButton.querySelector(`.${styles.count}`);
  expect(countLabel?.textContent).toBe(`12`);
});

it(`should optimistically remove the reaction when toggling the active option again`, () => {
  const { container } = render(
    <MockProvider>
      <ReactionBar
        targetType="post"
        targetId="post-1"
        mockData={likedSummary}
        mockDeviceId="device-4"
      />
    </MockProvider>
  );

  const activeButton = container.querySelector(`.${styles.active}`) as HTMLButtonElement;
  expect(activeButton).toBeTruthy();

  fireEvent.click(activeButton);

  const stillActive = container.querySelectorAll(`.${styles.active}`);
  expect(stillActive.length).toBe(0);
});

it(`should render the total reaction count when showTotal is enabled`, () => {
  const { container } = render(
    <MockProvider>
      <ReactionBar
        targetType="post"
        targetId="post-1"
        mockData={unreactedSummary}
        mockDeviceId="device-5"
        showTotal
      />
    </MockProvider>
  );

  const total = container.querySelector(`.${styles.totalCount}`);
  expect(total?.textContent).toContain(`13`);
});
