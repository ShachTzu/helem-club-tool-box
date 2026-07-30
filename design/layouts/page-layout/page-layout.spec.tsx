import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { PageLayout } from './page-layout.js';
import styles from './page-layout.module.scss';

it('should render its children', () => {
  const { getByText } = render(
    <MemoryRouter>
      <PageLayout>
        <div>Page content</div>
      </PageLayout>
    </MemoryRouter>
  );

  expect(getByText('Page content')).toBeTruthy();
});

it('should render as a main element by default', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout>
        <div>Content</div>
      </PageLayout>
    </MemoryRouter>
  );

  const mainElement = container.querySelector('main');
  expect(mainElement).toBeTruthy();
});

it('should render as a different element when `as` is set', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout as="section">
        <div>Content</div>
      </PageLayout>
    </MemoryRouter>
  );

  const sectionElement = container.querySelector('section');
  const mainElement = container.querySelector('main');
  expect(sectionElement).toBeTruthy();
  expect(mainElement).toBeFalsy();
});

it('should apply the default spacing class name by default', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout>
        <div>Content</div>
      </PageLayout>
    </MemoryRouter>
  );

  const rootElement = container.querySelector('main');
  expect(rootElement?.className).toContain(styles.default);
});

it('should apply a custom spacing class name', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout spacing="compact">
        <div>Content</div>
      </PageLayout>
    </MemoryRouter>
  );

  const rootElement = container.querySelector('main');
  expect(rootElement?.className).toContain(styles.compact);
});

it('should apply a custom class name', () => {
  const { container } = render(
    <MemoryRouter>
      <PageLayout className="custom-page">
        <div>Content</div>
      </PageLayout>
    </MemoryRouter>
  );

  const rootElement = container.querySelector('main');
  expect(rootElement?.className).toContain('custom-page');
});
