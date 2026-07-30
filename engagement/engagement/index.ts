import { EngagementAspect } from './engagement.aspect.js';

export type { EngagementConfig } from './engagement-config.js';
export type {
  AddCommentInput,
  ListCommentsInput,
  ReportCommentInput,
  ReactionInput,
  GetReactionsInput,
  ResolveReportInput,
  ReactionCount,
  ReactionSummary,
  ReportResult,
} from './engagement-options.js';

export type { EngagementNode } from './engagement.node.runtime.js';
export type { EngagementBrowser } from './engagement.browser.runtime.js';

export default EngagementAspect;
export { EngagementAspect };
