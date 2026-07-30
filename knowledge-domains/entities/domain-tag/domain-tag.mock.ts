import { v4 as uuidv4 } from 'uuid';
import { DomainTag, type PlainDomainTag } from './domain-tag.js';

/**
 * create a single mock DomainTag, optionally overriding any of its properties.
 */
export function mockDomainTag(overrides: Partial<PlainDomainTag> = {}) {
  return DomainTag.from({
    id: uuidv4(),
    domainId: 'triggers',
    targetType: 'post',
    targetId: 'triggers-toolkit',
    ...overrides,
  });
}

/**
 * create a list of mock DomainTag entities representing common ecosystem associations.
 */
export function mockDomainTags() {
  return [
    mockDomainTag({
      domainId: 'triggers',
      targetType: 'post',
      targetId: 'triggers-toolkit',
    }),
    mockDomainTag({
      domainId: 'anxiety',
      targetType: 'record',
      targetId: 'panic-breathing',
    }),
    mockDomainTag({
      domainId: 'sleep',
      targetType: 'event',
      targetId: 'webinar-sleep',
    }),
    mockDomainTag({
      domainId: 'emotional-regulation',
      targetType: 'gallery',
      targetId: 'g1',
    }),
    mockDomainTag({
      domainId: 'family-relationships',
      targetType: 'app',
      targetId: 'app-1',
    }),
  ];
}
