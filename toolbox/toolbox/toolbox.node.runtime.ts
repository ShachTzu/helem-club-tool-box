import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import {
  HelamPlatformAspect,
  type HelamPlatformNode,
} from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import { NotFound } from '@bitdev/symphony.exceptions.not-found';
import type { PlainApp } from '@helemclub/toolbox.entities.app';
import type { PlainAppReview } from '@helemclub/toolbox.entities.app-review';
import type { ToolboxConfig } from './toolbox-config.js';
import { toolboxGqlSchema } from './toolbox.graphql.js';
import { AppModel, APP_MOCKS } from './app.model.js';
import { AppReviewModel, APP_REVIEW_MOCKS } from './app-review.model.js';
import { AppRepository } from './app-repository.js';
import { AppReviewRepository } from './app-review-repository.js';
import type {
  ListToolboxAppsOptions,
  SubmitAppInput,
  ReviewAppInput,
  IncrementClickInput,
  RateAppInput,
} from './toolbox-options.js';

type ResolverContext = {
  session?: { userId?: string };
};

/**
 * a pending app enriched with moderator-only submitter details (PII). only ever
 * returned by the moderator-gated pending list — never by public queries.
 */
type ModeratorApp = PlainApp & {
  contactEmail?: string;
  submittedBy?: string;
  submissionSource?: string;
};

const MODERATOR_ROLES = ['admin', 'moderator'];

export class ToolboxNode {
  constructor(
    private toolboxConfig: ToolboxConfig,
    private symphonyPlatform: SymphonyPlatformNode,
    private helamPlatform: HelamPlatformNode,
    private appRepository: AppRepository,
    private appReviewRepository: AppReviewRepository
  ) {}

  /**
   * map an app model document into the PlainApp shape expected by the toolbox
   * hooks selection sets.
   */
  private toPlainApp(model: AppModel | null): PlainApp | null {
    if (!model) return null;
    return {
      id: model.id,
      slug: model.slug,
      name: model.name,
      subtitle: model.subtitle || '',
      fullDescription: model.fullDescription || '',
      externalLink: model.externalLink || '',
      icon: model.icon || '',
      screenshots: model.screenshots || [],
      costType: model.costType || '',
      platform: model.platform || [],
      language: model.language || '',
      requiresSignup: Boolean(model.requiresSignup),
      clickCount: model.clickCount || 0,
      helpfulYes: model.helpfulYes || 0,
      helpfulNo: model.helpfulNo || 0,
      isFeatured: Boolean(model.isFeatured),
      developerName: model.developerName || '',
      originatorName: model.originatorName || undefined,
      domains: model.domains || [],
      avgRating: model.avgRating || 0,
      ratingCount: model.ratingCount || 0,
      ratingHistogram:
        model.ratingHistogram && model.ratingHistogram.length === 5
          ? model.ratingHistogram
          : [0, 0, 0, 0, 0],
      status: (model.status as PlainApp['status']) || 'pending',
    };
  }

  /**
   * map a review model document into the PlainAppReview shape expected by the
   * use-app-reviews hook selection set.
   */
  private toPlainReview(model: AppReviewModel): PlainAppReview {
    return {
      id: model.id,
      appId: model.appId,
      stars: model.stars,
      comment: model.comment || undefined,
      displayName: model.displayName || 'אנונימי',
      helpfulCount: model.helpfulCount || 0,
      createdAt: model.createdAt ? model.createdAt.toISOString() : new Date().toISOString(),
    };
  }

  private async requireUser(context: ResolverContext) {
    const user = await this.helamPlatform.getCurrentUser(context || {});
    if (!user) throw new Unauthorized();
    return user;
  }

  private async requireModerator(context: ResolverContext) {
    const user = await this.requireUser(context);
    if (!MODERATOR_ROLES.includes(user.role)) throw new AccessDenied();
    return user;
  }

  /**
   * list published (approved) toolbox apps, filtered and sorted.
   */
  async listToolboxApps(options?: ListToolboxAppsOptions): Promise<PlainApp[]> {
    const apps = await this.appRepository.listApps(options || {});
    return apps.map((app) => this.toPlainApp(app)).filter((app): app is PlainApp => Boolean(app));
  }

  /**
   * resolve a single app by its id or slug.
   */
  async getApp(idOrSlug: string): Promise<PlainApp | null> {
    const app = await this.appRepository.getAppByIdOrSlug(idOrSlug);
    return this.toPlainApp(app);
  }

  /**
   * enrich a pending app with moderator-only submitter details. used solely by
   * the moderator-gated pending list — the public toPlainApp never maps these.
   */
  private toModeratorApp(model: AppModel | null): ModeratorApp | null {
    const base = this.toPlainApp(model);
    if (!base || !model) return null;
    return {
      ...base,
      contactEmail: model.contactEmail || '',
      submittedBy: model.submittedBy || '',
      submissionSource: model.submissionSource || '',
    };
  }

  /**
   * list apps awaiting moderation review. moderators and admins only. includes
   * submitter contact details so a moderator can follow up.
   */
  async listPendingToolboxApps(context: ResolverContext): Promise<ModeratorApp[]> {
    await this.requireModerator(context);
    const apps = await this.appRepository.listPendingApps();
    return apps
      .map((app) => this.toModeratorApp(app))
      .filter((app): app is ModeratorApp => Boolean(app));
  }

  /**
   * list the current member's own submissions across all statuses, for the
   * "my submissions" page. owner-scoped in the repository query; returns the
   * public app shape (no PII) plus status.
   */
  async listMySubmissions(context: ResolverContext): Promise<PlainApp[]> {
    const user = await this.requireUser(context);
    const apps = await this.appRepository.listByOwner(user.id);
    return apps.map((app) => this.toPlainApp(app)).filter((app): app is PlainApp => Boolean(app));
  }

  /**
   * list the reviews left for an app.
   */
  async listAppReviews(appId: string): Promise<PlainAppReview[]> {
    const reviews = await this.appReviewRepository.listReviewsByAppId(appId);
    return reviews.map((review) => this.toPlainReview(review));
  }

  /**
   * submit a new app to the catalog with pending status. requires a signed-in
   * community member.
   */
  async submitApp(
    input: SubmitAppInput,
    context: ResolverContext,
    draftId?: string
  ): Promise<PlainApp | null> {
    const user = await this.requireUser(context);
    if (draftId) {
      const submitted = await this.appRepository.submitDraft(draftId, input, user.id);
      if (!submitted) throw new NotFound();
      return this.toPlainApp(submitted);
    }
    const created = await this.appRepository.createApp(input, user.id);
    return this.toPlainApp(created);
  }

  /**
   * create or update the current member's own draft. autosaved as they fill the
   * form; returns the owner's own record (they may see their own contact email).
   */
  async saveDraft(
    input: SubmitAppInput,
    draftId: string | undefined,
    context: ResolverContext
  ): Promise<ModeratorApp | null> {
    const user = await this.requireUser(context);
    const saved = await this.appRepository.saveDraft(input, user.id, draftId);
    if (!saved) throw new NotFound();
    return this.toModeratorApp(saved);
  }

  /**
   * load one of the current member's own submissions (draft or otherwise) to
   * resume editing. ownership is enforced in the repository query — a member can
   * never load another member's record.
   */
  async getMyDraft(id: string, context: ResolverContext): Promise<ModeratorApp | null> {
    const user = await this.requireUser(context);
    const app = await this.appRepository.getOwnedApp(id, user.id);
    if (!app) throw new NotFound();
    return this.toModeratorApp(app);
  }

  /**
   * apply a moderation decision to a pending app. approving makes it public.
   * moderators and admins only.
   */
  async reviewToolboxApp(input: ReviewAppInput, context: ResolverContext): Promise<PlainApp | null> {
    await this.requireModerator(context);
    const status = input.action === 'approve' ? 'approved' : 'rejected';
    const updated = await this.appRepository.updateAppStatus(input.appId, status);
    if (!updated) throw new NotFound();
    return this.toPlainApp(updated);
  }

  /**
   * record a click-through on an app's external link, used to rank apps by
   * popularity. returns whether the counter was incremented.
   */
  async incrementToolboxAppClick(input: IncrementClickInput): Promise<boolean> {
    return this.appRepository.incrementClickCount(input.appId);
  }

  /**
   * create a review for an app and recompute the app's aggregate rating
   * metrics (average, count and histogram).
   */
  async rateToolboxApp(input: RateAppInput): Promise<PlainAppReview> {
    const boundedStars = Math.max(1, Math.min(5, Math.round(input.stars)));

    const review = await this.appReviewRepository.createReview(
      input.appId,
      boundedStars,
      input.comment,
      input.displayName
    );

    const allReviews = await this.appReviewRepository.listReviewsByAppId(input.appId);
    const count = allReviews.length;
    const sum = allReviews.reduce((acc, item) => acc + item.stars, 0);
    const avgRating = count > 0 ? Number((sum / count).toFixed(1)) : 0;

    const histogram = [0, 0, 0, 0, 0];
    allReviews.forEach((item) => {
      const index = item.stars - 1;
      if (index >= 0 && index < 5) histogram[index] += 1;
    });

    await this.appRepository.updateAppRating(input.appId, avgRating, count, histogram);

    return this.toPlainReview(review);
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: ToolboxConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
    config: ToolboxConfig
  ) {
    const appModel = getModelForClass(AppModel);
    const appReviewModel = getModelForClass(AppReviewModel);

    const appRepository = new AppRepository(appModel);
    const appReviewRepository = new AppReviewRepository(appReviewModel);

    const toolbox = new ToolboxNode(
      config,
      symphonyPlatform,
      helamPlatform,
      appRepository,
      appReviewRepository
    );

    const gqlSchema = toolboxGqlSchema(toolbox);

    helamPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    helamPlatform.registerOnStart(async () => {
      // sync indexes so the text index picks up the language_override option
      // (the `language` field holds Hebrew values that mongo would otherwise
      // try to interpret as a text-search language).
      await appModel.syncIndexes();
    });

    // demo apps and reviews are invented content — useful for a fresh dev
    // database, misleading in production. `registerSeed` runs only while
    // seeding is enabled (see DISABLE_SEED_DATA on the platform aspect).
    helamPlatform.registerSeed(async () => {
      const existingApps = await appModel.find().limit(1);
      if (!existingApps.length) {
        await appModel.insertMany(APP_MOCKS);
      }

      const existingReviews = await appReviewModel.find().limit(1);
      if (!existingReviews.length) {
        await appReviewModel.insertMany(APP_REVIEW_MOCKS);
      }
    });

    return toolbox;
  }
}

export default ToolboxNode;
