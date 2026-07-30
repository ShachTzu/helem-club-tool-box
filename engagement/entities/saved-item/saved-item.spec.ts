import { SavedItem } from './saved-item.js';
import { mockSavedItem, mockSavedItems } from './saved-item.mock.js';

it('has a SavedItem.from() method', () => {
  expect(SavedItem.from).toBeTruthy();
});

it('creates a SavedItem instance from a plain object', () => {
  const savedItem = SavedItem.from({
    id: 'saved-1',
    targetType: 'app',
    targetId: 'app-1',
    deviceId: 'device-1',
    savedAt: '2024-01-01T00:00:00.000Z',
    title: 'My App',
    url: '/toolbox/app-1',
    imageUrl: 'https://example.com/img.png',
  });

  expect(savedItem).toBeInstanceOf(SavedItem);
  expect(savedItem.id).toEqual('saved-1');
  expect(savedItem.targetType).toEqual('app');
  expect(savedItem.targetId).toEqual('app-1');
  expect(savedItem.deviceId).toEqual('device-1');
  expect(savedItem.savedAt).toEqual('2024-01-01T00:00:00.000Z');
  expect(savedItem.title).toEqual('My App');
  expect(savedItem.url).toEqual('/toolbox/app-1');
  expect(savedItem.imageUrl).toEqual('https://example.com/img.png');
});

it('fills in safe defaults for missing properties', () => {
  const savedItem = SavedItem.from({});

  expect(savedItem.id).toEqual('');
  expect(savedItem.targetType).toEqual('other');
  expect(savedItem.targetId).toEqual('');
  expect(savedItem.deviceId).toEqual('');
  expect(savedItem.title).toEqual('');
  expect(savedItem.url).toEqual('');
  expect(savedItem.imageUrl).toBeUndefined();
  expect(typeof savedItem.savedAt).toEqual('string');
});

it('serializes a SavedItem into a plain object with toObject()', () => {
  const savedItem = mockSavedItem({ id: 'saved-2' });
  const plain = savedItem.toObject();

  expect(plain.id).toEqual('saved-2');
  expect(plain).toEqual({
    id: savedItem.id,
    targetType: savedItem.targetType,
    targetId: savedItem.targetId,
    deviceId: savedItem.deviceId,
    savedAt: savedItem.savedAt,
    title: savedItem.title,
    url: savedItem.url,
    imageUrl: savedItem.imageUrl,
  });
});

it('mockSavedItems() returns a list of SavedItem instances', () => {
  const items = mockSavedItems();

  expect(items.length).toBeGreaterThan(0);
  items.forEach((item) => {
    expect(item).toBeInstanceOf(SavedItem);
    expect(item.id).toBeTruthy();
  });
});
