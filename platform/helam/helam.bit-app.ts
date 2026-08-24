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
import { KnowledgeBaseAspect } from '@helemclub/knowledge-base.knowledge-base';
import { EventsAspect } from '@helemclub/events.events';
import { GalleryAspect } from '@helemclub/gallery.gallery';
import { EditorialAspect } from '@helemclub/editorial.editorial';
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
  aspects: [
    HelamPlatformAspect,
    KnowledgeDomainsAspect,
    EngagementAspect,
    ToolboxAspect,
    BlogAspect,
    KnowledgeBaseAspect,
    EventsAspect,
    GalleryAspect,
    EditorialAspect,
    KnowledgeLibraryAspect,
  ] as unknown as Aspect[],
});

export default helamApp;
