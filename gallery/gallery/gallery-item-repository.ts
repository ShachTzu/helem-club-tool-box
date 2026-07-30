import { randomUUID } from 'crypto';
import { ReturnModelType } from '@typegoose/typegoose';
import { GalleryItemModel } from './gallery-item.model.js';
import type {
  ListGalleryItemsOptions,
  CreateGalleryItemOptions,
  UpdateGalleryItemOptions,
} from './gallery-options.js';

/**
 * build a URL-friendly slug from a title, adding a short unique suffix to
 * guarantee uniqueness across items.
 */
function slugify(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9\u0590-\u05FF]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const suffix = randomUUID().slice(0, 6);
  return base ? `${base}-${suffix}` : suffix;
}

export class GalleryItemRepository {
  constructor(private galleryItemModel: ReturnModelType<typeof GalleryItemModel>) {}

  /**
   * List or filter gallery items from database.
   */
  async listItems(options?: ListGalleryItemsOptions): Promise<GalleryItemModel[]> {
    const filter: Record<string, unknown> = {};

    if (options?.mediaType) {
      filter.mediaType = options.mediaType;
    }

    if (options?.domainIds && options.domainIds.length > 0) {
      filter.domains = { $in: options.domainIds };
    }

    if (options?.query) {
      filter.$or = [
        { title: { $regex: options.query, $options: 'i' } },
        { description: { $regex: options.query, $options: 'i' } },
        { artistName: { $regex: options.query, $options: 'i' } },
      ];
    }

    let queryBuilder = this.galleryItemModel.find(filter).sort({ createdAt: -1 });

    if (options?.limit && options.limit > 0) {
      queryBuilder = queryBuilder.limit(options.limit);
    }

    const docs = await queryBuilder.exec();
    return docs.map((doc) => doc.toObject());
  }

  /**
   * Get gallery item by id or slug from database.
   */
  async getItem(idOrSlug: string): Promise<GalleryItemModel | null> {
    const doc = await this.galleryItemModel
      .findOne({
        $or: [{ id: idOrSlug }, { slug: idOrSlug }],
      })
      .exec();

    if (!doc) return null;
    return doc.toObject();
  }

  /**
   * Create a new gallery item.
   */
  async createItem(options: CreateGalleryItemOptions): Promise<GalleryItemModel> {
    const doc = await this.galleryItemModel.create({
      id: randomUUID(),
      slug: slugify(options.title),
      title: options.title,
      description: options.description,
      mediaType: options.mediaType || 'image',
      mediaUrl: options.mediaUrl,
      thumbnailUrl: options.thumbnailUrl,
      artistName: options.artistName,
      domains: options.domains || [],
      createdAt: new Date(),
    });

    return doc.toObject();
  }

  /**
   * Update an existing gallery item by id.
   */
  async updateItem(id: string, options: UpdateGalleryItemOptions): Promise<GalleryItemModel | null> {
    const update: Record<string, unknown> = {};

    if (options.title !== undefined) update.title = options.title;
    if (options.description !== undefined) update.description = options.description;
    if (options.mediaType !== undefined) update.mediaType = options.mediaType;
    if (options.mediaUrl !== undefined) update.mediaUrl = options.mediaUrl;
    if (options.thumbnailUrl !== undefined) update.thumbnailUrl = options.thumbnailUrl;
    if (options.artistName !== undefined) update.artistName = options.artistName;
    if (options.domains !== undefined) update.domains = options.domains;

    const doc = await this.galleryItemModel
      .findOneAndUpdate({ id }, { $set: update }, { new: true })
      .exec();

    if (!doc) return null;
    return doc.toObject();
  }

  /**
   * Delete a gallery item by id.
   */
  async deleteItem(id: string): Promise<boolean> {
    const res = await this.galleryItemModel.deleteOne({ id }).exec();
    return res.deletedCount > 0;
  }
}
