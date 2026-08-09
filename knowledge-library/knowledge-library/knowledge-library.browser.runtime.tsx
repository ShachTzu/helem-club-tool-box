import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { KnowledgeLibraryLobby } from '@helemclub/knowledge-library.pages.knowledge-library-lobby';
import { KnowledgeLibraryPage } from '@helemclub/knowledge-library.pages.knowledge-library-page';
import { ManageKnowledgeLibrary } from '@helemclub/knowledge-library.admin.manage-knowledge-library';
import { LegacyKnowledgeRedirect } from './legacy-knowledge-redirect.js';
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
    /**
     * ALL of this aspect's routes must go in a SINGLE registerRoute call.
     * The platform's route slot is keyed by aspect id, so a second call from
     * the same aspect REPLACES the first rather than appending to it — which
     * silently 404s whatever the earlier call registered.
     *
     * The trailing /knowledge* entries are mail-forwarding for the retired
     * knowledge-base scope: links to those URLs still exist elsewhere (notably
     * the community-wisdom feed, owned by knowledge-domains and deliberately
     * out of this feature's scope). Forwarding from the scope that absorbed
     * that content keeps them working without editing a feature this one does
     * not own. See LegacyKnowledgeRedirect for why it isn't <Navigate>.
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
      { path: '/knowledge', component: () => <LegacyKnowledgeRedirect /> },
      { path: '/knowledge/record/:slug', component: () => <LegacyKnowledgeRedirect /> },
      { path: '/knowledge/:labelSlug', component: () => <LegacyKnowledgeRedirect /> },
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
