import type { ReturnModelType } from '@typegoose/typegoose';
import { v4 as uuidv4 } from 'uuid';
import { AppModel } from './app.model.js';
import type { ListToolboxAppsOptions, SubmitAppInput } from './toolbox-options.js';

// bounds how many screenshots a single submission can carry, regardless of
// what a client sends — independent of the upload signature's own limits.
const MAX_SCREENSHOTS = 5;

const CLOUDINARY_HOSTED_PATTERN = /^https:\/\/res\.cloudinary\.com\//;

/**
 * icon/screenshots may be a short emoji-style string, an image actually
 * hosted on Cloudinary (the only upload path the server signs for), or
 * empty — never an arbitrary external url. submitToolboxApp/saveToolboxDraft
 * accept these as free text, so without this an attacker-controlled url
 * could ride along as a public <img src> in the catalog (off-platform
 * tracking pixel, unrelated content) despite never going through the signed
 * upload flow.
 */
function sanitizeImageValue(value: string | undefined): string {
  const trimmed = (value || '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http')) {
    return CLOUDINARY_HOSTED_PATTERN.test(trimmed) ? trimmed : '';
  }
  return trimmed;
}

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
   * list submissions a moderator has already decided against, newest decision
   * first. approved apps are excluded — their note is cleared on approval and
   * they are visible in the catalog anyway; this list exists so a moderator can
   * find a decision they just made and fix the note they wrote on it.
   */
  async listDecidedApps(limit: number): Promise<AppModel[]> {
    const docs = await this.appModel
      .find({ status: { $in: ['rejected', 'changes_requested'] } })
      .sort({ reviewedAt: -1 })
      .limit(limit)
      .exec();
    return docs.map((doc) => doc.toObject());
  }

  /**
   * replace the note on an already-decided submission and record the change as
   * its own history entry. the status is untouched — this corrects what was
   * written, it does not re-decide anything. the previous wording stays in the
   * history: the member is shown the correction, the team can still see it was
   * corrected and from what.
   */
  async correctModeratorNote(
    appId: string,
    note: string,
    moderator: { id: string; name: string }
  ): Promise<AppModel | null> {
    const updated = await this.appModel.findOneAndUpdate(
      { id: appId, status: { $in: ['rejected', 'changes_requested'] } },
      {
        $set: { moderatorNote: note },
        $push: {
          moderationHistory: {
            action: 'correction',
            note,
            moderatorId: moderator.id,
            moderatorName: moderator.name,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  }

  /**
   * strip everything personal from a submission the member owns, leaving the
   * tool itself in place: their contact email, the names attached to it, the
   * ownership link, the moderator's note, and the whole review trail — the
   * notes in that trail are about them, so clearing only the current note
   * would leave the same words readable one click away.
   *
   * ownership is enforced in the query, so this can never touch another
   * member's submission.
   */
  async anonymizeApp(appId: string, userId: string): Promise<AppModel | null> {
    if (!userId) return null;

    const updated = await this.appModel.findOneAndUpdate(
      { id: appId, submittedBy: userId },
      {
        $set: {
          contactEmail: '',
          developerName: '',
          originatorName: '',
          submittedBy: '',
          moderatorNote: '',
          moderationHistory: [],
          // uploads are signed into `toolbox/submissions/<userId>/…`, so every
          // image URL carries the member's id in plain sight. leaving them
          // would make this "anonymised" tool point straight back at them.
          screenshots: [],
          icon: '🧩',
        },
      },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  }

  /**
   * remove a submission the member owns outright. ownership is enforced in the
   * query. returns whether a document was actually removed.
   */
  async deleteOwnedApp(appId: string, userId: string): Promise<boolean> {
    // an anonymised submission carries submittedBy '', so an empty userId here
    // would match every one of them and delete somebody else's tool.
    if (!userId) return false;

    const result = await this.appModel.deleteOne({ id: appId, submittedBy: userId });
    return result.deletedCount > 0;
  }

  /**
   * list every submission owned by a member, across all statuses, newest first.
   * scoped to the member's own records by the submittedBy filter in the query.
   */
  async listByOwner(userId: string): Promise<AppModel[]> {
    const docs = await this.appModel.find({ submittedBy: userId }).sort({ createdAt: -1 }).exec();
    return docs.map((doc) => doc.toObject());
  }

  /**
   * the submitter-editable fields of an app, shared by draft save and submit so
   * the same input maps consistently. excludes id/slug/status/metrics/ownership.
   */
  private editableFields(input: SubmitAppInput) {
    return {
      name: input.name,
      subtitle: input.subtitle || '',
      fullDescription: input.fullDescription || '',
      externalLink: input.externalLink || '',
      icon: sanitizeImageValue(input.icon) || '🧩',
      screenshots: (input.screenshots || []).map(sanitizeImageValue).filter(Boolean).slice(0, MAX_SCREENSHOTS),
      costType: input.costType || '',
      platform: input.platform || [],
      language: input.language || 'עברית',
      domains: input.domains || [],
      developerName: input.developerName || '',
      contactEmail: input.contactEmail || '',
      submissionSource: input.submissionSource || '',
    };
  }

  /**
   * fetch an app only if it belongs to the given user. ownership is enforced in
   * the query itself, so another member's app can never be returned (no IDOR).
   */
  async getOwnedApp(appId: string, userId: string): Promise<AppModel | null> {
    const doc = await this.appModel.findOne({ id: appId, submittedBy: userId });
    return doc ? doc.toObject() : null;
  }

  /**
   * create or update a draft owned by the user. an update only matches a draft
   * (or a changes-requested app) that the user owns — the ownership + status
   * filter lives in the query, so it cannot touch anyone else's record. returns
   * null when a given draftId does not match an editable app the user owns.
   */
  async saveDraft(input: SubmitAppInput, userId: string, draftId?: string): Promise<AppModel | null> {
    if (draftId) {
      const updated = await this.appModel.findOneAndUpdate(
        { id: draftId, submittedBy: userId, status: { $in: ['draft', 'changes_requested'] } },
        { $set: this.editableFields(input) },
        { new: true }
      );
      return updated ? updated.toObject() : null;
    }
    return this.createApp(input, userId, 'draft');
  }

  /**
   * submit a draft (or a changes-requested app) the user owns for review,
   * flipping it to pending. ownership + status are enforced in the query.
   */
  async submitDraft(draftId: string, input: SubmitAppInput, userId: string): Promise<AppModel | null> {
    const updated = await this.appModel.findOneAndUpdate(
      { id: draftId, submittedBy: userId, status: { $in: ['draft', 'changes_requested'] } },
      { $set: { ...this.editableFields(input), status: 'pending' } },
      { new: true }
    );
    return updated ? updated.toObject() : null;
  }

  /**
   * create a new app document (pending by default; 'draft' for autosaved
   * drafts), generating a unique slug from the app name.
   */
  async createApp(input: SubmitAppInput, userId?: string, status = 'pending'): Promise<AppModel> {
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
      icon: sanitizeImageValue(input.icon) || '🧩',
      screenshots: (input.screenshots || []).map(sanitizeImageValue).filter(Boolean).slice(0, MAX_SCREENSHOTS),
      costType: input.costType || '',
      platform: input.platform || [],
      language: input.language || 'עברית',
      requiresSignup: false,
      domains: input.domains || [],
      status,
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
   * apply a moderation decision to one or more apps. approving makes an app
   * public (featured stays as-is). only submissions still awaiting review are
   * touched, so a stale queue in a moderator's browser can never re-decide an
   * app that another moderator already handled. returns the apps it changed —
   * ids that were already decided are simply absent from the result.
   */
  async reviewApps(
    appIds: string[],
    status: string,
    action: string,
    moderatorNote: string,
    moderator: { id: string; name: string }
  ): Promise<AppModel[]> {
    if (appIds.length === 0) return [];

    const reviewedAt = new Date();
    await this.appModel.updateMany(
      { id: { $in: appIds }, status: 'pending' },
      {
        $set: { status, moderatorNote, reviewedAt },
        // append, never overwrite — the trail has to survive a
        // changes_requested → resubmit → re-review cycle.
        $push: {
          moderationHistory: {
            action,
            note: moderatorNote,
            moderatorId: moderator.id,
            moderatorName: moderator.name,
            createdAt: reviewedAt,
          },
        },
      }
    );

    // re-read by the exact stamp we just wrote, so apps that were already
    // decided before this call are not reported back as freshly changed.
    const docs = await this.appModel.find({ id: { $in: appIds }, reviewedAt }).exec();
    return docs.map((doc) => doc.toObject());
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
