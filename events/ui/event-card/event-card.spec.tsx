import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { mockEvent } from '@helemclub/events.entities.event';
import { EventCard } from './event-card.js';
import styles from './event-card.module.scss';

it('should render the event title', () => {
  const event = mockEvent({ title: `כותרת אירוע לדוגמה` }).toObject();
  const { getByText } = render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>
  );

  const rendered = getByText(`כותרת אירוע לדוגמה`);
  expect(rendered).toBeTruthy();
});

it('should render the event description', () => {
  const event = mockEvent({ description: `תיאור לדוגמה של אירוע` }).toObject();
  const { getByText } = render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>
  );

  const rendered = getByText(`תיאור לדוגמה של אירוע`);
  expect(rendered).toBeTruthy();
});

it('should render the type badge label', () => {
  const event = mockEvent({ type: `webinar` }).toObject();
  const { container } = render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>
  );

  const typeBadge = container.querySelector(`.${styles.typeBadge}`);
  expect(typeBadge?.textContent).toBe(`וובינר`);
});

it('should render the online location label when the event is online', () => {
  const event = mockEvent({ isOnline: true, location: `זום` }).toObject();
  const { getByText } = render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>
  );

  const rendered = getByText(`זום`);
  expect(rendered).toBeTruthy();
});

it('should render the physical location label when the event is not online', () => {
  const event = mockEvent({ isOnline: false, location: `תל אביב` }).toObject();
  const { getByText } = render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>
  );

  const rendered = getByText(`תל אביב`);
  expect(rendered).toBeTruthy();
});

it('should link to the event detail page using the slug when href is not provided', () => {
  const event = mockEvent({ slug: `custom-slug` }).toObject();
  const { container } = render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>
  );

  const cardLink = container.querySelector(`.${styles.cardLink}`);
  expect(cardLink?.getAttribute(`aria-label`)).toBe(event.title);
  expect(cardLink).toBeTruthy();
});

it('should link using the provided href when set', () => {
  const event = mockEvent().toObject();
  const { container } = render(
    <MemoryRouter>
      <EventCard event={event} href="/events/custom-path" />
    </MemoryRouter>
  );

  const cardLink = container.querySelector(`.${styles.cardLink}`);
  expect(cardLink).toBeTruthy();
  expect(cardLink?.getAttribute(`role`)).toBe(`link`);
});

it('should render the domains associated with the event', () => {
  const event = mockEvent({ domains: [`שינה`, `חרדה`] }).toObject();
  const { getByText } = render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>
  );

  expect(getByText(`שינה`)).toBeTruthy();
  expect(getByText(`חרדה`)).toBeTruthy();
});

it('should not render the domains container when the event has no domains', () => {
  const event = mockEvent({ domains: [] }).toObject();
  const { container } = render(
    <MemoryRouter>
      <EventCard event={event} />
    </MemoryRouter>
  );

  const domains = container.querySelector(`.${styles.domains}`);
  expect(domains).toBeNull();
});
