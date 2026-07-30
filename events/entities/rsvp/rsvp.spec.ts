import { Rsvp } from './rsvp.js';
import { mockRsvp, mockRsvps } from './rsvp.mock.js';

it('has a Rsvp.from() method', () => {
  expect(Rsvp.from).toBeTruthy();
});

it('should create an Rsvp instance from a plain object', () => {
  const rsvp = Rsvp.from({
    id: 'rsvp-1',
    eventId: 'event-1',
    userId: 'user-1',
    attending: true,
    createdAt: '2024-05-01T09:00:00.000Z',
  });

  expect(rsvp).toBeInstanceOf(Rsvp);
  expect(rsvp.id).toEqual('rsvp-1');
  expect(rsvp.eventId).toEqual('event-1');
  expect(rsvp.userId).toEqual('user-1');
  expect(rsvp.attending).toEqual(true);
  expect(rsvp.createdAt).toEqual('2024-05-01T09:00:00.000Z');
});

it('should serialize an Rsvp instance back into a plain object', () => {
  const plainRsvp = {
    id: 'rsvp-2',
    eventId: 'event-2',
    userId: 'user-2',
    attending: false,
    createdAt: '2024-05-02T09:00:00.000Z',
  };
  const rsvp = Rsvp.from(plainRsvp);

  expect(rsvp.toObject()).toEqual(plainRsvp);
});

it('should default attending and createdAt when not provided', () => {
  const rsvp = Rsvp.from({ id: 'rsvp-3', eventId: 'event-3', userId: 'user-3' } as any);

  expect(rsvp.attending).toEqual(false);
  expect(typeof rsvp.createdAt).toEqual('string');
});

it('should generate a mock Rsvp with the mockRsvp() factory', () => {
  const rsvp = mockRsvp();

  expect(rsvp).toBeInstanceOf(Rsvp);
  expect(rsvp.id).toBeTruthy();
  expect(rsvp.eventId).toBeTruthy();
});

it('should allow overriding properties in mockRsvp()', () => {
  const rsvp = mockRsvp({ attending: false, userId: 'user-42' });

  expect(rsvp.attending).toEqual(false);
  expect(rsvp.userId).toEqual('user-42');
});

it('should generate a list of mock Rsvp entities with mockRsvps()', () => {
  const rsvps = mockRsvps();

  expect(rsvps).toHaveLength(3);
  rsvps.forEach((rsvp) => expect(rsvp).toBeInstanceOf(Rsvp));
});
