import { DomainTag } from './domain-tag.js';
import { mockDomainTag, mockDomainTags } from './domain-tag.mock.js';

it('has a DomainTag.from() method', () => {
  expect(DomainTag.from).toBeTruthy();
});

it('should create a DomainTag from a plain object', () => {
  const tag = DomainTag.from({
    id: 'tag-1',
    domainId: 'anxiety',
    targetType: 'post',
    targetId: 'post-1',
  });

  expect(tag).toBeInstanceOf(DomainTag);
  expect(tag.id).toEqual('tag-1');
  expect(tag.domainId).toEqual('anxiety');
  expect(tag.targetType).toEqual('post');
  expect(tag.targetId).toEqual('post-1');
});

it('should serialize a DomainTag into a plain object via toObject()', () => {
  const tag = DomainTag.from({
    id: 'tag-2',
    domainId: 'sleep',
    targetType: 'event',
    targetId: 'event-1',
  });

  const plainObject = tag.toObject();

  expect(plainObject).toEqual({
    id: 'tag-2',
    domainId: 'sleep',
    targetType: 'event',
    targetId: 'event-1',
  });
});

it('should default missing properties safely when creating from a partial object', () => {
  const tag = DomainTag.from({ id: 'tag-3' } as any);

  expect(tag.domainId).toEqual('');
  expect(tag.targetType).toEqual('');
  expect(tag.targetId).toEqual('');
});

it('mockDomainTag() should create a DomainTag with default values', () => {
  const tag = mockDomainTag();

  expect(tag).toBeInstanceOf(DomainTag);
  expect(tag.id).toBeTruthy();
  expect(tag.domainId).toEqual('triggers');
});

it('mockDomainTag() should support overriding properties', () => {
  const tag = mockDomainTag({ domainId: 'custom-domain', targetType: 'app' });

  expect(tag.domainId).toEqual('custom-domain');
  expect(tag.targetType).toEqual('app');
});

it('mockDomainTags() should return a list of DomainTag instances', () => {
  const tags = mockDomainTags();

  expect(tags.length).toBeGreaterThan(0);
  tags.forEach((tag) => {
    expect(tag).toBeInstanceOf(DomainTag);
    expect(tag.id).toBeTruthy();
  });
});
