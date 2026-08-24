import { SymphonyPlatformAspect, type SymphonyPlatformNode } from '@bitdev/symphony.symphony-platform';
import { HelamPlatformAspect, type HelamPlatformNode } from '@helemclub/platform.helam-platform';
import { getModelForClass } from '@typegoose/typegoose';
import { Slot, type SlotRegistry, type Aspect } from '@bitdev/harmony.harmony';
import { diffPayloads } from '@helemclub/editorial.entities.field-diff';
import type { EditorialConfig } from './editorial-config.js';
import { DraftModel, RevisionModel, ApprovalEntryModel } from './editorial.model.js';
import { EditorialRepository, type ListDraftsOptions } from './editorial-repository.js';
import { createEditorialGqlSchema } from './editorial.graphql.js';
import { seedDrafts, seedRevisions, seedApprovals } from './editorial-seed.js';
import type { PublishHandler } from './content-type.js';

/**
 * the minimal shape of the authenticated user the library needs.
 */
export type LibraryUser = {
  id: string;
  displayName: string;
  role: 'member' | 'writer' | 'moderator' | 'admin';
};

/**
 * input accepted when creating or updating a draft.
 */
export type SaveDraftInput = {
  id?: string;
  contentType: string;
  contentRef?: string;
  title: string;
  payload?: Record<string, any>;
  domains?: string[];
  changeSummary?: string;
};

/**
 * input accepted by the review actions.
 */
export type ReviewOptions = {
  draftId: string;
  note?: string;
};

export type PublishHandlerSlot = SlotRegistry<PublishHandler[]>;

const ROLE_ORDER = ['member', 'writer', 'moderator', 'admin'];

/**
 * whether a user holds at least the given role.
 */
function isAtLeast(user: LibraryUser | undefined, role: string): boolean {
  if (!user) return false;
  return ROLE_ORDER.indexOf(user.role) >= ROLE_ORDER.indexOf(role);
}

/**
 * the node runtime of the editorial library. it owns the draft lifecycle,
 * the immutable version history and the append-only approval trail, and
 * delegates publishing to whichever feature registered a handler for the
 * draft's content type.
 */
export class EditorialNode {
  constructor(
    private config: EditorialConfig,
    private repository: EditorialRepository,
    private publishHandlerSlot: PublishHandlerSlot
  ) {}

  /**
   * registers a publish handler that writes approved content into a
   * feature's own store.
   */
  registerPublishHandler(handler: PublishHandler | PublishHandler[]) {
    this.publishHandlerSlot.register(Array.isArray(handler) ? handler : [handler]);
    return this;
  }

  /**
   * every publish handler registered by feature aspects.
   */
  listPublishHandlers(): PublishHandler[] {
    return this.publishHandlerSlot.flatValues();
  }

  /**
   * lists drafts. writers only ever see their own; moderators and admins
   * see everything.
   */
  async listDrafts(options: ListDraftsOptions = {}, user?: LibraryUser) {
    const scoped: ListDraftsOptions = { ...options };
    if (user && !isAtLeast(user, 'moderator')) {
      scoped.authorId = user.id;
    }
    return this.repository.listDrafts(scoped);
  }

  /**
   * gets a single draft, enforcing that writers only read their own.
   */
  async getDraft(id: string, user?: LibraryUser) {
    const draft = await this.repository.getDraft(id);
    if (!draft) return undefined;
    if (user && !isAtLeast(user, 'moderator') && draft.authorId !== user.id) return undefined;
    return draft;
  }

  /**
   * creates or updates a draft. every save appends a new immutable revision
   * — the version history is never overwritten.
   */
  async saveDraft(input: SaveDraftInput, user?: LibraryUser) {
    if (!isAtLeast(user, 'writer')) {
      throw new Error('רק כותבים יכולים לשמור טיוטות');
    }
    const author = user as LibraryUser;
    const now = new Date().toISOString();

    if (!input.id) {
      const draft: DraftModel = {
        id: crypto.randomUUID(),
        contentType: input.contentType,
        contentRef: input.contentRef,
        title: input.title,
        payload: input.payload || {},
        domains: input.domains || [],
        status: 'draft',
        authorId: author.id,
        authorName: author.displayName,
        currentVersion: 1,
        createdAt: now,
        updatedAt: now,
      };
      const created = await this.repository.createDraft(draft, input.changeSummary || 'נוצרה טיוטה');
      await this.repository.addApproval({
        draftId: created.id,
        action: 'created',
        actorId: author.id,
        actorName: author.displayName,
        actorRole: author.role,
        toStatus: 'draft',
        versionNumber: 1,
        createdAt: now,
      });
      return created;
    }

    const existing = await this.repository.getDraft(input.id);
    if (!existing) throw new Error('הטיוטה לא נמצאה');
    if (!isAtLeast(user, 'moderator') && existing.authorId !== author.id) {
      throw new Error('אין לכם הרשאה לערוך את הטיוטה הזו');
    }

    return this.repository.updateDraft(
      input.id,
      {
        title: input.title,
        payload: input.payload || {},
        domains: input.domains || [],
        contentRef: input.contentRef ?? existing.contentRef,
      },
      input.changeSummary || 'עודכנה הטיוטה'
    );
  }

  /**
   * the version history of a draft.
   */
  async listRevisions(draftId: string) {
    return this.repository.listRevisions(draftId);
  }

  /**
   * compares two versions of a draft, field by field.
   */
  async diffRevisions(draftId: string, fromVersion: number, toVersion: number) {
    const [before, after] = await Promise.all([
      this.repository.getRevision(draftId, fromVersion),
      this.repository.getRevision(draftId, toVersion),
    ]);
    return diffPayloads(before?.payload || {}, after?.payload || {});
  }

  /**
   * restores an older version by writing it forward as a new revision —
   * history is never rewritten or deleted.
   */
  async restoreRevision(draftId: string, versionNumber: number, user?: LibraryUser) {
    if (!isAtLeast(user, 'writer')) throw new Error('אין לכם הרשאה לשחזר גרסאות');
    const author = user as LibraryUser;

    const revision = await this.repository.getRevision(draftId, versionNumber);
    if (!revision) throw new Error('הגרסה לא נמצאה');

    const restored = await this.repository.updateDraft(
      draftId,
      { title: revision.title, payload: revision.payload, domains: revision.domains },
      `שוחזרה גרסה ${versionNumber}`
    );

    await this.repository.addApproval({
      draftId,
      action: 'restored',
      actorId: author.id,
      actorName: author.displayName,
      actorRole: author.role,
      note: `שוחזר תוכן מגרסה ${versionNumber}`,
      versionNumber: restored?.currentVersion,
      createdAt: new Date().toISOString(),
    });

    return restored;
  }

  /**
   * moves a draft into review and records the submission in the trail.
   */
  async submitForReview({ draftId, note }: ReviewOptions, user?: LibraryUser) {
    return this.transition(draftId, 'in_review', 'submitted', user, note, ['draft', 'changes_requested']);
  }

  /**
   * sends a draft back to its author with a required note.
   */
  async requestChanges({ draftId, note }: ReviewOptions, user?: LibraryUser) {
    if (!isAtLeast(user, 'moderator')) throw new Error('רק מנחים יכולים לבקש תיקונים');
    return this.transition(draftId, 'changes_requested', 'changes_requested', user, note, ['in_review']);
  }

  /**
   * approves a draft for publishing.
   */
  async approveDraft({ draftId, note }: ReviewOptions, user?: LibraryUser) {
    if (!isAtLeast(user, 'moderator')) throw new Error('רק מנחים יכולים לאשר טיוטות');
    return this.transition(draftId, 'approved', 'approved', user, note, ['in_review']);
  }

  /**
   * rejects a draft, archiving it while keeping the full trail.
   */
  async rejectDraft({ draftId, note }: ReviewOptions, user?: LibraryUser) {
    if (!isAtLeast(user, 'moderator')) throw new Error('רק מנחים יכולים לדחות טיוטות');
    return this.transition(draftId, 'archived', 'rejected', user, note, ['in_review']);
  }

  /**
   * publishes an approved draft through the handler its content type
   * registered. the published record lives in the feature's own store — the
   * library only stores the reference to it.
   */
  async publishDraft(draftId: string, user?: LibraryUser) {
    if (!isAtLeast(user, 'moderator')) throw new Error('רק מנחים יכולים לפרסם תוכן');
    const actor = user as LibraryUser;

    const draft = await this.repository.getDraft(draftId);
    if (!draft) throw new Error('הטיוטה לא נמצאה');
    if (draft.status !== 'approved') throw new Error('אפשר לפרסם רק טיוטה שאושרה');

    const handler = this.listPublishHandlers().find(
      (item) => item.contentType === draft.contentType
    );
    if (!handler) throw new Error(`לא נרשם הנדלר פרסום לסוג התוכן ${draft.contentType}`);

    const validation = handler.validate?.(draft.payload);
    if (validation && !validation.valid) {
      throw new Error(validation.errors?.join(', ') || 'התוכן אינו תקין לפרסום');
    }

    const result = await handler.publish({
      id: draft.id,
      contentType: draft.contentType,
      contentRef: draft.contentRef,
      title: draft.title,
      payload: draft.payload,
      domains: draft.domains,
      authorId: draft.authorId,
      authorName: draft.authorName,
      currentVersion: draft.currentVersion,
    });

    const now = new Date().toISOString();
    const published = await this.repository.setStatus(draftId, {
      status: 'published',
      contentRef: result.contentRef,
      publishedAt: now,
      lastReviewerId: actor.id,
    });

    await this.repository.addApproval({
      draftId,
      action: 'published',
      actorId: actor.id,
      actorName: actor.displayName,
      actorRole: actor.role,
      fromStatus: 'approved',
      toStatus: 'published',
      versionNumber: draft.currentVersion,
      createdAt: now,
    });

    return published;
  }

  /**
   * the approval trail of a draft, or the most recent decisions across all
   * drafts when no id is given.
   */
  async listApprovalTrail(draftId?: string) {
    return this.repository.listApprovals(draftId);
  }

  /**
   * editorial throughput metrics for the admin dashboard.
   */
  async getEditorialStats(days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
    const [totalDrafts, pendingReview, entries, allDrafts] = await Promise.all([
      this.repository.countAll(),
      this.repository.countByStatus(['in_review']),
      this.repository.approvalsSince(since),
      this.repository.listDrafts({ limit: 500 }),
    ]);

    const approved = entries.filter((entry) => entry.action === 'approved');
    const published = entries.filter((entry) => entry.action === 'published');
    const rejected = entries.filter((entry) => entry.action === 'rejected');

    const submissions = new Map<string, string>();
    entries
      .filter((entry) => entry.action === 'submitted')
      .forEach((entry) => submissions.set(entry.draftId, entry.createdAt));

    const durations = approved
      .map((entry) => {
        const submittedAt = submissions.get(entry.draftId);
        if (!submittedAt) return undefined;
        return (
          (new Date(entry.createdAt).getTime() - new Date(submittedAt).getTime()) / (1000 * 60 * 60)
        );
      })
      .filter((value): value is number => typeof value === 'number' && value >= 0);

    const avgHoursToApproval = durations.length
      ? Math.round((durations.reduce((sum, value) => sum + value, 0) / durations.length) * 10) / 10
      : 0;

    const typeCounts = new Map<string, number>();
    allDrafts.forEach((draft) => {
      typeCounts.set(draft.contentType, (typeCounts.get(draft.contentType) || 0) + 1);
    });

    const reviewers = new Map<string, { actorName: string; approvals: number; rejections: number }>();
    entries.forEach((entry) => {
      if (entry.action !== 'approved' && entry.action !== 'rejected') return;
      const current = reviewers.get(entry.actorId) || {
        actorName: entry.actorName,
        approvals: 0,
        rejections: 0,
      };
      if (entry.action === 'approved') current.approvals += 1;
      else current.rejections += 1;
      reviewers.set(entry.actorId, current);
    });

    return {
      totalDrafts,
      pendingReview,
      approvedThisPeriod: approved.length,
      publishedThisPeriod: published.length,
      rejectedThisPeriod: rejected.length,
      avgHoursToApproval,
      byContentType: Array.from(typeCounts.entries()).map(([contentType, count]) => ({
        contentType,
        label: contentTypeLabel(contentType),
        count,
      })),
      byReviewer: Array.from(reviewers.entries()).map(([actorId, value]) => ({
        actorId,
        ...value,
      })),
    };
  }

  /**
   * applies a status transition and appends the matching entry to the
   * append-only approval trail.
   */
  private async transition(
    draftId: string,
    toStatus: string,
    action: string,
    user: LibraryUser | undefined,
    note: string | undefined,
    allowedFrom: string[]
  ) {
    if (!isAtLeast(user, 'writer')) throw new Error('אין לכם הרשאה לבצע את הפעולה');
    const actor = user as LibraryUser;

    const draft = await this.repository.getDraft(draftId);
    if (!draft) throw new Error('הטיוטה לא נמצאה');
    if (!allowedFrom.includes(draft.status)) {
      throw new Error('לא ניתן לבצע את הפעולה במצב הנוכחי של הטיוטה');
    }

    const now = new Date().toISOString();
    const updates: Partial<DraftModel> = { status: toStatus };
    if (toStatus === 'in_review') updates.submittedAt = now;
    if (action !== 'submitted') {
      updates.lastReviewerId = actor.id;
      updates.lastReviewNote = note;
    }

    const updated = await this.repository.setStatus(draftId, updates);

    await this.repository.addApproval({
      draftId,
      action,
      actorId: actor.id,
      actorName: actor.displayName,
      actorRole: actor.role,
      note,
      fromStatus: draft.status,
      toStatus,
      versionNumber: draft.currentVersion,
      createdAt: now,
    });

    return updated;
  }

  static dependencies: Aspect[] = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: EditorialConfig = {
    mongoUrl: process.env.MONGO_URL || '',
  };

  static slots = [Slot.withType<PublishHandler[]>()];

  static async provider(
    [, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
    config: EditorialConfig,
    [publishHandlerSlot]: [PublishHandlerSlot]
  ) {
    const draftModel = getModelForClass(DraftModel);
    const revisionModel = getModelForClass(RevisionModel);
    const approvalModel = getModelForClass(ApprovalEntryModel);

    const repository = new EditorialRepository(draftModel, revisionModel, approvalModel);
    const editorial = new EditorialNode(config, repository, publishHandlerSlot);
    const gqlSchema = createEditorialGqlSchema(editorial);

    // the platform is absent when the aspect is loaded in isolation (tests),
    // so registration is skipped rather than crashing the provider.
    if (helamPlatform) {
      helamPlatform.registerBackendServer([{ routes: [], gql: gqlSchema }]);

      helamPlatform.registerSeed(async () => {
        const existing = await draftModel.find().limit(1);
        if (existing.length) return undefined;
        await draftModel.insertMany(seedDrafts);
        await revisionModel.insertMany(seedRevisions);
        await approvalModel.insertMany(seedApprovals);
        return undefined;
      });
    }

    return editorial;
  }
}

/**
 * a Hebrew label for a content type key.
 */
function contentTypeLabel(contentType: string): string {
  const labels: Record<string, string> = {
    post: 'מאמר בבלוג',
    'media-record': 'רשומת מדיה',
    tool: 'כלי התמודדות',
    event: 'אירוע',
    'gallery-item': 'פריט גלריה',
  };
  return labels[contentType] || contentType;
}

export default EditorialNode;
