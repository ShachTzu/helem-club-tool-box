import React from 'react';
import { useParams } from 'react-router-dom';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { GalleryPage } from '@helemclub/gallery.pages.gallery-page';
import { GalleryItemPage } from '@helemclub/gallery.pages.gallery-item-page';
import { ManageGallery } from '@helemclub/gallery.admin.manage-gallery';
import type { GalleryConfig } from './gallery-config.js';

function GalleryPageRoute() {
  return <GalleryPage />;
}

function GalleryItemPageRoute() {
  const { slug } = useParams();
  return <GalleryItemPage slug={slug || ''} />;
}

function ManageGalleryRoute() {
  return <ManageGallery />;
}

export class GalleryBrowser {
  constructor(
    private galleryConfig: GalleryConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: GalleryConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformBrowser, HelamPlatformBrowser],
    config: GalleryConfig
  ) {
    const gallery = new GalleryBrowser(config, symphonyPlatform, helamPlatform);

    helamPlatform.registerRoute([
      {
        path: '/gallery',
        component: GalleryPageRoute,
      },
      {
        path: '/gallery/:slug',
        component: GalleryItemPageRoute,
      },
    ]);

    helamPlatform.registerAdminRoute([
      {
        path: '/admin/gallery',
        label: 'גלריית PTSDART',
        component: ManageGalleryRoute,
      },
    ]);

    helamPlatform.registerNavigationItem([
      {
        label: 'גלריית PTSDART',
        href: '/gallery',
        order: 30,
      },
    ]);

    /**
     * advertise this feature as an ecosystem pillar on the home page. the
     * platform renders only the pillars registered by mounted aspects, so a
     * feature that is switched off is never linked to.
     */
    helamPlatform.registerEcosystemPillar([
      {
        slug: 'gallery',
        icon: '🎨',
        title: 'גלריית PTSDART',
        description: 'אמנות ויצירה מתוך החוויה האישית של חברי הקהילה.',
        href: '/gallery',
        order: 60,
      },
    ]);

    return gallery;
  }
}

export default GalleryBrowser;
