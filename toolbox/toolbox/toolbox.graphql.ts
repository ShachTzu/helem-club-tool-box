import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import type { ToolboxNode } from './toolbox.node.runtime.js';
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
  session?: { userId?: string; user?: unknown };
};

/**
 * builds the GraphQL schema exposing the toolbox catalog API. every field and
 * operation mirrors exactly the selection sets sent by the toolbox hooks
 * (use-apps and use-app-reviews).
 */
export function toolboxGqlSchema(toolboxNode: ToolboxNode): GqlSchema {
  return {
    typeDefs: gql`
      type ToolboxApp {
        id: ID!
        slug: String!
        name: String!
        subtitle: String
        fullDescription: String
        externalLink: String
        icon: String
        screenshots: [String]
        costType: String
        platform: [String]
        language: String
        requiresSignup: Boolean
        clickCount: Int
        helpfulYes: Int
        helpfulNo: Int
        isFeatured: Boolean
        developerName: String
        originatorName: String
        domains: [String]
        avgRating: Float
        ratingCount: Int
        ratingHistogram: [Int]
        status: String!
        """
        why a submission was rejected or sent back for changes. only ever set
        on the submitter's own non-public records — approval clears it.
        """
        moderatorNote: String
      }

      """
      one past moderation decision. moderator-only: it carries the deciding
      moderator's name and the note written about a member's submission, so it
      must never appear on the public ToolboxApp type.
      """
      type ToolboxModerationEntry {
        action: String!
        note: String
        moderatorName: String
        createdAt: String
      }

      """
      a pending submission as seen by moderators only. extends the public app
      shape with submitter contact details (PII) that must never appear on the
      public ToolboxApp type or in public queries.
      """
      type PendingToolboxApp {
        id: ID!
        slug: String!
        name: String!
        subtitle: String
        fullDescription: String
        externalLink: String
        icon: String
        screenshots: [String]
        costType: String
        platform: [String]
        language: String
        requiresSignup: Boolean
        clickCount: Int
        helpfulYes: Int
        helpfulNo: Int
        isFeatured: Boolean
        developerName: String
        originatorName: String
        domains: [String]
        avgRating: Float
        ratingCount: Int
        ratingHistogram: [Int]
        status: String!
        moderatorNote: String
        contactEmail: String
        submittedBy: String
        submissionSource: String
        moderationHistory: [ToolboxModerationEntry]
      }

      """
      signed, time-limited authorization for the current member to upload one
      image directly to Cloudinary from the browser. the folder is pinned to
      the member's own submission folder and baked into the signature.
      """
      type ToolboxUploadSignature {
        signature: String!
        timestamp: Int!
        apiKey: String!
        cloudName: String!
        folder: String!
      }

      type ToolboxAppReview {
        id: ID!
        appId: String!
        stars: Int!
        comment: String
        displayName: String
        helpfulCount: Int
        createdAt: String
      }

      input ListToolboxAppsOptions {
        domainIds: [String]
        sort: String
        featured: Boolean
        query: String
      }

      input SubmitToolboxAppOptions {
        name: String!
        subtitle: String
        fullDescription: String
        externalLink: String!
        icon: String
        screenshots: [String]
        costType: String
        platform: [String]
        language: String
        domains: [String]
        developerName: String
        contactEmail: String
        submissionSource: String
      }

      input ReviewToolboxAppOptions {
        appIds: [String!]!
        action: String!
        note: String
      }

      input CorrectModerationNoteOptions {
        appId: String!
        note: String!
      }

      """
      how much of a member's own submission to remove.
      'personal_data' keeps the tool in the catalog but strips everything
      tying it to them; 'everything' removes the submission outright.
      """
      input DeleteMySubmissionOptions {
        appId: String!
        mode: String!
      }

      input IncrementToolboxAppClickOptions {
        appId: String!
        source: String
      }

      input RateToolboxAppOptions {
        appId: String!
        stars: Int!
        comment: String
      }

      type Query {
        listToolboxApps(options: ListToolboxAppsOptions): [ToolboxApp]
        getToolboxApp(idOrSlug: String!): ToolboxApp
        listPendingToolboxApps: [PendingToolboxApp]
        listDecidedToolboxApps: [PendingToolboxApp]
        listToolboxAppReviews(appId: String!): [ToolboxAppReview]
        getMyToolboxDraft(id: String!): PendingToolboxApp
        listMyToolboxSubmissions: [ToolboxApp]
      }

      type Mutation {
        submitToolboxApp(options: SubmitToolboxAppOptions!, id: String): ToolboxApp
        saveToolboxDraft(options: SubmitToolboxAppOptions!, id: String): PendingToolboxApp
        reviewToolboxApp(options: ReviewToolboxAppOptions!): [ToolboxApp]
        correctModerationNote(options: CorrectModerationNoteOptions!): ToolboxApp
        deleteMySubmission(options: DeleteMySubmissionOptions!): Boolean
        incrementToolboxAppClick(options: IncrementToolboxAppClickOptions!): Boolean
        rateToolboxApp(options: RateToolboxAppOptions!): ToolboxAppReview
        createToolboxUploadSignature: ToolboxUploadSignature
      }
    `,
    resolvers: {
      Query: {
        listToolboxApps: async (
          _parent: unknown,
          { options }: { options?: ListToolboxAppsOptions }
        ) => {
          return toolboxNode.listToolboxApps(options);
        },
        getToolboxApp: async (
          _parent: unknown,
          { idOrSlug }: { idOrSlug: string },
          context: ResolverContext
        ) => {
          return toolboxNode.getApp(idOrSlug, context);
        },
        listPendingToolboxApps: async (
          _parent: unknown,
          _args: unknown,
          context: ResolverContext
        ) => {
          return toolboxNode.listPendingToolboxApps(context);
        },
        listDecidedToolboxApps: async (
          _parent: unknown,
          _args: unknown,
          context: ResolverContext
        ) => {
          return toolboxNode.listDecidedToolboxApps(context);
        },
        listToolboxAppReviews: async (_parent: unknown, { appId }: { appId: string }) => {
          return toolboxNode.listAppReviews(appId);
        },
        getMyToolboxDraft: async (
          _parent: unknown,
          { id }: { id: string },
          context: ResolverContext
        ) => {
          return toolboxNode.getMyDraft(id, context);
        },
        listMyToolboxSubmissions: async (
          _parent: unknown,
          _args: unknown,
          context: ResolverContext
        ) => {
          return toolboxNode.listMySubmissions(context);
        },
      },
      Mutation: {
        submitToolboxApp: async (
          _parent: unknown,
          { options, id }: { options: SubmitAppInput; id?: string },
          context: ResolverContext
        ) => {
          return toolboxNode.submitApp(options, context, id);
        },
        saveToolboxDraft: async (
          _parent: unknown,
          { options, id }: { options: SubmitAppInput; id?: string },
          context: ResolverContext
        ) => {
          return toolboxNode.saveDraft(options, id, context);
        },
        reviewToolboxApp: async (
          _parent: unknown,
          { options }: { options: ReviewAppInput },
          context: ResolverContext
        ) => {
          return toolboxNode.reviewToolboxApp(options, context);
        },
        correctModerationNote: async (
          _parent: unknown,
          { options }: { options: CorrectNoteInput },
          context: ResolverContext
        ) => {
          return toolboxNode.correctModerationNote(options, context);
        },
        deleteMySubmission: async (
          _parent: unknown,
          { options }: { options: DeleteSubmissionInput },
          context: ResolverContext
        ) => {
          return toolboxNode.deleteMySubmission(options, context);
        },
        incrementToolboxAppClick: async (
          _parent: unknown,
          { options }: { options: IncrementClickInput }
        ) => {
          return toolboxNode.incrementToolboxAppClick(options);
        },
        rateToolboxApp: async (
          _parent: unknown,
          { options }: { options: RateAppInput },
          context: ResolverContext
        ) => {
          return toolboxNode.rateToolboxApp(options, context);
        },
        createToolboxUploadSignature: async (
          _parent: unknown,
          _args: unknown,
          context: ResolverContext
        ) => {
          return toolboxNode.createUploadSignature(context);
        },
      },
    },
  };
}
