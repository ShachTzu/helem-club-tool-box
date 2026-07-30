import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { ManageDomains } from '@helemclub/knowledge-domains.admin.manage-domains';
import { DomainsLobby } from '@helemclub/knowledge-domains.pages.domains-lobby';
import { WisdomPage } from '@helemclub/knowledge-domains.pages.wisdom-page';
import { CommunityWisdom } from '@helemclub/knowledge-domains.ui.community-wisdom';
import type { KnowledgeDomainsConfig } from './knowledge-domains-config.js';

export class KnowledgeDomainsBrowser {
  constructor(
    private knowledgeDomainsConfig: KnowledgeDomainsConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  /**
   * returns the configuration for the knowledge-domains aspect.
   */
  getConfig(): KnowledgeDomainsConfig {
    return this.knowledgeDomainsConfig;
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: KnowledgeDomainsConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: KnowledgeDomainsConfig
  ) {
    const knowledgeDomains = new KnowledgeDomainsBrowser(config, symphonyPlatform, helamPlatform);

    /**
     * mount the community-wisdom hub and the domains-lobby (list + per-domain
     * feed) as platform routes.
     */
    helamPlatform.registerRoute([
      {
        path: '/wisdom',
        component: () => <WisdomPage />,
      },
      {
        path: '/domains',
        component: () => <DomainsLobby />,
      },
      {
        path: '/domains/:slug',
        component: () => <DomainsLobby />,
      },
    ]);

    /**
     * expose the two primary discovery surfaces in the header/mobile nav.
     */
    helamPlatform.registerNavigationItem([
      {
        label: 'חוכמת הקהילה',
        href: '/wisdom',
        order: 20,
      },
      {
        label: 'תחומי התמודדות',
        href: '/domains',
        order: 30,
      },
    ]);

    /**
     * embed the community-wisdom hub on the home page as the central unified
     * knowledge feed (compact mode, with a "see all" CTA to /wisdom).
     */
    helamPlatform.registerHomeSection({
      id: 'community-wisdom',
      order: 10,
      component: () => <CommunityWisdom compact />,
    });

    /**
     * add the domains CRUD panel to the admin dashboard.
     */
    helamPlatform.registerAdminRoute([
      {
        path: 'domains',
        label: 'ניהול תחומי התמודדות',
        component: () => <ManageDomains />,
      },
    ]);

    return knowledgeDomains;
  }
}

export default KnowledgeDomainsBrowser;
