import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { KnowledgeLibraryLobby } from '@helemclub/knowledge-library.pages.knowledge-library-lobby';
import { KnowledgeLibraryPage } from '@helemclub/knowledge-library.pages.knowledge-library-page';
import { ManageKnowledgeLibrary } from '@helemclub/knowledge-library.admin.manage-knowledge-library';
import type { KnowledgeLibraryConfig } from './knowledge-library-config.js';

export class KnowledgeLibraryBrowser {
  constructor(
    private config: KnowledgeLibraryConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: KnowledgeLibraryConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: KnowledgeLibraryConfig
  ) {
    const knowledgeLibrary = new KnowledgeLibraryBrowser(config, symphonyPlatform, helamPlatform);

    /**
     * public routes. the generic :slug route is registered after the fixed
     * lobby path so `/knowledge-library` itself is matched first.
     */
    helamPlatform.registerRoute([
      {
        path: '/knowledge-library',
        component: () => <KnowledgeLibraryLobby />,
      },
      {
        path: '/knowledge-library/:slug',
        component: () => <KnowledgeLibraryPage />,
      },
    ]);

    helamPlatform.registerNavigationItem([
      {
        label: 'ספריית הידע',
        href: '/knowledge-library',
        order: 35,
      },
    ]);

    helamPlatform.registerAdminRoute([
      {
        path: 'knowledge-library',
        label: 'ניהול ספריית הידע',
        component: () => <ManageKnowledgeLibrary />,
      },
    ]);

    return knowledgeLibrary;
  }
}

export default KnowledgeLibraryBrowser;
