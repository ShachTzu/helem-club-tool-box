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
import { useOnboarding } from '@helemclub/platform.hooks.use-onboarding';
import type { ToolboxConfig } from './toolbox-config.js';

function AppDetailRoute() {
  const { slug } = useParams<{ slug: string }>();
  return <AppDetail slug={slug} />;
}

/**
 * keeps the submit form out of reach for accounts that are signed in but not
 * approved community members, and tells them where they stand instead of
 * letting them fill in a whole form only to be refused at the end.
 *
 * this is courtesy, not security — `submitToolboxApp` re-checks membership
 * server-side (`requireMember`), which is what actually enforces it.
 */
function MemberOnlySubmit() {
  const { status, loading } = useOnboarding();

  if (loading) return null;
  if (status === 'approved') return <SubmitTool />;

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '64px 20px', textAlign: 'center' }}>
      <div style={{ fontSize: 44, marginBottom: 16 }}>{status === 'none' ? '📝' : '⏳'}</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 12px' }}>
        {status === 'none' ? 'רגע לפני שמגישים' : 'הבקשה שלך ממתינה לאישור'}
      </h1>
      <p style={{ fontSize: 15, lineHeight: 1.7, margin: '0 0 24px', color: '#6b7c8f' }}>
        {status === 'none'
          ? 'כדי להגיש כלי לארגז הכלים צריך להיות חבר.ת קהילה. זה מתחיל במילוי פרטי ההצטרפות — לוקח כמה דקות.'
          : 'צוות הקהילה בודק את הבקשה שלך להצטרף. נעדכן אותך במייל ברגע שהיא תאושר, ואז אפשר יהיה להגיש כלים.'}
      </p>
      {status === 'none' && (
        <a
          href="/onboarding"
          style={{
            display: 'inline-block',
            padding: '12px 28px',
            borderRadius: 999,
            background: '#4f6d7a',
            color: '#fff',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          למילוי הפרטים
        </a>
      )}
    </div>
  );
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
        component: () => <MemberOnlySubmit />,
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
