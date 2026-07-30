import { KnowledgeBaseAspect } from './knowledge-base.aspect.js';

export type { KnowledgeBaseConfig } from './knowledge-base-config.js';
export type {
  ListRecordsOptions,
  CreateRecordOptions,
  UpdateRecordOptions,
  UpsertLabelOptions,
} from './media-record-options.js';

export type { KnowledgeBaseNode, PlainKnowledgeBaseLabel } from './knowledge-base.node.runtime.js';
export type { KnowledgeBaseBrowser } from './knowledge-base.browser.runtime.js';

export default KnowledgeBaseAspect;
export { KnowledgeBaseAspect };
