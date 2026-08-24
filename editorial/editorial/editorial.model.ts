import { prop } from '@typegoose/typegoose';

/**
 * a draft — a work-in-progress payload for any content type, before it is
 * published into the feature's own store.
 */
export class DraftModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public contentType: string;

  @prop({ type: String })
  public contentRef?: string;

  @prop({ required: true, type: String })
  public title: string;

  @prop({ required: true, type: Object, default: {} })
  public payload: Record<string, any>;

  @prop({ type: () => [String], default: [] })
  public domains: string[];

  @prop({ required: true, type: String, default: 'draft' })
  public status: string;

  @prop({ required: true, type: String })
  public authorId: string;

  @prop({ required: true, type: String })
  public authorName: string;

  @prop({ required: true, type: Number, default: 1 })
  public currentVersion: number;

  @prop({ required: true, type: String })
  public createdAt: string;

  @prop({ required: true, type: String })
  public updatedAt: string;

  @prop({ type: String })
  public submittedAt?: string;

  @prop({ type: String })
  public publishedAt?: string;

  @prop({ type: String })
  public lastReviewerId?: string;

  @prop({ type: String })
  public lastReviewNote?: string;
}

/**
 * an immutable snapshot of a draft at a point in time. revisions are never
 * updated or deleted — restoring an old version creates a new revision.
 */
export class RevisionModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public draftId: string;

  @prop({ required: true, type: Number })
  public versionNumber: number;

  @prop({ required: true, type: String })
  public title: string;

  @prop({ required: true, type: Object, default: {} })
  public payload: Record<string, any>;

  @prop({ type: () => [String], default: [] })
  public domains: string[];

  @prop({ required: true, type: String })
  public authorId: string;

  @prop({ required: true, type: String })
  public authorName: string;

  @prop({ type: String, default: '' })
  public changeSummary: string;

  @prop({ required: true, type: String })
  public createdAt: string;
}

/**
 * an append-only entry in the approval trail — the source of truth for who
 * approved what, and when.
 */
export class ApprovalEntryModel {
  @prop({ unique: true, required: true, type: String })
  public id: string;

  @prop({ required: true, type: String })
  public draftId: string;

  @prop({ required: true, type: String })
  public action: string;

  @prop({ required: true, type: String })
  public actorId: string;

  @prop({ required: true, type: String })
  public actorName: string;

  @prop({ required: true, type: String })
  public actorRole: string;

  @prop({ type: String })
  public note?: string;

  @prop({ type: String })
  public fromStatus?: string;

  @prop({ type: String })
  public toStatus?: string;

  @prop({ type: Number })
  public versionNumber?: number;

  @prop({ required: true, type: String })
  public createdAt: string;
}
