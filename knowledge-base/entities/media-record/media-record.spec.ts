import { MediaRecord } from './media-record.js';
import { mockMediaRecord, mockMediaRecords } from './media-record.mock.js';

it('has a MediaRecord.from() method', () => {
  expect(MediaRecord.from).toBeTruthy();
});

it('should create a MediaRecord from a plain object', () => {
  const record = MediaRecord.from({
    id: '1',
    slug: 'grounding-flashbacks',
    labelId: 'first-aid',
    title: 'קרקוע ברגע של פלאשבק',
    mediaType: 'video',
    mediaUrl: 'https://example.com/media/grounding-flashbacks.mp4',
    domains: ['טריגרים'],
    viewCount: 10,
    publishedAt: '2026-03-01T09:00:00.000Z',
  });

  expect(record).toBeInstanceOf(MediaRecord);
  expect(record.id).toEqual('1');
  expect(record.title).toEqual('קרקוע ברגע של פלאשבק');
});

it('should default optional array/number fields when missing', () => {
  const record = MediaRecord.from({
    id: '2',
    slug: 'panic-breathing',
    labelId: 'first-aid',
    title: 'נשימה בזמן התקף חרדה',
    mediaType: 'audio',
    mediaUrl: 'https://example.com/media/panic-breathing.mp3',
    publishedAt: '2026-02-18T09:00:00.000Z',
  } as any);

  expect(record.domains).toEqual([]);
  expect(record.viewCount).toEqual(0);
});

it('should serialize a MediaRecord into a plain object', () => {
  const record = mockMediaRecord();
  const plainObject = record.toObject();

  expect(plainObject.id).toEqual(record.id);
  expect(plainObject.slug).toEqual(record.slug);
  expect(plainObject.mediaType).toEqual(record.mediaType);
  expect(plainObject.domains).toEqual(record.domains);
});

it('should expose isVideo/isAudio helpers', () => {
  const video = mockMediaRecord({ mediaType: 'video' });
  const audio = mockMediaRecord({ mediaType: 'audio' });

  expect(video.isVideo).toBe(true);
  expect(video.isAudio).toBe(false);
  expect(audio.isAudio).toBe(true);
  expect(audio.isVideo).toBe(false);
});

it('should format the duration as mm:ss', () => {
  const record = mockMediaRecord({ durationSec: 504 });
  expect(record.formattedDuration).toEqual('8:24');
});

it('should format the duration with hours when needed', () => {
  const record = mockMediaRecord({ durationSec: 3730 });
  expect(record.formattedDuration).toEqual('1:02:10');
});

it('should return undefined duration when durationSec is not set', () => {
  const record = mockMediaRecord({ durationSec: undefined });
  expect(record.formattedDuration).toBeUndefined();
});

it('mockMediaRecords() should return a list of MediaRecord instances', () => {
  const records = mockMediaRecords();
  expect(records.length).toBeGreaterThan(0);
  records.forEach((record) => expect(record).toBeInstanceOf(MediaRecord));
});
