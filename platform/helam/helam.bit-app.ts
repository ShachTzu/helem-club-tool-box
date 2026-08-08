import { HarmonyPlatform } from '@bitdev/harmony.harmony-platform';
import type { Aspect } from '@bitdev/harmony.harmony';
import { BrowserRuntime } from '@bitdev/harmony.runtimes.browser-runtime';
import { NodeJSRuntime } from '@bitdev/harmony.runtimes.nodejs-runtime';
import { SymphonyPlatformAspect } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect } from '@helemclub/platform.helam-platform';
import { KnowledgeDomainsAspect } from '@helemclub/knowledge-domains.knowledge-domains';
import { EngagementAspect } from '@helemclub/engagement.engagement';
import { ToolboxAspect } from '@helemclub/toolbox.toolbox';
import { BlogAspect } from '@helemclub/blog.blog';
import { EventsAspect } from '@helemclub/events.events';
import { GalleryAspect } from '@helemclub/gallery.gallery';
import { KnowledgeLibraryAspect } from '@helemclub/knowledge-library.knowledge-library';

/**
 * The Helam Club Harmony application. Composes the symphony platform gateway,
 * the Helam platform aspect (RTL shell, auth, roles, onboarding) and all
 * cross-cutting and content feature aspects.
 */
export const helamApp = HarmonyPlatform.from({
  name: 'helam',
  platform: [
    SymphonyPlatformAspect,
    {
      name: 'Helam Club',
      slogan: 'קהילה, ידע וכלים להתמודדות',
    },
  ],
  runtimes: [new BrowserRuntime(), new NodeJSRuntime()],
  // The feature aspects are built with the node-env which pins a slightly
  // older (structurally identical) harmony version than the symphony platform.
  // The cast bridges the nominal type gap between the two harmony copies.
  // KnowledgeBaseAspect (the old "מאגר ידע" video/audio catalog) is
  // deliberately NOT composed here any more: the knowledge library absorbed
  // it, so users see one place for content instead of two overlapping ones.
  // Dropping it from this list also removes its /knowledge routes, nav item,
  // home section, admin panels AND its demo seed in a single move. The
  // components still exist in the repo, unreferenced, if any of it is needed.
  aspects: [
    HelamPlatformAspect,
    KnowledgeDomainsAspect,
    EngagementAspect,
    ToolboxAspect,
    BlogAspect,
    EventsAspect,
    GalleryAspect,
    KnowledgeLibraryAspect,
  ] as unknown as Aspect[],
});

export default helamApp;
