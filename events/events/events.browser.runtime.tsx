import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { EventsListing } from '@helemclub/events.pages.events-listing';
import { EventDetail } from '@helemclub/events.pages.event-detail';
import { ManageEvents } from '@helemclub/events.admin.manage-events';
import { EventsPreview } from '@helemclub/events.sections.events-preview';
import type { EventsConfig } from './events-config.js';

export class EventsBrowser {
  constructor(
    private eventsConfig: EventsConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: EventsConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: EventsConfig
  ) {
    const events = new EventsBrowser(config, symphonyPlatform, helamPlatform);

    /**
     * public events listing and detail routes. browsing is free; RSVP is
     * login-gated inside the pages themselves.
     */
    helamPlatform.registerRoute([
      {
        path: '/events',
        component: () => <EventsListing />,
      },
      {
        path: '/events/:slug',
        component: () => <EventDetail />,
      },
    ]);

    /**
     * primary navigation entry pointing at the events listing.
     */
    helamPlatform.registerNavigationItem([
      {
        label: 'אירועים',
        href: '/events',
        order: 30,
      },
    ]);

    /**
     * surface upcoming events on the home page as a preview section with a
     * "see all" link to the events page.
     */
    helamPlatform.registerHomeSection({
      id: 'events-preview',
      order: 40,
      component: () => <EventsPreview />,
    });

    /**
     * admin panel for managing events and publishing recordings, mounted
     * inside the admin dashboard at /admin/events.
     */
    helamPlatform.registerAdminRoute([
      {
        path: '/admin/events',
        label: 'ניהול אירועים',
        component: () => <ManageEvents />,
      },
    ]);

    return events;
  }
}

export default EventsBrowser;
