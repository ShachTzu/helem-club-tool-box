import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SectionLayout } from './section-layout.js';
import styles from './section-layout.module.scss';

it('should render its children', () => {
  const { getByText } = render(
    <MemoryRouter>
      <SectionLayout>
        <div>Section content</div>
      </SectionLayout>
    </MemoryRouter>
  );

  expect(getByText('Section content')).toBeTruthy();
});

it('should render the title, subtitle and eyebrow when provided', () => {
  const { getByText } = render(
    <MemoryRouter>
      <SectionLayout eyebrow="קטגוריה" title="כותרת הסקציה" subtitle="תת כותרת">
        <div>Content</div>
      </SectionLayout>
    </MemoryRouter>
  );

  expect(getByText('קטגוריה')).toBeTruthy();
  expect(getByText('כותרת הסקציה')).toBeTruthy();
  expect(getByText('תת כותרת')).toBeTruthy();
});

it('should not render the header container when no eyebrow, title, subtitle or action are set', () => {
  const { container } = render(
    <MemoryRouter>
      <SectionLayout>
        <div>Content</div>
      </SectionLayout>
    </MemoryRouter>
  );

  const header = container.querySelector(`.${styles.header}`);
  expect(header).toBeFalsy();
});

it('should render the action element when provided', () => {
  const { getByText } = render(
    <MemoryRouter>
      <SectionLayout title="כותרת" action={<a href="/more">לכל התוכן</a>}>
        <div>Content</div>
      </SectionLayout>
    </MemoryRouter>
  );

  expect(getByText('לכל התוכן')).toBeTruthy();
});

it('should render as a section element by default', () => {
  const { container } = render(
    <MemoryRouter>
      <SectionLayout>
        <div>Content</div>
      </SectionLayout>
    </MemoryRouter>
  );

  const sectionElement = container.querySelector('section');
  expect(sectionElement).toBeTruthy();
});

it('should render as a different element when `as` is set', () => {
  const { container } = render(
    <MemoryRouter>
      <SectionLayout as="div">
        <div>Content</div>
      </SectionLayout>
    </MemoryRouter>
  );

  const sectionElement = container.querySelector('section');
  expect(sectionElement).toBeFalsy();
});

it('should apply the default spacing class name by default', () => {
  const { container } = render(
    <MemoryRouter>
      <SectionLayout>
        <div>Content</div>
      </SectionLayout>
    </MemoryRouter>
  );

  const rootElement = container.querySelector('section');
  expect(rootElement?.className).toContain(styles.default);
});

it('should apply a custom spacing class name', () => {
  const { container } = render(
    <MemoryRouter>
      <SectionLayout spacing="compact">
        <div>Content</div>
      </SectionLayout>
    </MemoryRouter>
  );

  const rootElement = container.querySelector('section');
  expect(rootElement?.className).toContain(styles.compact);
});

it('should apply a custom class name', () => {
  const { container } = render(
    <MemoryRouter>
      <SectionLayout className="custom-section">
        <div>Content</div>
      </SectionLayout>
    </MemoryRouter>
  );

  const rootElement = container.querySelector('section');
  expect(rootElement?.className).toContain('custom-section');
});
