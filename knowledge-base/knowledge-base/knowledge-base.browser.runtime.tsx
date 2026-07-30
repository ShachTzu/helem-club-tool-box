import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { KnowledgeLobby } from '@helemclub/knowledge-base.pages.knowledge-lobby';
import { LabelLobby } from '@helemclub/knowledge-base.pages.label-lobby';
import { RecordPage } from '@helemclub/knowledge-base.pages.record-page';
import { ManageLabels } from '@helemclub/knowledge-base.admin.manage-labels';
import { ManageRecords } from '@helemclub/knowledge-base.admin.manage-records';
import { KnowledgePreview } from '@helemclub/knowledge-base.sections.knowledge-preview';
import type { KnowledgeBaseConfig } from './knowledge-base-config.js';

export class KnowledgeBaseBrowser {
  constructor(
    private knowledgeBaseConfig: KnowledgeBaseConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: KnowledgeBaseConfig
  ) {
    const knowledgeBase = new KnowledgeBaseBrowser(config, symphonyPlatform, helamPlatform);

    /**
     * feature routes. the record route is registered before the label route
     * so `/knowledge/record/:slug` is matched before `/knowledge/:labelSlug`.
     */
    helamPlatform.registerRoute([
      {
        path: '/knowledge',
        component: () => <KnowledgeLobby />,
      },
      {
        path: '/knowledge/record/:slug',
        component: () => <RecordPage />,
      },
      {
        path: '/knowledge/:labelSlug',
        component: () => <LabelLobby />,
      },
    ]);

    /**
     * primary navigation entry pointing to the knowledge lobby.
     */
    helamPlatform.registerNavigationItem([
      {
        label: 'מאגר ידע',
        href: '/knowledge',
        order: 30,
      },
    ]);

    /**
     * surface the knowledge base project labels on the home page as a preview
     * section with a "see all" link to the full knowledge base.
     */
    helamPlatform.registerHomeSection({
      id: 'knowledge-preview',
      order: 20,
      component: () => <KnowledgePreview />,
    });

    /**
     * admin panels mounted inside the platform's admin dashboard.
     */
    helamPlatform.registerAdminRoute([
      {
        path: 'knowledge-labels',
        label: 'ניהול פרויקטים',
        component: () => <ManageLabels />,
      },
      {
        path: 'knowledge-records',
        label: 'ניהול תכני מאגר הידע',
        component: () => <ManageRecords />,
      },
    ]);

    return knowledgeBase;
  }
}

export default KnowledgeBaseBrowser;
