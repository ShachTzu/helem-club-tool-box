import { getModelForClass } from '@typegoose/typegoose';
import {
  SymphonyPlatformAspect,
  type SymphonyPlatformNode,
} from '@bitdev/symphony.symphony-platform';
import {
  HelamPlatformAspect,
  type HelamPlatformNode,
} from '@helemclub/platform.helam-platform';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import { Unauthorized } from '@bitdev/symphony.exceptions.unauthorized';
import { mockComments, type PlainComment } from '@helemclub/engagement.entities.comment';
import { mockReactions } from '@helemclub/engagement.entities.reaction';
import type { EngagementConfig } from './engagement-config.js';
import { engagementGqlSchema } from './engagement.graphql.js';
import { CommentModel } from './comment.model.js';
import { ReactionModel } from './reaction.model.js';
import { ReportModel } from './report.model.js';
import { EngagementRepository } from './engagement-repository.js';
import type {
  AddCommentInput,
  ReactionInput,
  ReactionSummary,
  CommentStats,
} from './engagement-options.js';

type EngagementContext = {
  session?: {
    userId?: string;
  };
};

function toPlainComment(model: CommentModel): PlainComment {
  return {
    id: model.id,
    targetType: model.targetType,
    targetId: model.targetId,
    text: model.text,
    displayName: model.displayName,
    isAnonymous: model.isAnonymous ?? false,
    membersOnly: model.membersOnly ?? false,
    deviceId: model.deviceId,
    userId: model.userId,
    reportCount: model.reportCount ?? 0,
    hidden: model.hidden ?? false,
    createdAt: model.createdAt,
  };
}

export class EngagementNode {
  constructor(
    private engagementConfig: EngagementConfig,
    private helamPlatform: HelamPlatformNode,
    private engagementRepository: EngagementRepository
  ) {}

  /**
   * list comments visible to the current viewer for a target object. hidden
   * comments are always excluded; members-only comments are excluded for
   * signed-out viewers, resolved via the platform's getCurrentUser.
   */
  async listComments(
    targetType: string,
    targetId: string,
    context: EngagementContext
  ): Promise<PlainComment[]> {
    const user = await this.helamPlatform.getCurrentUser(context);
    const isMember = Boolean(user);

    const comments = await this.engagementRepository.listComments(targetType, targetId);

    return comments
      .filter((comment) => {
        if (comment.hidden) return false;
        if (comment.membersOnly && !isMember) return false;
        return true;
      })
      .map(toPlainComment);
  }

  /**
   * add a comment against a target object. anonymous, device-scoped comments
   * are allowed; posting under a named member requires a signed-in user.
   */
  async addComment(input: AddCommentInput, context: EngagementContext): Promise<PlainComment> {
    const user = await this.helamPlatform.getCurrentUser(context);

    if (input.displayName && !input.isAnonymous && !user) {
      throw new Unauthorized();
    }

    const displayName = input.isAnonymous ? undefined : input.displayName ?? user?.displayName;

    const created = await this.engagementRepository.addComment(
      { ...input, displayName, isAnonymous: input.isAnonymous || !user },
      user?.id
    );

    return toPlainComment(created);
  }

  /**
   * report a comment as inappropriate. resolves with whether the comment was
   * hidden as a result.
   */
  async reportComment(commentId: string, deviceId: string): Promise<boolean> {
    return this.engagementRepository.reportComment(commentId, deviceId);
  }

  /**
   * list comments awaiting moderation. restricted to moderator/admin roles.
   */
  async listModerationQueue(context: EngagementContext): Promise<PlainComment[]> {
    await this.assertModerator(context);
    const comments = await this.engagementRepository.listModerationQueue();
    return comments.map(toPlainComment);
  }

  /**
   * resolve a moderation report on a comment by restoring it to public view
   * or deleting it permanently. restricted to moderator/admin roles.
   */
  async resolveReport(commentId: string, action: string, context: EngagementContext): Promise<boolean> {
    await this.assertModerator(context);
    if (action === 'delete') {
      return this.engagementRepository.deleteComment(commentId);
    }
    return this.engagementRepository.restoreComment(commentId);
  }

  /**
   * aggregate reaction counts for a target and the current device's reaction.
   */
  async getReactions(targetType: string, targetId: string, deviceId: string): Promise<ReactionSummary> {
    return this.engagementRepository.getReactions(targetType, targetId, deviceId);
  }

  /**
   * toggle a reaction/helpful vote for a device on a target object.
   */
  async toggleReaction(input: ReactionInput): Promise<ReactionSummary> {
    return this.engagementRepository.toggleReaction(input);
  }

  /**
   * aggregate comment counters for the admin engagement dashboards. restricted
   * to moderator/admin roles, same as the moderation queue.
   */
  async getCommentStats(targetType: string | undefined, context: EngagementContext): Promise<CommentStats> {
    await this.assertModerator(context);
    return this.engagementRepository.getCommentStats(targetType);
  }

  private async assertModerator(context: EngagementContext): Promise<void> {
    const user = await this.helamPlatform.getCurrentUser(context);
    if (!user) throw new Unauthorized();
    if (user.role !== 'moderator' && user.role !== 'admin') throw new AccessDenied();
  }

  static dependencies = [SymphonyPlatformAspect, HelamPlatformAspect];

  static defaultConfig: EngagementConfig = {};

  static async provider(
    [symphonyPlatform, helamPlatform]: [SymphonyPlatformNode, HelamPlatformNode],
    config: EngagementConfig
  ) {
    const commentModel = getModelForClass(CommentModel);
    const reactionModel = getModelForClass(ReactionModel);
    const reportModel = getModelForClass(ReportModel);

    const engagementRepository = new EngagementRepository(commentModel, reactionModel, reportModel);
    const engagement = new EngagementNode(config, helamPlatform, engagementRepository);

    const gqlSchema = engagementGqlSchema(engagement);

    helamPlatform.registerBackendServer([
      {
        routes: [],
        gql: gqlSchema,
      },
    ]);

    /**
     * seed comments and reactions from the existing entity mocks when the
     * collections are empty.
     */
    helamPlatform.registerOnStart(async () => {
      if (await engagementRepository.isCommentsEmpty()) {
        const comments = mockComments().map((comment) => {
          const plain = comment.toObject();
          return {
            id: plain.id,
            targetType: plain.targetType,
            targetId: plain.targetId,
            text: plain.text,
            displayName: plain.displayName,
            isAnonymous: plain.isAnonymous ?? false,
            membersOnly: plain.membersOnly ?? false,
            deviceId: plain.deviceId,
            userId: plain.userId,
            reportCount: plain.reportCount ?? 0,
            hidden: plain.hidden ?? false,
            createdAt: plain.createdAt,
          };
        });
        await engagementRepository.seedComments(comments);
      }

      if (await engagementRepository.isReactionsEmpty()) {
        const reactions = mockReactions().map((reaction) => {
          const plain = reaction.toObject();
          return {
            id: plain.id,
            targetType: plain.targetType,
            targetId: plain.targetId,
            type: plain.type,
            deviceId: plain.deviceId,
            createdAt: plain.createdAt,
          };
        });
        await engagementRepository.seedReactions(reactions);
      }
    });

    return engagement;
  }
}

export default EngagementNode;
