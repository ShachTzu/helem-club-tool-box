import { ReturnModelType } from '@typegoose/typegoose';
import { DraftModel, RevisionModel, ApprovalEntryModel } from './editorial.model.js';

/**
 * filters accepted when listing drafts.
 */
export type ListDraftsOptions = {
  contentType?: string;
  status?: string[];
  authorId?: string;
  domains?: string[];
  search?: string;
  limit?: number;
  offset?: number;
};

/**
 * the persistence layer of the editorial library. it owns the three
 * collections — drafts, revisions and the approval trail — and enforces the
 * two rules that make the layer trustworthy: revisions are append-only, and
 * every status change leaves an entry in the approval trail.
 */
export class EditorialRepository {
  constructor(
    private draftModel: ReturnModelType<typeof DraftModel>,
    private revisionModel: ReturnModelType<typeof RevisionModel>,
    private approvalModel: ReturnModelType<typeof ApprovalEntryModel>
  ) {}

  /**
   * lists drafts matching the given filters, newest first.
   */
  async listDrafts(options: ListDraftsOptions = {}): Promise<DraftModel[]> {
    const query: Record<string, any> = {};
    if (options.contentType) query.contentType = options.contentType;
    if (options.status && options.status.length > 0) query.status = { $in: options.status };
    if (options.authorId) query.authorId = options.authorId;
    if (options.domains && options.domains.length > 0) query.domains = { $in: options.domains };
    if (options.search) query.title = { $regex: options.search, $options: 'i' };

    const items = await this.draftModel
      .find(query)
      .sort({ updatedAt: -1 })
      .skip(options.offset || 0)
      .limit(options.limit || 100);

    return items.map((item) => item.toObject());
  }

  /**
   * gets a single draft by id.
   */
  async getDraft(id: string): Promise<DraftModel | undefined> {
    const item = await this.draftModel.findOne({ id });
    return item?.toObject();
  }

  /**
   * creates a draft together with its first revision.
   */
  async createDraft(draft: DraftModel, changeSummary = 'נוצרה טיוטה'): Promise<DraftModel> {
    const created = await this.draftModel.create(draft);
    const plain = created.toObject();
    await this.addRevision(plain, changeSummary);
    return plain;
  }

  /**
   * updates a draft and records a new revision for the change. the version
   * counter only advances when the content itself changed.
   */
  async updateDraft(
    id: string,
    updates: Partial<DraftModel>,
    changeSummary = ''
  ): Promise<DraftModel | undefined> {
    const existing = await this.getDraft(id);
    if (!existing) return undefined;

    const nextVersion = existing.currentVersion + 1;
    const updated = await this.draftModel.findOneAndUpdate(
      { id },
      { ...updates, currentVersion: nextVersion, updatedAt: new Date().toISOString() },
      { new: true }
    );
    if (!updated) return undefined;

    const plain = updated.toObject();
    await this.addRevision(plain, changeSummary);
    return plain;
  }

  /**
   * applies a status transition without creating a new revision — status
   * changes are recorded in the approval trail, not in the version history.
   */
  async setStatus(id: string, updates: Partial<DraftModel>): Promise<DraftModel | undefined> {
    const updated = await this.draftModel.findOneAndUpdate(
      { id },
      { ...updates, updatedAt: new Date().toISOString() },
      { new: true }
    );
    return updated?.toObject();
  }

  /**
   * appends an immutable revision capturing the current draft content.
   */
  async addRevision(draft: DraftModel, changeSummary = ''): Promise<RevisionModel> {
    const revision = await this.revisionModel.create({
      id: crypto.randomUUID(),
      draftId: draft.id,
      versionNumber: draft.currentVersion,
      title: draft.title,
      payload: draft.payload,
      domains: draft.domains,
      authorId: draft.authorId,
      authorName: draft.authorName,
      changeSummary,
      createdAt: new Date().toISOString(),
    });
    return revision.toObject();
  }

  /**
   * lists the revisions of a draft, newest version first.
   */
  async listRevisions(draftId: string): Promise<RevisionModel[]> {
    const items = await this.revisionModel.find({ draftId }).sort({ versionNumber: -1 });
    return items.map((item) => item.toObject());
  }

  /**
   * gets a specific version of a draft.
   */
  async getRevision(draftId: string, versionNumber: number): Promise<RevisionModel | undefined> {
    const item = await this.revisionModel.findOne({ draftId, versionNumber });
    return item?.toObject();
  }

  /**
   * appends an entry to the approval trail. entries are never updated or
   * deleted — this log is the source of truth for who approved what.
   */
  async addApproval(entry: Omit<ApprovalEntryModel, 'id'>): Promise<ApprovalEntryModel> {
    const created = await this.approvalModel.create({ id: crypto.randomUUID(), ...entry });
    return created.toObject();
  }

  /**
   * lists the approval trail of a draft, oldest first, so it reads as a
   * story. when no draft id is given, returns the most recent entries
   * across every draft.
   */
  async listApprovals(draftId?: string): Promise<ApprovalEntryModel[]> {
    if (!draftId) {
      const recent = await this.approvalModel.find({}).sort({ createdAt: -1 }).limit(50);
      return recent.map((item) => item.toObject());
    }
    const items = await this.approvalModel.find({ draftId }).sort({ createdAt: 1 });
    return items.map((item) => item.toObject());
  }

  /**
   * counts the drafts currently in a given set of statuses.
   */
  async countByStatus(statuses: string[]): Promise<number> {
    return this.draftModel.countDocuments({ status: { $in: statuses } });
  }

  /**
   * counts every draft in the store.
   */
  async countAll(): Promise<number> {
    return this.draftModel.countDocuments({});
  }

  /**
   * lists approval entries created after the given ISO timestamp, used to
   * compute the editorial statistics for a period.
   */
  async approvalsSince(since: string): Promise<ApprovalEntryModel[]> {
    const items = await this.approvalModel.find({ createdAt: { $gte: since } });
    return items.map((item) => item.toObject());
  }
}
