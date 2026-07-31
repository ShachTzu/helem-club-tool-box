import type { ReturnModelType } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';
import { AppModel } from './app.model.js';
import type { ListToolboxAppsOptions, SubmitAppInput } from './toolbox-options.js';

/**
 * encapsulates all MongoDB/Typegoose CRUD operations for toolbox apps.
 */
export class AppRepository {
  constructor(private appModel: ReturnModelType<typeof AppModel>) {}

  /**
   * list and filter published (approved) toolbox apps. supports filtering by
   * coping domain, featured-only, and a free-text query matched against the
   * name and description, plus rating/clicks/newest sorting.
   */
  async listApps(options: ListToolboxAppsOptions = {}): Promise<AppModel[]> {
    const filter: Record<string, unknown> = { status: 'approved' };

    if (options.featured) {
      filter.isFeatured = true;
    }

    if (options.domainIds && options.domainIds.length > 0) {
      filter.domains = { $in: options.domainIds };
    }

    if (options.query && options.query.trim()) {
      const regex = new RegExp(options.query.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      filter.$or = [{ name: regex }, { fullDescription: regex }, { subtitle: regex }];
    }

    let query = this.appModel.find(filter);

    if (options.sort === 'rating') {
      query = query.sort({ avgRating: -1, ratingCount: -1 });
    } else if (options.sort === 'clicks') {
      query = query.sort({ clickCount: -1 });
    } else if (options.sort === 'newest') {
      query = query.sort({ createdAt: -1 });
    } else {
      query = query.sort({ isFeatured: -1, avgRating: -1 });
    }

    const docs = await query.exec();
    return docs.map((doc) => doc.toObject());
  }

  /**
   * find a single app by its id or slug.
   */
  async getAppByIdOrSlug(idOrSlug: string): Promise<AppModel | null> {
    const doc = await this.appModel.findOne({
      $or: [{ id: idOrSlug }, { slug: idOrSlug }],
    });
    return doc ? doc.toObject() : null;
  }

  /**
   * list apps awaiting moderation review.
   */
  async listPendingApps(): Promise<AppModel[]> {
    const docs = await this.appModel.find({ status: 'pending' }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => doc.toObject());
  }

  /**
   * create a new app document with pending status, generating a unique slug
   * from the app name.
   */
  async createApp(input: SubmitAppInput, userId?: string): Promise<AppModel> {
    const id = uuidv4();
    const baseSlug =
      input.name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u0590-\u05FF]+/g, '-')
        .replace(/(^-|-$)/g, '') || id;
    const slug = await this.ensureUniqueSlug(baseSlug);

    const created = await this.appModel.create({
      id,
      slug,
      name: input.name,
      subtitle: input.subtitle || '',
      fullDescription: input.fullDescription || '',
      externalLink: input.externalLink,
      icon: input.icon || '🧩',
      screenshots: [],
      costType: input.costType || '',
      platform: input.platform || [],
      language: input.language || 'עברית',
      requiresSignup: false,
      domains: input.domains || [],
      status: 'pending',
      isFeatured: false,
      clickCount: 0,
      helpfulYes: 0,
      helpfulNo: 0,
      developerName: input.developerName || '',
      contactEmail: input.contactEmail || '',
      submissionSource: input.submissionSource || '',
      originatorName: '',
      avgRating: 0,
      ratingCount: 0,
      ratingHistogram: [0, 0, 0, 0, 0],
      submittedBy: userId || '',
      createdAt: new Date(),
    });

    return created.toObject();
  }

  /**
   * update an app's status after a moderation decision. approving also makes
   * the app public (featured stays as-is).
   */
  async updateAppStatus(appId: string, status: string): Promise<AppModel | null> {
    const updated = await this.appModel.findOneAndUpdate(
      { id: appId },
      { $set: { status } },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  }

  /**
   * atomically increment the click count for an app, used to rank apps by
   * popularity. returns true when a document was modified.
   */
  async incrementClickCount(appId: string): Promise<boolean> {
    const result = await this.appModel.updateOne({ id: appId }, { $inc: { clickCount: 1 } });
    return result.modifiedCount > 0;
  }

  /**
   * persist recomputed rating metrics for an app.
   */
  async updateAppRating(
    appId: string,
    avgRating: number,
    ratingCount: number,
    ratingHistogram: number[]
  ): Promise<AppModel | null> {
    const updated = await this.appModel.findOneAndUpdate(
      { id: appId },
      { $set: { avgRating, ratingCount, ratingHistogram } },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  }

  private async ensureUniqueSlug(baseSlug: string): Promise<string> {
    let candidate = baseSlug;
    let suffix = 1;
    // eslint-disable-next-line no-await-in-loop
    while (await this.appModel.findOne({ slug: candidate })) {
      candidate = `${baseSlug}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }
}
