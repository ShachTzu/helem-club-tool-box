import { KnowledgeLibraryAspect } from './knowledge-library.aspect.js';

export type { KnowledgeLibraryConfig } from './knowledge-library-config.js';
export type {
  PlainKnowledgePage,
  ListPagesOptions,
  CreatePageOptions,
  UpdatePageOptions,
} from './knowledge-page-options.js';
export { HELEM_CLUB_AUTHOR_NAME, HELEM_CLUB_AVATAR_URL } from './knowledge-page-options.js';

export type { KnowledgeLibraryBrowser } from './knowledge-library.browser.runtime.js';
export type { KnowledgeLibraryNode } from './knowledge-library.node.runtime.js';

export default KnowledgeLibraryAspect;
export { KnowledgeLibraryAspect };
