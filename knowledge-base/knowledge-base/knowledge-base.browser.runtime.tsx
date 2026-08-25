import React from 'react';
import { SymphonyPlatformAspect, type SymphonyPlatformBrowser } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformBrowser } from '@helemclub/platform.helam-platform';
import { KnowledgeLobby } from '@helemclub/knowledge-base.pages.knowledge-lobby';
import { LabelLobby } from '@helemclub/knowledge-base.pages.label-lobby';
import { RecordPage } from '@helemclub/knowledge-base.pages.record-page';
import { ManageLabels } from '@helemclub/knowledge-base.admin.manage-labels';
import { ManageRecords } from '@helemclub/knowledge-base.admin.manage-records';
import { KnowledgePreview } from '@helemclub/knowledge-base.sections.knowledge-preview';
import {
  EditorialAspect,
  type EditorialBrowser,
} from '@helemclub/editorial.editorial';
import { GenericPayloadEditor } from '@helemclub/editorial.pages.draft-editor';
import type { KnowledgeBaseConfig } from './knowledge-base-config.js';

/**
 * the editorial fields of a media record, shown to writers inside the
 * knowledge library draft editor.
 */
const MEDIA_RECORD_FIELDS = [
  { name: 'description', label: 'תיאור', multiline: true },
  { name: 'mediaUrl', label: 'קישור למדיה' },
  { name: 'mediaType', label: 'סוג מדיה (video / audio / article)' },
  { name: 'thumbnailUrl', label: 'תמונה ממוזערת (קישור)' },
  { name: 'labelId', label: 'מזהה הפרויקט' },
];

export class KnowledgeBaseBrowser {
  constructor(
    private knowledgeBaseConfig: KnowledgeBaseConfig,
    private symphonyPlatform: SymphonyPlatformBrowser,
    private helamPlatform: HelamPlatformBrowser
  ) {}

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect, EditorialAspect];

  static async provider(
    [symphonyPlatform, helamPlatform, knowledgeLibrary]: [
      SymphonyPlatformBrowser,
      HelamPlatformBrowser,
      EditorialBrowser
    ],
    config: KnowledgeBaseConfig
  ) {
    const knowledgeBase = new KnowledgeBaseBrowser(config, symphonyPlatform, helamPlatform);

    /**
     * feature routes. the record route is registered before the label route
     * so `/knowledge/record/:slug` is matched before `/knowledge/:labelSlug`.
     */
    helamPlatform.registerRoute([
      {
        path: '/knowledge',
        component: () => <KnowledgeLobby />,
      },
      {
        path: '/knowledge/record/:slug',
        component: () => <RecordPage />,
      },
      {
        path: '/knowledge/:labelSlug',
        component: () => <LabelLobby />,
      },
    ]);

    /**
     * primary navigation entry pointing to the knowledge lobby.
     */
    helamPlatform.registerNavigationItem([
      {
        label: 'ספריית הידע',
        href: '/knowledge',
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
        slug: 'knowledge',
        icon: '📚',
        title: 'מאגר ידע',
        description: 'סדרות וידאו, הקלטות והרצאות לפי נושא — ידע מקצועי שנבנה עם אנשי מקצוע.',
        href: '/knowledge',
        order: 30,
      },
    ]);

    /**
     * surface the knowledge base project labels on the home page as a preview
     * section with a "see all" link to the full knowledge base.
     */
    helamPlatform.registerHomeSection({
      id: 'knowledge-preview',
      order: 20,
      component: () => <KnowledgePreview />,
    });

    /**
     * admin panels mounted inside the platform's admin dashboard.
     */
    helamPlatform.registerAdminRoute([
      {
        path: 'knowledge-labels',
        label: 'ניהול פרויקטים',
        component: () => <ManageLabels />,
      },
      {
        path: 'knowledge-records',
        label: 'ניהול תכני ספריית הידע',
        component: () => <ManageRecords />,
      },
    ]);

    /**
     * media records can be drafted and reviewed in the editorial library
     * before they appear in the knowledge base.
     */
    knowledgeLibrary.registerContentType({
      contentType: 'media-record',
      label: 'תוכן בספריית הידע',
      editor: ({ payload, onChange, readOnly }) => (
        <GenericPayloadEditor
          payload={payload}
          onChange={onChange}
          readOnly={readOnly}
          fields={MEDIA_RECORD_FIELDS}
        />
      ),
      fields: MEDIA_RECORD_FIELDS,
    });

    return knowledgeBase;
  }
}

export default KnowledgeBaseBrowser;
