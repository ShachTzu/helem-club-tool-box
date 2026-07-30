import { SearchResult } from './search-result.js';
import { mockSearchResult, mockSearchResults } from './search-result.mock.js';

it('has a SearchResult.from() method', () => {
  expect(SearchResult.from).toBeTruthy();
});

it('should create a SearchResult instance from a plain object', () => {
  const result = SearchResult.from({
    id: '1',
    type: 'app',
    title: 'נשימה 4-7-8',
    url: '/apps/breathing-478',
  });

  expect(result).toBeInstanceOf(SearchResult);
  expect(result.id).toEqual('1');
  expect(result.type).toEqual('app');
  expect(result.title).toEqual('נשימה 4-7-8');
  expect(result.url).toEqual('/apps/breathing-478');
  expect(result.excerpt).toBeUndefined();
  expect(result.imageUrl).toBeUndefined();
  expect(result.domains).toBeUndefined();
});

it('should serialize a SearchResult into a plain object with toObject()', () => {
  const result = SearchResult.from({
    id: '2',
    type: 'blog',
    title: 'כותרת',
    excerpt: 'תקציר',
    url: '/blog/post',
    imageUrl: 'https://example.com/img.png',
    domains: ['חרדה'],
  });

  expect(result.toObject()).toEqual({
    id: '2',
    type: 'blog',
    title: 'כותרת',
    excerpt: 'תקציר',
    url: '/blog/post',
    imageUrl: 'https://example.com/img.png',
    domains: ['חרדה'],
  });
});

it('should return an id property from toObject()', () => {
  const result = mockSearchResult({ id: 'my-id' });
  expect(result.toObject().id).toEqual('my-id');
});

it('mockSearchResult() should support partial overrides', () => {
  const result = mockSearchResult({ title: 'כותרת מותאמת אישית' });
  expect(result.title).toEqual('כותרת מותאמת אישית');
});

it('mockSearchResults() should return a list of SearchResult instances', () => {
  const results = mockSearchResults();
  expect(results.length).toBeGreaterThan(0);
  results.forEach((result) => {
    expect(result).toBeInstanceOf(SearchResult);
  });
});
