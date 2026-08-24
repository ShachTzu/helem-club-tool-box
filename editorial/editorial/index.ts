import { EditorialAspect } from './editorial.aspect.js';

export type { EditorialConfig } from './editorial-config.js';
export type {
  ContentTypeUi,
  ContentTypeInfo,
  ContentTypeFieldInfo,
  PublishHandler,
  PublishableDraft,
  DraftAction,
} from './content-type.js';
export type { EditorialBrowser } from './editorial.browser.runtime.js';
export type {
  EditorialNode,
  LibraryUser,
  SaveDraftInput,
  ReviewOptions,
} from './editorial.node.runtime.js';

export default EditorialAspect;
export { EditorialAspect };
