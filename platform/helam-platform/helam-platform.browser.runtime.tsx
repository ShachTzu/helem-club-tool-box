import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { AppLayout } from '@helemclub/platform.layout.app-layout';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { Home } from '@helemclub/platform.pages.home';
import { Login } from '@helemclub/platform.pages.login';
import { Signup } from '@helemclub/platform.pages.signup';
import { OnboardingPage } from '@helemclub/platform.pages.onboarding-page';
import { ManageUsers } from '@helemclub/platform.admin.manage-users';
import { Profile } from '@helemclub/platform.pages.profile';
import { AdminDashboard } from '@helemclub/platform.pages.admin-dashboard';
import { PlanToProduction } from '@helemclub/platform.pages.plan-to-production';
import { NotFoundPage } from '@helemclub/platform.pages.not-found-page';
import type { HelamPlatformConfig } from './helam-platform-config.js';
import { Route, RouteSlot } from './route.js';
import { NavigationItem, NavigationItemSlot } from './navigation-item.js';
import { HeaderAction, HeaderActionSlot } from './header-action.js';
import { AdminRoute, AdminRouteSlot } from './admin-route.js';
import { FooterLink, FooterLinkSlot } from './footer-link.js';
import { HomeSection, HomeSectionSlot } from './home-section.js';
import { EcosystemPillar, EcosystemPillarSlot } from './ecosystem-pillar.js';
import { OnboardingGate } from './onboarding-gate.js';

export class HelamPlatformBrowser {
  constructor(
    private platformConfig: HelamPlatformConfig,
    private routeSlot: RouteSlot,
    private navigationItemSlot: NavigationItemSlot,
    private headerActionSlot: HeaderActionSlot,
    private adminRouteSlot: AdminRouteSlot,
    private footerLinkSlot: FooterLinkSlot,
    private homeSectionSlot: HomeSectionSlot,
    private ecosystemPillarSlot: EcosystemPillarSlot,
    private symphonyPlatform: SymphonyPlatformBrowser
  ) {}

  /**
   * register a feature page as an application route. forwards to the platform
   * router so the route is mounted, and keeps a copy in the slot for listing.
   */
  registerRoute(route: Route | Route[]) {
    const routes = Array.isArray(route) ? route : [route];
    this.routeSlot.register(routes);
    this.symphonyPlatform.registerRoute(routes);
    return this;
  }

  /**
   * list all registered routes.
   */
  listRoutes() {
    return this.routeSlot.flatValues();
  }

  /**
   * register a primary navigation item shown in the header and mobile nav.
   */
  registerNavigationItem(item: NavigationItem | NavigationItem[]) {
    const items = Array.isArray(item) ? item : [item];
    this.navigationItemSlot.register(items);
    return this;
  }

  /**
   * list all navigation items, ordered by their `order` field.
   */
  listNavigationItems() {
    return [...this.navigationItemSlot.flatValues()].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
  }

  /**
   * register a persistent header action (e.g. a feature toggle or shortcut).
   */
  registerHeaderAction(action: HeaderAction | HeaderAction[]) {
    const actions = Array.isArray(action) ? action : [action];
    this.headerActionSlot.register(actions);
    return this;
  }

  /**
   * list all header actions.
   */
  listHeaderActions() {
    return this.headerActionSlot.flatValues();
  }

  /**
   * register a feature admin panel mounted inside the admin dashboard.
   */
  registerAdminRoute(route: AdminRoute | AdminRoute[]) {
    const routes = Array.isArray(route) ? route : [route];
    this.adminRouteSlot.register(routes);
    return this;
  }

  /**
   * list all admin routes.
   */
  listAdminRoutes() {
    return this.adminRouteSlot.flatValues();
  }

  /**
   * register a link shown in the platform footer.
   */
  registerFooterLink(link: FooterLink | FooterLink[]) {
    const links = Array.isArray(link) ? link : [link];
    this.footerLinkSlot.register(links);
    return this;
  }

  /**
   * list all footer links.
   */
  listFooterLinks() {
    return this.footerLinkSlot.flatValues();
  }

  /**
   * register a home-page section (e.g. a feature preview or the community
   * wisdom hub) rendered full-width in the home page flow. features register
   * their previews here so the platform never imports feature scopes directly.
   */
  registerHomeSection(section: HomeSection | HomeSection[]) {
    const sections = Array.isArray(section) ? section : [section];
    this.homeSectionSlot.register(sections);
    return this;
  }

  /**
   * list all home sections, ordered by their `order` field.
   */
  listHomeSections() {
    return [...this.homeSectionSlot.flatValues()].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
  }

  /**
   * register an ecosystem pillar card for the home page. features register
   * their own pillar here, so a feature that is not loaded is never
   * advertised on the home page.
   */
  registerEcosystemPillar(pillar: EcosystemPillar | EcosystemPillar[]) {
    const pillars = Array.isArray(pillar) ? pillar : [pillar];
    this.ecosystemPillarSlot.register(pillars);
    return this;
  }

  /**
   * list all ecosystem pillars, ordered by their `order` field.
   */
  listEcosystemPillars() {
    return [...this.ecosystemPillarSlot.flatValues()].sort(
      (a, b) => (a.order || 0) - (b.order || 0)
    );
  }

  static dependencies = [SymphonyPlatformAspect];

  static async provider(
    [symphonyPlatform]: [SymphonyPlatformBrowser],
    config: HelamPlatformConfig,
    [routeSlot, navigationItemSlot, headerActionSlot, adminRouteSlot, footerLinkSlot, homeSectionSlot, ecosystemPillarSlot]: [
      RouteSlot,
      NavigationItemSlot,
      HeaderActionSlot,
      AdminRouteSlot,
      FooterLinkSlot,
      HomeSectionSlot,
      EcosystemPillarSlot
    ]
  ) {
    const platform = new HelamPlatformBrowser(
      config,
      routeSlot,
      navigationItemSlot,
      headerActionSlot,
      adminRouteSlot,
      footerLinkSlot,
      homeSectionSlot,
      ecosystemPillarSlot,
      symphonyPlatform
    );

    /**
     * register the app-layout as the global shell. reads slot values at render
     * time so items registered by feature aspects are always available. the
     * NavigationItem slot uses `href`; the header expects `path`, so the items
     * are adapted here.
     */
    symphonyPlatform.registerLayoutComponent(({ children }) => {
      const navigationItems = platform.listNavigationItems().map((item) => ({
        label: item.label,
        path: item.href,
        order: item.order,
      }));
      const headerActions = platform.listHeaderActions();

      return (
        <AppLayout navigationItems={navigationItems} headerActions={headerActions}>
          {children}
        </AppLayout>
      );
    });

    /**
     * home belongs to the platform itself, so the platform registers it the
     * same way features register theirs — the header has no hard-coded links.
     */
    platform.registerNavigationItem([
      {
        label: 'בית',
        href: '/',
        order: 0,
      },
    ]);

    /**
     * membership moderation lives in the admin dashboard — this is the gate
     * where moderators and admins approve or reject new community signups.
     */
    platform.registerAdminRoute([
      {
        path: 'users',
        label: 'אישור חברים',
        component: () => <ManageUsers />,
      },
    ]);

    /**
     * register the platform's own routes. feature routes are registered
     * separately by feature aspects through `registerRoute`.
     */
    symphonyPlatform.registerRoute([
      {
        path: '/',
        component: () => (
          <OnboardingGate>
            <Home
              homeSections={platform.listHomeSections()}
              ecosystemProps={{ pillars: platform.listEcosystemPillars() }}
            />
          </OnboardingGate>
        ),
      },
      {
        path: '/login',
        component: () => <Login />,
      },
      {
        path: '/signup',
        component: () => <Signup />,
      },
      {
        path: '/onboarding',
        component: () => (
          <ProtectedRoute redirectTo="/login">
            <OnboardingPage redirectTo="/" />
          </ProtectedRoute>
        ),
      },
      {
        path: '/profile',
        component: () => (
          <ProtectedRoute redirectTo="/login">
            <OnboardingGate>
              <Profile />
            </OnboardingGate>
          </ProtectedRoute>
        ),
      },
      {
        path: '/admin',
        component: () => {
          const panels = platform.listAdminRoutes().map((route) => ({
            id: route.path,
            label: route.label,
            path: route.path,
            component: route.component,
          }));
          return <AdminDashboard panels={panels.length > 0 ? panels : undefined} />;
        },
      },
      {
        path: '/plan-to-production',
        component: () => (
          <ProtectedRoute redirectTo="/login" allowedRoles={['moderator', 'admin']}>
            <PlanToProduction />
          </ProtectedRoute>
        ),
      },
    ]);

    symphonyPlatform.registerTheme((props) => <HelamTheme {...props} />);
    symphonyPlatform.registerPageNotFound(() => <NotFoundPage />);

    return platform;
  }
}

export default HelamPlatformBrowser;
