import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockEvent } from '@helemclub/events.entities.event';
import { EventSchedule } from './event-schedule.js';
import styles from './event-schedule.module.scss';

const upcomingEvent = mockEvent({
  slug: `upcoming-event`,
  title: `אירוע קרוב לדוגמה`,
  startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  endAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2).toISOString(),
}).toObject();

const pastEvent = mockEvent({
  slug: `past-event`,
  title: `אירוע שהיה לדוגמה`,
  startAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
  endAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7 + 1000 * 60 * 60 * 2).toISOString(),
}).toObject();

describe(`EventSchedule`, () => {
  it(`renders the title and description`, () => {
    const { container } = render(
      <MemoryRouter>
        <EventSchedule events={[upcomingEvent, pastEvent]} title="לוח אירועים" description="תיאור לדוגמה" />
      </MemoryRouter>
    );

    const title = container.querySelector(`.${styles.title}`);
    const description = container.querySelector(`.${styles.description}`);
    expect(title?.textContent).toBe(`לוח אירועים`);
    expect(description?.textContent).toBe(`תיאור לדוגמה`);
  });

  it(`shows upcoming events by default`, () => {
    const { container } = render(
      <MemoryRouter>
        <EventSchedule events={[upcomingEvent, pastEvent]} />
      </MemoryRouter>
    );

    const grid = container.querySelector(`.${styles.grid}`);
    expect(grid?.textContent).toContain(`אירוע קרוב לדוגמה`);
    expect(grid?.textContent).not.toContain(`אירוע שהיה לדוגמה`);
  });

  it(`switches to past events when the past tab is clicked`, () => {
    const { container } = render(
      <MemoryRouter>
        <EventSchedule events={[upcomingEvent, pastEvent]} />
      </MemoryRouter>
    );

    const tabButtons = container.querySelectorAll(`button`);
    const pastTabButton = Array.from(tabButtons).find((button) => button.textContent === `אירועים שהיו`);
    expect(pastTabButton).toBeTruthy();

    fireEvent.click(pastTabButton as Element);

    const grid = container.querySelector(`.${styles.grid}`);
    expect(grid?.textContent).toContain(`אירוע שהיה לדוגמה`);
    expect(grid?.textContent).not.toContain(`אירוע קרוב לדוגמה`);
  });

  it(`shows an empty state when there are no events for the active tab`, () => {
    const { container } = render(
      <MemoryRouter>
        <EventSchedule events={[]} emptyUpcomingTitle="אין אירועים" />
      </MemoryRouter>
    );

    expect(container.querySelector(`.${styles.grid}`)).toBeFalsy();
    expect(container.textContent).toContain(`אין אירועים`);
  });
});
