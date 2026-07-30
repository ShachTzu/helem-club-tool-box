import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockMediaRecord } from '@helemclub/knowledge-base.entities.media-record';
import { RecordCard } from './record-card.js';
import styles from './record-card.module.scss';

it('should render the record title', () => {
  const record = mockMediaRecord({ title: `כותרת לדוגמה של תוכן` }).toObject();
  const { getByText } = render(
    <MemoryRouter>
      <RecordCard record={record} />
    </MemoryRouter>
  );

  const rendered = getByText(`כותרת לדוגמה של תוכן`);
  expect(rendered).toBeTruthy();
});

it('should render the record description', () => {
  const record = mockMediaRecord({ description: `תיאור לדוגמה של תוכן` }).toObject();
  const { getByText } = render(
    <MemoryRouter>
      <RecordCard record={record} />
    </MemoryRouter>
  );

  const rendered = getByText(`תיאור לדוגמה של תוכן`);
  expect(rendered).toBeTruthy();
});

it('should render the video media-type badge for a video record', () => {
  const record = mockMediaRecord({ mediaType: `video` }).toObject();
  const { container } = render(
    <MemoryRouter>
      <RecordCard record={record} />
    </MemoryRouter>
  );

  const badge = container.querySelector(`.${styles.videoBadge}`);
  expect(badge).toBeTruthy();
});

it('should render the audio media-type badge for an audio record', () => {
  const record = mockMediaRecord({ mediaType: `audio` }).toObject();
  const { container } = render(
    <MemoryRouter>
      <RecordCard record={record} />
    </MemoryRouter>
  );

  const badge = container.querySelector(`.${styles.audioBadge}`);
  expect(badge).toBeTruthy();
});

it('should render the formatted duration', () => {
  const record = mockMediaRecord({ durationSec: 125 }).toObject();
  const { container } = render(
    <MemoryRouter>
      <RecordCard record={record} />
    </MemoryRouter>
  );

  const duration = container.querySelector(`.${styles.duration}`);
  expect(duration?.textContent).toContain(`2:05`);
});

it('should link to the record page using the slug when href is not provided', () => {
  const record = mockMediaRecord({ slug: `custom-slug` }).toObject();
  const { container } = render(
    <MemoryRouter>
      <RecordCard record={record} />
    </MemoryRouter>
  );

  const linkElement = container.querySelector(`a`);
  expect(linkElement?.getAttribute(`href`)).toContain(`custom-slug`);
});

it('should link using the provided href when set', () => {
  const record = mockMediaRecord().toObject();
  const { container } = render(
    <MemoryRouter>
      <RecordCard record={record} href="/knowledge/record/custom-path" />
    </MemoryRouter>
  );

  const linkElement = container.querySelector(`a`);
  expect(linkElement?.getAttribute(`href`)).toContain(`/knowledge/record/custom-path`);
});

it('should render the view count', () => {
  const record = mockMediaRecord({ viewCount: 4520 }).toObject();
  const { container } = render(
    <MemoryRouter>
      <RecordCard record={record} />
    </MemoryRouter>
  );

  const viewsElement = container.querySelector(`.${styles.views}`);
  expect(viewsElement?.textContent).toContain(`4,520`);
});
