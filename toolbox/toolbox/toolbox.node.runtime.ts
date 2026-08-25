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
import { AppDeletionRecord } from './app-deletion.model.js';
import { AppRepository } from './app-repository.js';
import { AppReviewRepository } from './app-review-repository.js';
import { AppDeletionRepository } from './app-deletion-repository.js';
import { parseCloudinaryUrl, signCloudinaryUpload, type CloudinaryConfig } from './cloudinary-signature.js';
import type {
  ListToolboxAppsOptions,
  SubmitAppInput,
  ReviewAppInput,
  CorrectNoteInput,
  DeleteSubmissionInput,
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
  moderationHistory?: ModerationEntry[];
};

/**
 * one past decision, as handed to the review console. moderator-only — it
 * names the deciding moderator and repeats the note written about a member.
 */
type ModerationEntry = {
  action: string;
  note: string;
  moderatorName: string;
  createdAt: string;
};

const MODERATOR_ROLES = ['admin', 'moderator'];

/**
 * helamPlatform.sendEmail wraps its `text` param straight into `<p>${text}</p>`
 * with no escaping. the app name it's built from is free text a member
 * chose — escape it here so a crafted name can't inject markup into the
 * confirmation email's HTML body.
 */
function escapeHtml(value: string): string {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildSubmissionConfirmationText(appName: string): string {
  return `היי, קיבלנו את ההגשה שלך "${escapeHtml(appName)}" לארגז הכלים של הלם קלאב. הכלי ממתין כעת לבדיקת צוות המנחים, ותקבלו עדכון נוסף ברגע שיאושר. תודה שתרמת לקהילה!`;
}

/**
 * the only moderation actions the server accepts, and the status each one
 * writes. an action outside this map is rejected rather than silently
 * falling through to a decision the moderator did not ask for.
 */
const REVIEW_ACTION_STATUS = new Map<string, string>([
  ['approve', 'approved'],
  ['reject', 'rejected'],
  ['request_changes', 'changes_requested'],
]);

/**
 * ponytail: a flat cap on one batch, not a job queue. every decision in a
 * batch writes one document and sends one email inline; move to a queue if
 * moderators ever need to decide more than this at once.
 */
const MAX_REVIEW_BATCH = 100;
const MAX_NOTE_LENGTH = 2000;

/**
 * ponytail: a flat cap, not pagination. this list exists to find a decision
 * you just made, not to browse the archive. add paging if moderators ever ask
 * to scroll past this.
 */
const DECIDED_LIST_LIMIT = 50;

/**
 * the only deletion modes the server accepts. a Map, not an object literal —
 * an object literal would resolve `mode: "constructor"` up the prototype
 * chain and walk straight through this check.
 */
const DELETION_MODES = new Map<string, string>([
  ['personal_data', 'personal_data'],
  ['everything', 'everything'],
]);

function buildModerationDecisionText(appName: string, status: string, note: string): string {
  const name = escapeHtml(appName);
  const why = note ? ` הערת הצוות: "${escapeHtml(note)}"` : '';
  if (status === 'approved') {
    return `היי, שמחים לעדכן שהכלי שלך "${name}" אושר ופורסם בארגז הכלים של הלם קלאב. תודה שתרמת לקהילה!`;
  }
  if (status === 'changes_requested') {
    return `היי, בדקנו את הכלי שלך "${name}" ויש כמה דברים שצריך לתקן לפני פרסום.${why} אפשר לערוך ולהגיש מחדש דרך "ההגשות שלי".`;
  }
  if (status === 'rejected') {
    return `היי, בדקנו את הכלי שלך "${name}" והוא לא אושר לפרסום בארגז הכלים.${why} תודה על ההגשה ועל התרומה לקהילה.`;
  }
  return '';
}

/**
 * the signed parameters a client needs to upload one image directly to
 * Cloudinary. the folder is fixed server-side to the requesting member's own
 * namespace and baked into the signature, so a client cannot redirect the
 * upload into another member's folder — Cloudinary itself rejects a mismatch.
 */
type UploadSignature = {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
};

export class ToolboxNode {
  constructor(
    private toolboxConfig: ToolboxConfig,
    private symphonyPlatform: SymphonyPlatformNode,
    private helamPlatform: HelamPlatformNode,
    private appRepository: AppRepository,
    private appReviewRepository: AppReviewRepository,
    private cloudinaryConfig: CloudinaryConfig | undefined,
    private appDeletionRepository?: AppDeletionRepository
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
      moderatorNote: model.moderatorNote || '',
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
   * resolve a single app by its id or slug. only approved apps are public —
   * a draft, a pending submission or a rejected one is readable solely by the
   * member who submitted it and by moderators. without this gate anyone who
   * can guess a slug reads the submission and, worse, the moderator's note
   * explaining why a named person's tool was turned down.
   */
  async getApp(idOrSlug: string, context: ResolverContext): Promise<PlainApp | null> {
    const app = await this.appRepository.getAppByIdOrSlug(idOrSlug);
    if (!app) return null;
    if (app.status === 'approved') return this.toPlainApp(app);

    const user = await this.helamPlatform.getCurrentUser(context || {});
    if (!user) return null;
    const isOwner = Boolean(app.submittedBy) && app.submittedBy === user.id;
    if (!isOwner && !MODERATOR_ROLES.includes(user.role)) return null;
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
      // oldest first — the console reads it as a story, not a stack.
      moderationHistory: (model.moderationHistory || []).map((entry) => ({
        action: entry.action,
        note: entry.note || '',
        moderatorName: entry.moderatorName || '',
        createdAt: entry.createdAt ? new Date(entry.createdAt).toISOString() : '',
      })),
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
   * list submissions already decided against (rejected / changes requested),
   * newest first. moderators and admins only — every row carries the note a
   * moderator wrote about a named member.
   */
  async listDecidedToolboxApps(context: ResolverContext): Promise<ModeratorApp[]> {
    await this.requireModerator(context);
    const apps = await this.appRepository.listDecidedApps(DECIDED_LIST_LIMIT);
    return apps
      .map((app) => this.toModeratorApp(app))
      .filter((app): app is ModeratorApp => Boolean(app));
  }

  /**
   * fix the wording of a note already written on a decided submission. the
   * decision itself is untouched. no email goes out: the member was already
   * told, and a second notification for a rephrasing is noise.
   */
  async correctModerationNote(
    input: CorrectNoteInput,
    context: ResolverContext
  ): Promise<PlainApp | null> {
    const moderator = await this.requireModerator(context);

    const note = (input.note || '').trim();
    if (!note) throw new Error(`a corrected note cannot be empty`);

    const updated = await this.appRepository.correctModeratorNote(
      input.appId,
      note.slice(0, MAX_NOTE_LENGTH),
      { id: moderator.id || '', name: moderator.displayName || '' }
    );
    if (!updated) throw new NotFound();

    return this.toPlainApp(updated);
  }

  /**
   * carry out a member's own deletion request on their own submission.
   *
   * self-service and immediate: it is their data and their tool, and putting
   * a moderator between a person and the removal of what was written about
   * them would make it a favour rather than a right. ownership is enforced in
   * the repository query, so an id belonging to somebody else matches nothing.
   *
   * both modes are irreversible. a receipt carrying no personal data is
   * written afterwards so we can show the request was honoured.
   */
  async deleteMySubmission(
    input: DeleteSubmissionInput,
    context: ResolverContext
  ): Promise<boolean> {
    const user = await this.requireUser(context);

    const mode = DELETION_MODES.get(input.mode);
    if (!mode) throw new Error(`unknown deletion mode`);
    if (!input.appId) throw new Error(`no submission selected`);

    let removed = false;
    if (mode === 'everything') {
      removed = await this.appRepository.deleteOwnedApp(input.appId, user.id);
      // the ratings are about a tool that no longer exists — leaving them
      // would strand other members' words against nothing.
      if (removed) await this.appReviewRepository.deleteReviewsForApp(input.appId);
    } else {
      removed = Boolean(await this.appRepository.anonymizeApp(input.appId, user.id));
    }

    if (!removed) throw new NotFound();

    // best-effort: the data is already gone, and failing to write the receipt
    // must never look like the deletion failed.
    try {
      await this.appDeletionRepository?.record(input.appId, mode);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[toolbox] deletion receipt failed for app ${input.appId}: ${(err as Error).message}`);
    }

    return true;
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
    let submittedApp: AppModel;
    if (draftId) {
      const submitted = await this.appRepository.submitDraft(draftId, input, user.id);
      if (!submitted) throw new NotFound();
      submittedApp = submitted;
    } else {
      submittedApp = await this.appRepository.createApp(input, user.id);
    }
    await this.sendSubmissionConfirmationEmail(submittedApp);
    return this.toPlainApp(submittedApp);
  }

  /**
   * best-effort confirmation email to the submitter. a mail failure must never
   * fail the submission itself — the app is already saved by the time this
   * runs, so this only logs and moves on.
   */
  private async sendSubmissionConfirmationEmail(app: AppModel): Promise<void> {
    if (!app.contactEmail) return;
    try {
      await this.helamPlatform.sendEmail(
        app.contactEmail,
        `הכלי "${app.name}" נשלח לבדיקה — הלם קלאב`,
        buildSubmissionConfirmationText(app.name)
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[toolbox] confirmation email failed for app ${app.id}: ${(err as Error).message}`);
    }
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
   * issue a signed, time-limited authorization for the current member to
   * upload one image directly to Cloudinary from the browser (the API secret
   * never reaches the client). the folder is pinned to the member's own id —
   * baked into the signature — so it can only ever be used to write into
   * their own submission folder.
   */
  async createUploadSignature(context: ResolverContext): Promise<UploadSignature> {
    const user = await this.requireUser(context);
    if (!this.cloudinaryConfig) {
      throw new Error('Image upload is not configured (CLOUDINARY_URL missing)');
    }
    const { cloudName, apiKey, apiSecret } = this.cloudinaryConfig;
    const folder = `toolbox/submissions/${user.id}`;
    const timestamp = Math.floor(Date.now() / 1000);
    const signature = signCloudinaryUpload({ folder, timestamp }, apiSecret);
    return { signature, timestamp, apiKey, cloudName, folder };
  }

  /**
   * apply a moderation decision to a pending app. approving makes it public.
   * moderators and admins only.
   */
  async reviewToolboxApp(input: ReviewAppInput, context: ResolverContext): Promise<PlainApp[]> {
    const moderator = await this.requireModerator(context);

    // a Map, not a plain object: `action: "constructor"` against an object
    // literal resolves up the prototype chain and walks straight through the
    // whitelist this check exists to enforce.
    const status = REVIEW_ACTION_STATUS.get(input.action);
    if (!status) throw new Error(`unknown moderation action`);

    const appIds = (input.appIds || []).filter((id) => typeof id === 'string' && id.length > 0);
    if (appIds.length === 0) throw new Error(`no submissions selected`);

    // approval carries no note; rejecting or asking for changes must say why,
    // enforced here and not only in the console — the client is not trusted.
    const note = (input.note || '').trim();
    if (status !== 'approved' && !note) {
      throw new Error(`a moderator note is required to reject or request changes`);
    }
    if (appIds.length > MAX_REVIEW_BATCH) throw new Error(`too many submissions in one batch`);

    const reviewed = await this.appRepository.reviewApps(
      appIds,
      status,
      input.action,
      status === 'approved' ? '' : note.slice(0, MAX_NOTE_LENGTH),
      { id: moderator.id || '', name: moderator.displayName || '' }
    );
    if (reviewed.length === 0) throw new NotFound();

    await Promise.all(reviewed.map((app) => this.sendModerationDecisionEmail(app)));

    return reviewed
      .map((app) => this.toPlainApp(app))
      .filter((app): app is PlainApp => Boolean(app));
  }

  /**
   * best-effort notification telling the submitter what was decided and why.
   * a mail failure must never fail the decision — it is already persisted.
   */
  private async sendModerationDecisionEmail(app: AppModel): Promise<void> {
    if (!app.contactEmail) return;
    const message = buildModerationDecisionText(app.name, app.status, app.moderatorNote || '');
    if (!message) return;
    try {
      await this.helamPlatform.sendEmail(
        app.contactEmail,
        `עדכון על הכלי "${app.name}" — הלם קלאב`,
        message
      );
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`[toolbox] decision email failed for app ${app.id}: ${(err as Error).message}`);
    }
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
  async rateToolboxApp(input: RateAppInput, context: ResolverContext): Promise<PlainAppReview> {
    // the reviewer's identity comes from the session, never from the request
    // body — otherwise anyone can post a rating under someone else's name.
    const user = await this.requireUser(context);
    const boundedStars = Math.max(1, Math.min(5, Math.round(input.stars)));

    const review = await this.appReviewRepository.createReview(
      input.appId,
      boundedStars,
      input.comment,
      user.displayName,
      user.id
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
    const appDeletionRepository = new AppDeletionRepository(getModelForClass(AppDeletionRecord));

    // image upload is optional at boot — catalog browsing doesn't need it, so
    // a missing/malformed CLOUDINARY_URL only fails the upload-signature call
    // itself (createUploadSignature), not the whole toolbox aspect.
    let cloudinaryConfig: CloudinaryConfig | undefined;
    try {
      cloudinaryConfig = parseCloudinaryUrl(process.env.CLOUDINARY_URL);
    } catch (err) {
      cloudinaryConfig = undefined;
      // eslint-disable-next-line no-console
      console.warn(`[toolbox] image upload disabled: ${(err as Error).message}`);
    }

    const toolbox = new ToolboxNode(
      config,
      symphonyPlatform,
      helamPlatform,
      appRepository,
      appReviewRepository,
      cloudinaryConfig,
      appDeletionRepository
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
