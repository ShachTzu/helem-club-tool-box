import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockApps } from '@helemclub/toolbox.entities.app';
import { AppGrid } from './app-grid.js';
import styles from './app-grid.module.scss';

describe('AppGrid', () => {
  it('renders a card for each provided app', () => {
    const apps = mockApps()
      .slice(0, 2)
      .map((app) => app.toObject());

    const { container } = render(
      <MemoryRouter>
        <AppGrid apps={apps} />
      </MemoryRouter>
    );

    const grid = container.querySelector(`.${styles.grid}`);
    expect(grid).toBeTruthy();
    expect(grid?.children.length).toBe(2);
  });

  it('renders the app names from the provided apps', () => {
    const apps = mockApps()
      .slice(0, 1)
      .map((app) => app.toObject());

    const { getByText } = render(
      <MemoryRouter>
        <AppGrid apps={apps} />
      </MemoryRouter>
    );

    expect(getByText(apps[0].name)).toBeTruthy();
  });

  it('renders the empty state when there are no apps', () => {
    const { getByText, container } = render(
      <MemoryRouter>
        <AppGrid apps={[]} emptyTitle="לא נמצאו כלים" />
      </MemoryRouter>
    );

    expect(getByText('לא נמצאו כלים')).toBeTruthy();
    expect(container.querySelector(`.${styles.grid}`)).toBeFalsy();
  });

  it('applies a custom class name to the root element', () => {
    const apps = mockApps()
      .slice(0, 1)
      .map((app) => app.toObject());

    const { container } = render(
      <MemoryRouter>
        <AppGrid apps={apps} className="custom-grid" />
      </MemoryRouter>
    );

    const grid = container.querySelector('.custom-grid');
    expect(grid).toBeTruthy();
  });
});
