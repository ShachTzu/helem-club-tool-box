import { GalleryItem } from './gallery-item.js';
import { mockGalleryItem, mockGalleryItems } from './gallery-item.mock.js';

it('has a GalleryItem.from() method', () => {
  expect(GalleryItem.from).toBeTruthy();
});

it('creates a GalleryItem from a plain object', () => {
  const item = GalleryItem.from({
    id: '1',
    slug: 'quiet-after-the-storm',
    title: 'שקט אחרי הסערה',
    mediaType: 'image',
    mediaUrl: 'https://example.com/image.png',
    domains: ['ויסות רגשי'],
    createdAt: '2026-01-12T09:00:00.000Z',
  });

  expect(item.id).toEqual('1');
  expect(item.slug).toEqual('quiet-after-the-storm');
  expect(item.mediaType).toEqual('image');
  expect(item.domains).toEqual(['ויסות רגשי']);
});

it('defaults domains to an empty array when missing', () => {
  const item = GalleryItem.from({
    id: '2',
    slug: 'no-domains',
    title: 'No Domains',
    mediaType: 'video',
    mediaUrl: 'https://example.com/video.mp4',
    createdAt: '2026-01-12T09:00:00.000Z',
  } as any);

  expect(item.domains).toEqual([]);
});

it('serializes a GalleryItem into a plain object with toObject()', () => {
  const item = mockGalleryItem();
  const plain = item.toObject();

  expect(plain.id).toEqual(item.id);
  expect(plain.slug).toEqual(item.slug);
  expect(plain.title).toEqual(item.title);
  expect(plain.mediaType).toEqual(item.mediaType);
  expect(plain.mediaUrl).toEqual(item.mediaUrl);
  expect(plain.domains).toEqual(item.domains);
  expect(plain.createdAt).toEqual(item.createdAt);
});

it('mockGalleryItem() supports partial overrides', () => {
  const item = mockGalleryItem({ title: 'Custom Title', mediaType: 'video' });

  expect(item.title).toEqual('Custom Title');
  expect(item.mediaType).toEqual('video');
});

it('mockGalleryItems() returns a list of GalleryItem instances with unique ids', () => {
  const items = mockGalleryItems();

  expect(items.length).toEqual(3);
  items.forEach((item) => expect(item).toBeInstanceOf(GalleryItem));

  const ids = items.map((item) => item.id);
  expect(new Set(ids).size).toEqual(ids.length);
});
