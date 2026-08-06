import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import type { KnowledgeLibraryConfig } from './knowledge-library-config.js';

/**
 * public pages, admin routes and nav registration land here once the page
 * and admin components exist (see docs/superpowers/specs/2026-08-06-knowledge-library-design.md,
 * "Public site" and "Admin capabilities" sections) — this is the same
 * registration pattern knowledge-base.browser.runtime.tsx uses.
 */
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

    return knowledgeLibrary;
  }
}

export default KnowledgeLibraryBrowser;
