import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { CalendarIcon, WebinarIcon, LocationIcon, RsvpIcon } from './events-icons.js';

describe('events-icons', () => {
  it('should render the calendar icon with its default accessible label', () => {
    const { container } = render(
      <MemoryRouter>
        <CalendarIcon />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg?.getAttribute('aria-label')).toBe('תאריך');
  });

  it('should render the webinar icon with its default accessible label', () => {
    const { container } = render(
      <MemoryRouter>
        <WebinarIcon />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toBe('וובינר');
  });

  it('should render the location icon with its default accessible label', () => {
    const { container } = render(
      <MemoryRouter>
        <LocationIcon />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toBe('מיקום');
  });

  it('should render the rsvp icon with its default accessible label', () => {
    const { container } = render(
      <MemoryRouter>
        <RsvpIcon />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toBe('אישור הגעה');
  });

  it('should allow overriding the accessible title', () => {
    const { container } = render(
      <MemoryRouter>
        <CalendarIcon title="תאריך האירוע" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg');
    expect(svg?.getAttribute('aria-label')).toBe('תאריך האירוע');
  });

  it('should apply a custom class name to the icon', () => {
    const { container } = render(
      <MemoryRouter>
        <RsvpIcon className="custom-rsvp" />
      </MemoryRouter>
    );
    const svg = container.querySelector('svg.custom-rsvp');
    expect(svg).toBeTruthy();
  });
});
