import { Domain } from './domain.js';
import { mockDomains, mockDomain } from './domain.mock.js';

it('has a Domain.from() method', () => {
  expect(Domain.from).toBeTruthy();
});

it('should create a Domain instance from a plain object', () => {
  const domain = Domain.from({
    id: 'anxiety',
    slug: 'anxiety',
    name: 'חרדה',
    description: 'כלים להתמודדות עם חרדה.',
    icon: '😰',
    count: 5,
  });

  expect(domain).toBeInstanceOf(Domain);
  expect(domain.id).toEqual('anxiety');
  expect(domain.slug).toEqual('anxiety');
  expect(domain.name).toEqual('חרדה');
  expect(domain.count).toEqual(5);
});

it('should default count to 0 when missing', () => {
  const domain = Domain.from({
    id: 'x',
    slug: 'x',
    name: 'תחום',
  } as any);

  expect(domain.count).toEqual(0);
});

it('should serialize a Domain into a plain object with toObject()', () => {
  const domain = Domain.from({
    id: 'sleep',
    slug: 'sleep',
    name: 'שינה',
    description: 'נדודי שינה וכלים להירדמות.',
    icon: '🌙',
    count: 4,
  });

  const plainObject = domain.toObject();

  expect(plainObject).toEqual({
    id: 'sleep',
    slug: 'sleep',
    name: 'שינה',
    description: 'נדודי שינה וכלים להירדמות.',
    icon: '🌙',
    count: 4,
  });
});

it('should return 14 mocked coping domains via mockDomains()', () => {
  const domains = mockDomains();

  expect(domains.length).toEqual(14);
  domains.forEach((domain) => {
    expect(domain).toBeInstanceOf(Domain);
    expect(domain.id).toBeTruthy();
    expect(domain.name).toBeTruthy();
  });
});

it('should support partial overrides in mockDomains()', () => {
  const domains = mockDomains([{ count: 99 }]);

  expect(domains[0].count).toEqual(99);
  expect(domains[1].count).not.toEqual(99);
});

it('should return a single mocked domain via mockDomain()', () => {
  const domain = mockDomain({ name: 'תחום מותאם' });

  expect(domain).toBeInstanceOf(Domain);
  expect(domain.name).toEqual('תחום מותאם');
});
