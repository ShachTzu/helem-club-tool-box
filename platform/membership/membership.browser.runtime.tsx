import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { ApproveMembers } from '@helemclub/platform.admin.approve-members';
import type { MembershipConfig } from './membership-config.js';

export class MembershipBrowser {
  constructor(
    private membershipConfig: MembershipConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: MembershipConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: MembershipConfig
  ) {
    const membership = new MembershipBrowser(config, symphonyPlatform, helamPlatform);

    /**
     * the new-member approval queue, mounted inside the platform admin
     * dashboard. the panel itself re-checks the admin role server-side on
     * every query — the route registration is navigation, not authorization.
     */
    helamPlatform.registerAdminRoute([
      {
        path: '/admin/members',
        label: 'אישור חברי קהילה',
        component: () => <ApproveMembers />,
      },
    ]);

    return membership;
  }
}

export default MembershipBrowser;
