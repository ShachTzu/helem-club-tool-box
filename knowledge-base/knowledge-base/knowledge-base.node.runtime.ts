import { SymphonyPlatformAspect, type SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformNode } from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
import {
  EditorialAspect,
  type EditorialNode,
  type PublishableDraft,
} from '@helemclub/editorial.editorial';
import { MediaRecord, type PlainMediaRecord } from '@helemclub/knowledge-base.entities.media-record';
import type { KnowledgeBaseConfig } from './knowledge-base-config.js';
import { knowledgeBaseGqlSchema } from './knowledge-base.graphql.js';
import { MediaRecordModel, MEDIA_RECORD_MOCKS } from './media-record.model.js';
import { LabelModel, LABEL_MOCKS } from './label.model.js';
import { MediaRecordRepository } from './media-record-repository.js';
import { LabelRepository } from './label-repository.js';
import type {
  ListRecordsOptions,
  CreateRecordOptions,
  UpdateRecordOptions,
  UpsertLabelOptions,
} from './media-record-options.js';

/**
 * plain, serializable shape of a knowledge-base label including its
 * record count, matching the label entity's public shape.
 */
export type PlainKnowledgeBaseLabel = {
  id: string;
  slug: string;
  name: string;
  description?: string;
  coverImage?: string;
  recordCount: number;
};

export class KnowledgeBaseNode {
  constructor(
    private knowledgeBaseConfig: KnowledgeBaseConfig,
    private symphonyPlatform: SymphonyPlatformNode,
    private helamPlatform: HelamPlatformNode,
    private mediaRecordRepository: MediaRecordRepository,
    private labelRepository: LabelRepository
  ) {}

  private toMediaRecord(model: {
    id: string;
    slug: string;
    labelId: string;
    title: string;
    description?: string;
    mediaType: string;
    mediaUrl: string;
    thumbnailUrl?: string;
    durationSec?: number;
    domains?: string[];
    viewCount?: number;
    publishedAt: string;
  }): MediaRecord {
    const plain: PlainMediaRecord = {
      id: model.id,
      slug: model.slug,
      labelId: model.labelId,
      title: model.title,
      description: model.description,
      mediaType: model.mediaType === 'audio' ? 'audio' : 'video',
      mediaUrl: model.mediaUrl,
      thumbnailUrl: model.thumbnailUrl,
      durationSec: model.durationSec,
      domains: model.domains || [],
      viewCount: model.viewCount || 0,
      publishedAt: model.publishedAt,
    };
    return MediaRecord.from(plain);
  }

  /**
   * list and filter media records by label, coping domains and free text.
   */
  async listRecords(options?: ListRecordsOptions): Promise<MediaRecord[]> {
    const records = await this.mediaRecordRepository.listRecords(options);
    return records.map((record) => this.toMediaRecord(record));
  }

  /**
   * resolve a single media record by its id or slug.
   */
  async getRecord(idOrSlug: string): Promise<MediaRecord | null> {
    const record = await this.mediaRecordRepository.getRecord(idOrSlug);
    if (!record) return null;
    return this.toMediaRecord(record);
  }

  /**
   * atomically increment the view count of a record.
   */
  async incrementView(id: string): Promise<boolean> {
    return this.mediaRecordRepository.incrementView(id);
  }

  /**
   * create a media record. callable server-side (e.g. by the events aspect's
   * publishRecording flow), so auth is enforced by the GraphQL layer only.
   */
  async createRecord(options: CreateRecordOptions): Promise<MediaRecord> {
    const record = await this.mediaRecordRepository.createRecord(options);
    return this.toMediaRecord(record);
  }

  /**
   * update an existing media record by its id.
   */
  async updateRecord(id: string, options: UpdateRecordOptions): Promise<MediaRecord | null> {
    const record = await this.mediaRecordRepository.updateRecord(id, options);
    if (!record) return null;
    return this.toMediaRecord(record);
  }

  /**
   * delete a media record by its id.
   */
  async deleteRecord(id: string): Promise<boolean> {
    return this.mediaRecordRepository.deleteRecord(id);
  }

  /**
   * list knowledge-base labels (projects), with their record counts.
   */
  async listLabels(): Promise<PlainKnowledgeBaseLabel[]> {
    const labels = await this.labelRepository.listLabels();
    return Promise.all(
      labels.map(async (label) => {
        const recordCount = await this.mediaRecordRepository.countByLabel(label.id);
        return { ...label, recordCount };
      })
    );
  }

  /**
   * resolve a single label by its id or slug, with its record count.
   */
  async getLabel(idOrSlug: string): Promise<PlainKnowledgeBaseLabel | null> {
    const label = await this.labelRepository.getLabel(idOrSlug);
    if (!label) return null;
    const recordCount = await this.mediaRecordRepository.countByLabel(label.id);
    return { ...label, recordCount };
  }

  /**
   * create or update a label by its slug.
   */
  async upsertLabel(options: UpsertLabelOptions): Promise<PlainKnowledgeBaseLabel> {
    const label = await this.labelRepository.upsertLabel(options);
    const recordCount = await this.mediaRecordRepository.countByLabel(label.id);
    return { ...label, recordCount };
  }

  /**
   * publish an approved editorial draft as a media record. an already
   * published draft (contentRef) updates its record in place instead of
   * creating a duplicate.
   */
  async publishDraft(draft: PublishableDraft): Promise<{ contentRef: string; url?: string }> {
    const payload = draft.payload || {};
    const mediaType = payload.mediaType === 'audio' ? 'audio' : 'video';

    if (draft.contentRef) {
      const updated = await this.updateRecord(draft.contentRef, {
        title: draft.title,
        description: payload.description,
        mediaType,
        mediaUrl: payload.mediaUrl,
        thumbnailUrl: payload.thumbnailUrl,
        durationSec: payload.durationSec,
        domains: draft.domains,
        labelId: payload.labelId,
      });
      if (!updated) throw new Error(`התוכן ${draft.contentRef} לא נמצא`);
      return { contentRef: updated.id, url: `/knowledge/record/${updated.slug}` };
    }

    const created = await this.createRecord({
      labelId: payload.labelId,
      title: draft.title,
      description: payload.description,
      mediaType,
      mediaUrl: payload.mediaUrl,
      thumbnailUrl: payload.thumbnailUrl,
      durationSec: payload.durationSec,
      domains: draft.domains,
    });

    return { contentRef: created.id, url: `/knowledge/record/${created.slug}` };
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect, EditorialAspect];

  static async provider(
    [symphonyPlatform, helamPlatform, knowledgeLibrary]: [
      SymphonyPlatformNode,
      HelamPlatformNode,
      EditorialNode
    ],
    config: KnowledgeBaseConfig
  ) {
    const mediaRecordModel = getModelForClass(MediaRecordModel);
    const mediaRecordRepository = new MediaRecordRepository(mediaRecordModel);

    const labelModel = getModelForClass(LabelModel);
    const labelRepository = new LabelRepository(labelModel);

    const knowledgeBase = new KnowledgeBaseNode(
      config,
      symphonyPlatform,
      helamPlatform,
      mediaRecordRepository,
      labelRepository
    );

    const gqlSchema = knowledgeBaseGqlSchema(knowledgeBase);

    helamPlatform.registerBackendServer([
      {
        gql: gqlSchema,
      },
    ]);

    /**
     * the knowledge base owns how an approved draft becomes a media record.
     * the editorial library calls this handler when a moderator publishes a
     * draft of type `media-record`.
     */
    knowledgeLibrary.registerPublishHandler({
      contentType: 'media-record',
      publish: (draft) => knowledgeBase.publishDraft(draft),
      unpublish: async (contentRef) => {
        await knowledgeBase.deleteRecord(contentRef);
      },
      validate: (payload) => {
        const errors: string[] = [];
        if (!payload?.mediaUrl || String(payload.mediaUrl).trim().length === 0) {
          errors.push('חובה לצרף קישור למדיה');
        }
        if (!payload?.labelId || String(payload.labelId).trim().length === 0) {
          errors.push('חובה לשייך את התוכן לפרויקט');
        }
        return { valid: errors.length === 0, errors };
      },
    });

    // demo labels and media records are invented content — seeded only when
    // seeding is permitted (see DISABLE_SEED_DATA on the platform aspect).
    helamPlatform.registerSeed(async () => {
      const existingLabels = await labelModel.find().limit(1);
      if (!existingLabels.length) {
        await labelModel.insertMany(LABEL_MOCKS);
      }

      const existingRecords = await mediaRecordModel.find().limit(1);
      if (!existingRecords.length) {
        await mediaRecordModel.insertMany(MEDIA_RECORD_MOCKS);
      }
    });

    return knowledgeBase;
  }
}

export default KnowledgeBaseNode;
