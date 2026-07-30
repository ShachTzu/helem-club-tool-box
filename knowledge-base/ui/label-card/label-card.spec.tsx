import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockLabel } from '@helemclub/knowledge-base.entities.label';
import { LabelCard } from './label-card.js';
import styles from './label-card.module.scss';

it('should render the label name', () => {
  const label = mockLabel({ name: `שם פרויקט לדוגמה` }).toObject();
  const { getByText } = render(
    <MemoryRouter>
      <LabelCard label={label} />
    </MemoryRouter>
  );

  const rendered = getByText(`שם פרויקט לדוגמה`);
  expect(rendered).toBeTruthy();
});

it('should render the label description', () => {
  const label = mockLabel({ description: `תיאור לדוגמה של פרויקט` }).toObject();
  const { getByText } = render(
    <MemoryRouter>
      <LabelCard label={label} />
    </MemoryRouter>
  );

  const rendered = getByText(`תיאור לדוגמה של פרויקט`);
  expect(rendered).toBeTruthy();
});

it('should render the record count', () => {
  const label = mockLabel({ recordCount: 7 }).toObject();
  const { container } = render(
    <MemoryRouter>
      <LabelCard label={label} />
    </MemoryRouter>
  );

  const countElement = container.querySelector(`.${styles.count}`);
  expect(countElement?.textContent).toContain(`7`);
});

it('should link to the label lobby using the slug when href is not provided', () => {
  const label = mockLabel({ slug: `custom-slug` }).toObject();
  const { container } = render(
    <MemoryRouter>
      <LabelCard label={label} />
    </MemoryRouter>
  );

  const linkElement = container.querySelector(`a`);
  expect(linkElement?.getAttribute(`href`)).toContain(`custom-slug`);
});

it('should link using the provided href when set', () => {
  const label = mockLabel().toObject();
  const { container } = render(
    <MemoryRouter>
      <LabelCard label={label} href="/knowledge/custom-path" />
    </MemoryRouter>
  );

  const linkElement = container.querySelector(`a`);
  expect(linkElement?.getAttribute(`href`)).toContain(`/knowledge/custom-path`);
});

it('should not render a description when it is not provided', () => {
  const label = mockLabel({ description: undefined }).toObject();
  const { container } = render(
    <MemoryRouter>
      <LabelCard label={label} />
    </MemoryRouter>
  );

  const descriptionElement = container.querySelector(`p`);
  expect(descriptionElement).toBeNull();
});
