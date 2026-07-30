import { v4 as uuid } from 'uuid';
import { Rsvp, type PlainRsvp } from './rsvp.js';

/**
 * create a single mock Rsvp, with optional property overrides.
 */
export function mockRsvp(overrides: Partial<PlainRsvp> = {}): Rsvp {
  return Rsvp.from({
    id: uuid(),
    eventId: uuid(),
    userId: uuid(),
    attending: true,
    createdAt: new Date('2024-05-01T09:00:00.000Z').toISOString(),
    ...overrides,
  });
}

/**
 * create a list of mock Rsvp entities for development and testing.
 */
export function mockRsvps(): Rsvp[] {
  return [
    mockRsvp({
      attending: true,
      createdAt: new Date('2024-05-01T09:00:00.000Z').toISOString(),
    }),
    mockRsvp({
      attending: false,
      createdAt: new Date('2024-05-02T14:30:00.000Z').toISOString(),
    }),
    mockRsvp({
      attending: true,
      createdAt: new Date('2024-05-03T11:15:00.000Z').toISOString(),
    }),
  ];
}
