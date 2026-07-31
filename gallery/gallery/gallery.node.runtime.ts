import { SymphonyPlatformAspect, type SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformNode } from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import { GalleryItem, type GalleryMediaType } from '@helemclub/gallery.entities.gallery-item';

import type { GalleryConfig } from './gallery-config.js';
import { galleryGqlSchema } from './gallery.graphql.js';
import { GalleryItemModel, GALLERY_ITEM_MOCKS } from './gallery-item.model.js';
import { GalleryItemRepository } from './gallery-item-repository.js';
import type {
  ListGalleryItemsOptions,
  CreateGalleryItemOptions,
  UpdateGalleryItemOptions,
} from './gallery-options.js';

type SessionContext = { session?: { userId?: string } };

export class GalleryNode {
  constructor(
    private galleryConfig: GalleryConfig,
    private symphonyPlatform: SymphonyPlatformNode,
    private helamPlatform: HelamPlatformNode,
    private galleryItemRepository: GalleryItemRepository
  ) {}

  /**
   * Map a raw database model to a GalleryItem entity.
   */
  private toEntity(model: GalleryItemModel): GalleryItem {
    const createdAt =
      model.createdAt instanceof Date ? model.createdAt.toISOString() : model.createdAt ?? new Date().toISOString();

    return GalleryItem.from({
      id: model.id,
      slug: model.slug,
      title: model.title,
      description: model.description,
      mediaType: (model.mediaType as GalleryMediaType) || 'image',
      mediaUrl: model.mediaUrl,
      thumbnailUrl: model.thumbnailUrl,
      artistName: model.artistName,
      domains: model.domains || [],
      createdAt,
    });
  }

  /**
   * ensure the current user is a moderator or admin, throwing otherwise.
   */
  private async assertModerator(context: SessionContext) {
    const user = await this.helamPlatform.getCurrentUser(context);
    const allowed = user && (user.role === 'moderator' || user.role === 'admin');
    if (!allowed) throw new AccessDenied();
    return user;
  }

  /**
   * List/filter gallery items by media type, domain and free-text query.
   */
  async listItems(options?: ListGalleryItemsOptions): Promise<GalleryItem[]> {
    const models = await this.galleryItemRepository.listItems(options);
    return models.map((model) => this.toEntity(model));
  }

  /**
   * Resolve a single gallery item by id or slug.
   */
  async getItem(idOrSlug: string): Promise<GalleryItem | null> {
    const model = await this.galleryItemRepository.getItem(idOrSlug);
    if (!model) return null;
    return this.toEntity(model);
  }

  /**
   * Create a new gallery item — moderators and admins only.
   */
  async createItem(options: CreateGalleryItemOptions, context: SessionContext): Promise<GalleryItem> {
    await this.assertModerator(context);
    const model = await this.galleryItemRepository.createItem(options);
    return this.toEntity(model);
  }

  /**
   * Update an existing gallery item — moderators and admins only.
   */
  async updateItem(
    id: string,
    options: UpdateGalleryItemOptions,
    context: SessionContext
  ): Promise<GalleryItem | null> {
    await this.assertModerator(context);
    const model = await this.galleryItemRepository.updateItem(id, options);
    if (!model) return null;
    return this.toEntity(model);
  }

  /**
   * Delete a gallery item — moderators and admins only.
   */
  async deleteItem(id: string, context: SessionContext): Promise<boolean> {
    await this.assertModerator(context);
    return this.galleryItemRepository.deleteItem(id);
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: GalleryConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
    config: GalleryConfig
  ) {
    const galleryItemModel = getModelForClass(GalleryItemModel);
    const galleryItemRepository = new GalleryItemRepository(galleryItemModel);

    const gallery = new GalleryNode(config, symphonyPlatform, helamPlatform, galleryItemRepository);

    const gqlSchema = galleryGqlSchema(gallery);

    helamPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    // demo gallery items are invented content — seeded only when seeding is
    // permitted (see DISABLE_SEED_DATA on the platform aspect).
    helamPlatform.registerSeed(async () => {
      const existingDocs = await galleryItemModel.find().limit(1);
      const hasDocs = Boolean(existingDocs.length);
      if (hasDocs) return undefined;
      await galleryItemModel.insertMany(GALLERY_ITEM_MOCKS);
      return undefined;
    });

    return gallery;
  }
}

export default GalleryNode;
