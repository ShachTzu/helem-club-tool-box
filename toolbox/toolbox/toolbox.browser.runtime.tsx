import React from 'react';
import { useParams } from 'react-router-dom';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { ToolboxCatalog } from '@helemclub/toolbox.pages.toolbox-catalog';
import { AppDetail } from '@helemclub/toolbox.pages.app-detail';
import { SubmitTool } from '@helemclub/toolbox.pages.submit-tool';
import { MySubmissions } from '@helemclub/toolbox.pages.my-submissions';
import { Wishlist } from '@helemclub/toolbox.pages.wishlist';
import { ManageApps } from '@helemclub/toolbox.admin.manage-apps';
import { ReviewSubmissions } from '@helemclub/toolbox.admin.review-submissions';
import type { ToolboxConfig } from './toolbox-config.js';

function AppDetailRoute() {
  const { slug } = useParams<{ slug: string }>();
  return <AppDetail slug={slug} />;
}

export class ToolboxBrowser {
  constructor(
    private toolboxConfig: ToolboxConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: ToolboxConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: ToolboxConfig
  ) {
    const toolbox = new ToolboxBrowser(config, symphonyPlatform, helamPlatform);

    /**
     * mount the toolbox feature pages as platform routes. the catalog and app
     * detail pages are public; submitting a tool requires authentication.
     */
    helamPlatform.registerRoute([
      {
        path: '/toolbox',
        component: () => <ToolboxCatalog />,
      },
      {
        path: '/toolbox/submit',
        component: () => <SubmitTool />,
        requiresAuth: true,
      },
      {
        path: '/toolbox/my-submissions',
        component: () => <MySubmissions />,
        requiresAuth: true,
      },
      {
        path: '/toolbox/wishlist',
        component: () => <Wishlist />,
      },
      {
        path: '/toolbox/:slug',
        component: () => <AppDetailRoute />,
      },
    ]);

    /**
     * register the moderation panels inside the platform admin dashboard.
     */
    helamPlatform.registerAdminRoute([
      {
        path: '/admin/toolbox',
        label: 'ניהול אפליקציות',
        component: () => <ManageApps />,
      },
      {
        path: '/admin/toolbox/submissions',
        label: 'אישור הגשות',
        component: () => <ReviewSubmissions />,
      },
    ]);

    /**
     * add the primary navigation entry pointing to the toolbox catalog.
     */
    helamPlatform.registerNavigationItem([
      {
        label: 'ארגז כלים',
        href: '/toolbox',
        order: 20,
      },
      {
        label: 'ההגשות שלי',
        href: '/toolbox/my-submissions',
        order: 25,
      },
    ]);

    return toolbox;
  }
}

export default ToolboxBrowser;
