import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import type { EngagementNode } from './engagement.node.runtime.js';
import type {
  AddCommentInput,
  ReactionInput,
  ReportCommentInput,
  ResolveReportInput,
} from './engagement-options.js';

type GqlContext = {
  session?: {
    userId?: string;
    user?: unknown;
  };
};

/**
 * GraphQL schema for the engagement aspect: comments, reactions, reports and
 * moderation. mirrors the contract used by hooks/use-comments,
 * use-reactions and use-moderation.
 */
export function engagementGqlSchema(engagementNode: EngagementNode): GqlSchema {
  return {
    typeDefs: gql`
      type EngagementComment {
        id: String!
        targetType: String!
        targetId: String!
        text: String!
        displayName: String
        isAnonymous: Boolean
        membersOnly: Boolean
        deviceId: String
        userId: String
        reportCount: Int
        hidden: Boolean
        createdAt: String!
      }

      type EngagementReactionCount {
        type: String!
        count: Int!
      }

      type EngagementReactionSummary {
        counts: [EngagementReactionCount!]!
        myReaction: String
      }

      type EngagementReportResult {
        hidden: Boolean
      }

      input AddCommentOptions {
        targetType: String!
        targetId: String!
        text: String!
        displayName: String
        isAnonymous: Boolean
        membersOnly: Boolean
        deviceId: String!
      }

      input ReportCommentOptions {
        commentId: String!
        deviceId: String!
      }

      input ToggleReactionOptions {
        targetType: String!
        targetId: String!
        type: String!
        deviceId: String!
      }

      input ResolveReportOptions {
        commentId: String!
        action: String!
      }

      type Query {
        listComments(targetType: String!, targetId: String!): [EngagementComment]
        getReactions(targetType: String!, targetId: String!, deviceId: String!): EngagementReactionSummary
        listModerationQueue: [EngagementComment]
      }

      type Mutation {
        addComment(options: AddCommentOptions!): EngagementComment
        reportComment(options: ReportCommentOptions!): EngagementReportResult
        toggleReaction(options: ToggleReactionOptions!): EngagementReactionSummary
        resolveReport(options: ResolveReportOptions!): Boolean
      }
    `,
    resolvers: {
      Query: {
        listComments: async (
          _: unknown,
          { targetType, targetId }: { targetType: string; targetId: string },
          context: GqlContext
        ) => {
          return engagementNode.listComments(targetType, targetId, context);
        },
        getReactions: async (
          _: unknown,
          { targetType, targetId, deviceId }: { targetType: string; targetId: string; deviceId: string }
        ) => {
          return engagementNode.getReactions(targetType, targetId, deviceId);
        },
        listModerationQueue: async (_: unknown, __: unknown, context: GqlContext) => {
          return engagementNode.listModerationQueue(context);
        },
      },
      Mutation: {
        addComment: async (_: unknown, { options }: { options: AddCommentInput }, context: GqlContext) => {
          return engagementNode.addComment(options, context);
        },
        reportComment: async (_: unknown, { options }: { options: ReportCommentInput }) => {
          const hidden = await engagementNode.reportComment(options.commentId, options.deviceId);
          return { hidden };
        },
        toggleReaction: async (_: unknown, { options }: { options: ReactionInput }) => {
          return engagementNode.toggleReaction(options);
        },
        resolveReport: async (_: unknown, { options }: { options: ResolveReportInput }, context: GqlContext) => {
          const user = context.session?.user;
          if (!user) throw new AccessDenied();
          return engagementNode.resolveReport(options.commentId, options.action, context);
        },
      },
    },
  };
}
