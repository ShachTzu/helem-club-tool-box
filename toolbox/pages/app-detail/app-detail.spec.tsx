import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { AppDetail } from './app-detail.js';
import { mockAppDetailData, mockGroundMeAppData, mockAppDetailReviewsData } from './app-detail.mock.js';
import styles from './app-detail.module.scss';

it('should render the app name and subtitle', () => {
  const app = mockAppDetailData();

  const { container } = render(
    <MockProvider>
      <AppDetail app={app} reviews={[]} />
    </MockProvider>
  );

  const name = container.querySelector(`.${styles.name}`);
  const subtitle = container.querySelector(`.${styles.subtitle}`);

  expect(name?.textContent).toBe(app.name);
  expect(subtitle?.textContent).toBe(app.subtitle);
});

it('should render the featured badge when the app is featured', () => {
  const app = mockGroundMeAppData();

  const { container } = render(
    <MockProvider>
      <AppDetail app={app} reviews={[]} />
    </MockProvider>
  );

  const featuredBadge = container.querySelector(`.${styles.featuredBadge}`);
  expect(featuredBadge).toBeTruthy();
});

it('should not render the featured badge when the app is not featured', () => {
  const app = mockAppDetailData();

  const { container } = render(
    <MockProvider>
      <AppDetail app={{ ...app, isFeatured: false }} reviews={[]} />
    </MockProvider>
  );

  const featuredBadge = container.querySelector(`.${styles.featuredBadge}`);
  expect(featuredBadge).toBeFalsy();
});

it('should render the reviews list when reviews are provided', () => {
  const app = mockGroundMeAppData();
  const reviews = mockAppDetailReviewsData();

  const { container } = render(
    <MockProvider>
      <AppDetail app={app} reviews={reviews} />
    </MockProvider>
  );

  const reviewItems = container.querySelectorAll(`.${styles.reviewItem}`);
  expect(reviewItems.length).toBe(reviews.length);
});

it('should render an empty reviews message when there are no reviews', () => {
  const app = mockAppDetailData();

  const { container } = render(
    <MockProvider>
      <AppDetail app={app} reviews={[]} />
    </MockProvider>
  );

  const emptyReviews = container.querySelector(`.${styles.emptyReviews}`);
  expect(emptyReviews?.textContent).toContain(`אין עדיין ביקורות`);
});

it('should toggle the review form when the write review button is clicked', () => {
  const app = mockAppDetailData();

  const { container } = render(
    <MockProvider>
      <AppDetail app={app} reviews={[]} />
    </MockProvider>
  );

  expect(container.querySelector(`.${styles.reviewForm}`)).toBeFalsy();

  const writeReviewButton = container.querySelector(`.${styles.writeReviewButton}`) as HTMLButtonElement;
  fireEvent.click(writeReviewButton);

  expect(container.querySelector(`.${styles.reviewForm}`)).toBeTruthy();
});

it('should link back to the given backHref', () => {
  const app = mockAppDetailData();

  const { container } = render(
    <MockProvider>
      <AppDetail app={app} reviews={[]} backHref="/custom-toolbox" />
    </MockProvider>
  );

  const backLink = container.querySelector(`.${styles.backLink}`) as HTMLAnchorElement;
  expect(backLink.getAttribute(`href`)).toBe(`/custom-toolbox`);
});

it('should render the credits section with the developer name', () => {
  const app = mockAppDetailData();

  const { container } = render(
    <MockProvider>
      <AppDetail app={app} reviews={[]} />
    </MockProvider>
  );

  const metaValue = container.querySelector(`.${styles.metaValue}`);
  expect(metaValue?.textContent).toBe(app.developerName);
});
