import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { ModerationQueue } from '@helemclub/engagement.admin.moderation-queue';
import { Saved } from '@helemclub/engagement.pages.saved';
import type { EngagementConfig } from './engagement-config.js';

export class EngagementBrowser {
  constructor(
    private engagementConfig: EngagementConfig,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  /**
   * get the engagement aspect configuration.
   */
  getConfig(): EngagementConfig {
    return this.engagementConfig;
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: EngagementConfig = {};

  static async provider(
    [, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: EngagementConfig
  ) {
    const engagement = new EngagementBrowser(config, helamPlatform);

    /**
     * saved-for-later page — requires an authenticated session.
     */
    helamPlatform.registerRoute([
      {
        path: '/saved',
        component: () => <Saved />,
        requiresAuth: true,
      },
    ]);

    /**
     * moderation queue mounted inside the admin dashboard at /admin/moderation.
     */
    helamPlatform.registerAdminRoute([
      {
        path: 'moderation',
        label: 'תור מודרציה',
        component: () => <ModerationQueue />,
      },
    ]);

    return engagement;
  }
}

export default EngagementBrowser;
