import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { Slot, type SlotRegistry, type Aspect } from '@bitdev/harmony.harmony';
import { LibraryWorkspace } from '@helemclub/editorial.pages.library-workspace';
import { DraftEditor } from '@helemclub/editorial.pages.draft-editor';
import { VersionHistory } from '@helemclub/editorial.pages.version-history';
import { ReviewQueue } from '@helemclub/editorial.admin.review-queue';
import { EditorialDashboard } from '@helemclub/editorial.admin.editorial-dashboard';
import type { EditorialConfig } from './editorial-config.js';
import type { ContentTypeUi, ContentTypeInfo, DraftAction } from './content-type.js';

export type ContentTypeSlot = SlotRegistry<ContentTypeUi[]>;
export type DraftActionSlot = SlotRegistry<DraftAction[]>;

/**
 * the browser runtime of the editorial library. it registers the writer
 * workspace, the draft editor and the version history as platform routes,
 * plus the moderator review queue and the editorial dashboard as admin
 * panels. features register their content types here — the library never
 * imports a feature aspect.
 */
export class EditorialBrowser {
  constructor(
    private config: EditorialConfig,
    private contentTypeSlot: ContentTypeSlot,
    private draftActionSlot: DraftActionSlot
  ) {}

  /**
   * registers a content type with its Hebrew label and editor component.
   */
  registerContentType(contentType: ContentTypeUi | ContentTypeUi[]) {
    this.contentTypeSlot.register(Array.isArray(contentType) ? contentType : [contentType]);
    return this;
  }

  /**
   * registers an extra action shown alongside a draft.
   */
  registerDraftAction(action: DraftAction | DraftAction[]) {
    this.draftActionSlot.register(Array.isArray(action) ? action : [action]);
    return this;
  }

  /**
   * every content type registered by feature aspects.
   */
  listContentTypes(): ContentTypeInfo[] {
    return this.contentTypeSlot.flatValues().map((item) => ({
      contentType: item.contentType,
      label: item.label,
      fields: item.fields,
    }));
  }

  /**
   * the full registration of a single content type, including its editor.
   */
  getContentType(contentType: string): ContentTypeUi | undefined {
    return this.contentTypeSlot.flatValues().find((item) => item.contentType === contentType);
  }

  static dependencies: Aspect[] = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: EditorialConfig = {};

  static slots = [Slot.withType<ContentTypeUi[]>(), Slot.withType<DraftAction[]>()];

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: EditorialConfig,
    [contentTypeSlot, draftActionSlot]: [ContentTypeSlot, DraftActionSlot]
  ) {
    const editorial = new EditorialBrowser(config, contentTypeSlot, draftActionSlot);

    /**
     * the workspace, wired to the content types features registered.
     */
    const LibraryWorkspaceRoute = () => (
      <LibraryWorkspace contentTypes={editorial.listContentTypes()} />
    );

    /**
     * the editor, injecting the editor component of the draft's content
     * type when one was registered.
     */
    const DraftEditorRoute = () => <DraftEditor />;

    helamPlatform.registerRoute([
      { path: '/library', component: LibraryWorkspaceRoute, requiresAuth: true },
      { path: '/library/draft/:id', component: DraftEditorRoute, requiresAuth: true },
      { path: '/library/draft/:id/history', component: VersionHistory, requiresAuth: true },
    ]);

    // "ספריית הידע" בניווט שייכת ל-knowledge-base (תוכן שפורסם).
    // שכבת העריכה היא מרחב העבודה של הכותבים, ולכן מקבלת שם נפרד.
    helamPlatform.registerNavigationItem([
      { label: 'הכתיבה שלי', href: '/library', order: 40 },
    ]);

    helamPlatform.registerAdminRoute([
      { path: 'review-queue', label: 'תור ביקורת', component: ReviewQueue },
      { path: 'editorial', label: 'לוח עריכה', component: EditorialDashboard },
    ]);

    return editorial;
  }
}

export default EditorialBrowser;
