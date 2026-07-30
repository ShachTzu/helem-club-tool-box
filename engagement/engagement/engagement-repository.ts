import type { ReturnModelType } from '@typegoose/typegoose';
import { CommentModel } from './comment.model.js';
import { ReactionModel } from './reaction.model.js';
import { ReportModel } from './report.model.js';
import type {
  AddCommentInput,
  ReactionInput,
  ReactionSummary,
} from './engagement-options.js';

/**
 * number of distinct reports required before a comment is automatically
 * hidden from public view and surfaced in the moderation queue.
 */
const HIDE_THRESHOLD = 3;

export class EngagementRepository {
  constructor(
    private commentModel: ReturnModelType<typeof CommentModel>,
    private reactionModel: ReturnModelType<typeof ReactionModel>,
    private reportModel: ReturnModelType<typeof ReportModel>
  ) {}

  /**
   * list all comments for a target object, most recent first. visibility
   * filtering (hidden, members-only) is applied by the runtime layer.
   */
  async listComments(targetType: string, targetId: string): Promise<CommentModel[]> {
    const comments = await this.commentModel.find({ targetType, targetId }).sort({ createdAt: -1 });
    return comments.map((comment) => comment.toObject());
  }

  /**
   * add a new comment against a target object.
   */
  async addComment(input: AddCommentInput, userId?: string): Promise<CommentModel> {
    const created = await this.commentModel.create({
      id: crypto.randomUUID(),
      targetType: input.targetType,
      targetId: input.targetId,
      text: input.text,
      displayName: input.displayName,
      isAnonymous: input.isAnonymous ?? false,
      membersOnly: input.membersOnly ?? false,
      deviceId: input.deviceId,
      userId,
      reportCount: 0,
      hidden: false,
      createdAt: new Date().toISOString(),
    });
    return created.toObject();
  }

  /**
   * report a comment as inappropriate on behalf of a device. enforces one
   * report per device per comment and hides the comment once it reaches the
   * report threshold. resolves with whether the comment is now hidden.
   */
  async reportComment(commentId: string, deviceId: string): Promise<boolean> {
    const comment = await this.commentModel.findOne({ id: commentId });
    if (!comment) return false;

    const reportId = `${commentId}:${deviceId}`;
    const existingReport = await this.reportModel.findOne({ id: reportId });

    if (!existingReport) {
      await this.reportModel.create({
        id: reportId,
        commentId,
        deviceId,
        createdAt: new Date().toISOString(),
      });
    }

    const reportCount = await this.reportModel.countDocuments({ commentId });
    const hidden = reportCount >= HIDE_THRESHOLD;

    await this.commentModel.updateOne({ id: commentId }, { $set: { reportCount, hidden } });

    return hidden;
  }

  /**
   * list comments awaiting moderation: those hidden or reported at least once.
   */
  async listModerationQueue(): Promise<CommentModel[]> {
    const comments = await this.commentModel
      .find({ $or: [{ hidden: true }, { reportCount: { $gt: 0 } }] })
      .sort({ reportCount: -1, createdAt: -1 });
    return comments.map((comment) => comment.toObject());
  }

  /**
   * restore a hidden comment to public view and clear its reports.
   */
  async restoreComment(commentId: string): Promise<boolean> {
    await this.reportModel.deleteMany({ commentId });
    const result = await this.commentModel.updateOne(
      { id: commentId },
      { $set: { hidden: false, reportCount: 0 } }
    );
    return result.modifiedCount > 0;
  }

  /**
   * delete a comment permanently along with its reports.
   */
  async deleteComment(commentId: string): Promise<boolean> {
    await this.reportModel.deleteMany({ commentId });
    const result = await this.commentModel.deleteOne({ id: commentId });
    return result.deletedCount > 0;
  }

  /**
   * aggregate reaction counts per type for a target, plus the reaction the
   * current device made on it (if any).
   */
  async getReactions(targetType: string, targetId: string, deviceId: string): Promise<ReactionSummary> {
    const reactions = await this.reactionModel.find({ targetType, targetId });

    const countsByType = reactions.reduce<Record<string, number>>((acc, reaction) => {
      acc[reaction.type] = (acc[reaction.type] || 0) + 1;
      return acc;
    }, {});

    const counts = Object.keys(countsByType).map((type) => ({ type, count: countsByType[type] }));
    const mine = reactions.find((reaction) => reaction.deviceId === deviceId);

    return { counts, myReaction: mine?.type };
  }

  /**
   * toggle a reaction for a device on a target. calling with the same type
   * removes it; calling with a different type replaces it. returns the
   * updated reaction summary.
   */
  async toggleReaction(input: ReactionInput): Promise<ReactionSummary> {
    const { targetType, targetId, type, deviceId } = input;
    const existing = await this.reactionModel.findOne({ targetType, targetId, deviceId });

    if (existing && existing.type === type) {
      await this.reactionModel.deleteOne({ id: existing.id });
    } else if (existing) {
      await this.reactionModel.updateOne(
        { id: existing.id },
        { $set: { type, createdAt: new Date().toISOString() } }
      );
    } else {
      await this.reactionModel.create({
        id: crypto.randomUUID(),
        targetType,
        targetId,
        type,
        deviceId,
        createdAt: new Date().toISOString(),
      });
    }

    return this.getReactions(targetType, targetId, deviceId);
  }

  /**
   * whether the comment collection is empty (used to gate seeding).
   */
  async isCommentsEmpty(): Promise<boolean> {
    const existing = await this.commentModel.find().limit(1);
    return existing.length === 0;
  }

  /**
   * whether the reaction collection is empty (used to gate seeding).
   */
  async isReactionsEmpty(): Promise<boolean> {
    const existing = await this.reactionModel.find().limit(1);
    return existing.length === 0;
  }

  /**
   * seed initial comments.
   */
  async seedComments(comments: CommentModel[]): Promise<void> {
    await this.commentModel.insertMany(comments);
  }

  /**
   * seed initial reactions.
   */
  async seedReactions(reactions: ReactionModel[]): Promise<void> {
    await this.reactionModel.insertMany(reactions);
  }
}
