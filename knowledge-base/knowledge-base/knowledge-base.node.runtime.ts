import { SymphonyPlatformAspect, type SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformNode } from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
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

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
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

    helamPlatform.registerOnStart(async () => {
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
