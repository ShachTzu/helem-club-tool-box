import { ReturnModelType } from '@typegoose/typegoose';
import { MediaRecordModel } from './media-record.model.js';
import type {
  ListRecordsOptions,
  CreateRecordOptions,
  UpdateRecordOptions,
} from './media-record-options.js';

/**
 * derive a url-friendly slug from an arbitrary string, preserving Hebrew
 * characters and collapsing whitespace into single dashes.
 */
function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\u0590-\u05FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export class MediaRecordRepository {
  constructor(private mediaRecordModel: ReturnModelType<typeof MediaRecordModel>) {}

  /**
   * list and filter media records by label, coping domains and free text.
   */
  async listRecords(options?: ListRecordsOptions): Promise<MediaRecordModel[]> {
    const filter: Record<string, unknown> = {};

    if (options?.labelId) {
      filter.labelId = options.labelId;
    }

    if (options?.domainIds && options.domainIds.length > 0) {
      filter.domains = { $in: options.domainIds };
    }

    if (options?.query) {
      const escaped = options.query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = [
        { title: { $regex: escaped, $options: 'i' } },
        { description: { $regex: escaped, $options: 'i' } },
        { slug: { $regex: escaped, $options: 'i' } },
      ];
    }

    const query = this.mediaRecordModel.find(filter).sort({ publishedAt: -1, _id: -1 });
    if (options?.limit && options.limit > 0) {
      query.limit(options.limit);
    }

    const records = await query.exec();
    return records.map((record) => record.toObject());
  }

  /**
   * resolve a single media record by its id or slug.
   */
  async getRecord(idOrSlug: string): Promise<MediaRecordModel | null> {
    const record = await this.mediaRecordModel.findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
    if (!record) return null;
    return record.toObject();
  }

  /**
   * atomically increment the view count of a record by its id.
   */
  async incrementView(id: string): Promise<boolean> {
    const result = await this.mediaRecordModel.updateOne({ id }, { $inc: { viewCount: 1 } });
    return result.modifiedCount > 0;
  }

  /**
   * create a new media record, deriving a unique slug from the title
   * when one isn't explicitly supplied.
   */
  async createRecord(options: CreateRecordOptions): Promise<MediaRecordModel> {
    const id = crypto.randomUUID();
    const baseSlug = options.slug ? slugify(options.slug) : slugify(options.title) || id;
    const slug = await this.ensureUniqueSlug(baseSlug);

    const created = await this.mediaRecordModel.create({
      id,
      slug,
      labelId: options.labelId,
      title: options.title,
      description: options.description,
      mediaType: options.mediaType || 'video',
      mediaUrl: options.mediaUrl,
      thumbnailUrl: options.thumbnailUrl,
      durationSec: options.durationSec,
      domains: options.domains || [],
      viewCount: 0,
      publishedAt: options.publishedAt || new Date().toISOString(),
    });

    return created.toObject();
  }

  /**
   * update an existing media record by its id, only touching provided fields.
   */
  async updateRecord(id: string, options: UpdateRecordOptions): Promise<MediaRecordModel | null> {
    const update: Record<string, unknown> = {};
    const assignable: (keyof UpdateRecordOptions)[] = [
      'labelId',
      'title',
      'description',
      'mediaType',
      'mediaUrl',
      'thumbnailUrl',
      'durationSec',
      'domains',
    ];

    assignable.forEach((key) => {
      if (options[key] !== undefined) {
        update[key] = options[key];
      }
    });

    const record = await this.mediaRecordModel.findOneAndUpdate({ id }, { $set: update }, { new: true });
    if (!record) return null;
    return record.toObject();
  }

  /**
   * delete a media record by its id, returning whether a document was removed.
   */
  async deleteRecord(id: string): Promise<boolean> {
    const result = await this.mediaRecordModel.deleteOne({ id });
    return result.deletedCount > 0;
  }

  /**
   * count how many records belong to a given label.
   */
  async countByLabel(labelId: string): Promise<number> {
    return this.mediaRecordModel.countDocuments({ labelId });
  }

  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let candidate = baseSlug;
    let suffix = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await this.mediaRecordModel.exists({ slug: candidate })) {
      suffix += 1;
      candidate = `${baseSlug}-${suffix}`;
    }
    return candidate;
  }
}
