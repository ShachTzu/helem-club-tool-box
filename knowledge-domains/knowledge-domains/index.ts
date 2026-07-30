import { KnowledgeDomainsAspect } from './knowledge-domains.aspect.js';

export type { KnowledgeDomainsConfig } from './knowledge-domains-config.js';
export type {
  TaggedContent,
  DomainTag,
  GetContentByDomainOptions,
  GetContentDomainsOptions,
  TagContentOptions,
} from './domain-types.js';
export type { KnowledgeDomainsNode } from './knowledge-domains.node.runtime.js';
export type { KnowledgeDomainsBrowser } from './knowledge-domains.browser.runtime.js';

export default KnowledgeDomainsAspect;
export { KnowledgeDomainsAspect };
