import { Event } from './event.js';
import { mockEvent, mockEvents } from './event.mock.js';

it('has an Event.from() method', () => {
  expect(Event.from).toBeTruthy();
});

it('creates an Event instance from a plain object', () => {
  const event = Event.from({
    id: '1',
    slug: 'webinar-sleep',
    title: 'וובינר: שינה וטראומה',
    description: 'הרצאה מקצועית על הקשר בין פוסט-טראומה להפרעות שינה.',
    type: 'webinar',
    startAt: '2026-06-18T20:30:00.000Z',
    isOnline: true,
    domains: ['שינה', 'חרדה'],
    rsvpCount: 10,
  });

  expect(event).toBeInstanceOf(Event);
  expect(event.id).toBe('1');
  expect(event.slug).toBe('webinar-sleep');
  expect(event.type).toBe('webinar');
  expect(event.isOnline).toBe(true);
  expect(event.domains).toEqual(['שינה', 'חרדה']);
});

it('serializes an Event into a plain object with toObject()', () => {
  const event = mockEvent();
  const plainEvent = event.toObject();

  expect(plainEvent.id).toBe(event.id);
  expect(plainEvent.slug).toBe(event.slug);
  expect(plainEvent.title).toBe(event.title);
  expect(plainEvent.type).toBe(event.type);
  expect(plainEvent.domains).toEqual(event.domains);
});

it('supports partial overrides in mockEvent()', () => {
  const event = mockEvent({ title: 'כותרת מותאמת אישית', rsvpCount: 99 });

  expect(event.title).toBe('כותרת מותאמת אישית');
  expect(event.rsvpCount).toBe(99);
});

it('creates a list of mock events with mockEvents()', () => {
  const events = mockEvents();

  expect(events.length).toBeGreaterThan(0);
  events.forEach((event) => {
    expect(event).toBeInstanceOf(Event);
  });
});

it('computes isPast based on the event dates', () => {
  const pastEvent = mockEvent({
    startAt: '2000-01-01T00:00:00.000Z',
    endAt: '2000-01-01T02:00:00.000Z',
  });
  const futureEvent = mockEvent({
    startAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    endAt: undefined,
  });

  expect(pastEvent.isPast).toBe(true);
  expect(futureEvent.isPast).toBe(false);
});

it('computes hasRecording based on recordingRecordId', () => {
  const withRecording = mockEvent({ recordingRecordId: 'life-after-panel' });
  const withoutRecording = mockEvent({ recordingRecordId: undefined });

  expect(withRecording.hasRecording).toBe(true);
  expect(withoutRecording.hasRecording).toBe(false);
});
