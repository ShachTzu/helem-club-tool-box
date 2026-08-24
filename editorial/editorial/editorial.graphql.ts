import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import GraphQLJSON from 'graphql-type-json';
import type { EditorialNode } from './editorial.node.runtime.js';

/**
 * builds the GraphQL schema of the editorial library. the contract mirrors
 * exactly what the hooks send: drafts, revisions, diffs, the approval trail
 * and the editorial statistics.
 */
export function createEditorialGqlSchema(editorial: EditorialNode): GqlSchema {
  return {
    typeDefs: gql`
      scalar JSON

      type Draft {
        id: ID!
        contentType: String!
        contentRef: String
        title: String!
        payload: JSON
        domains: [String]
        status: String!
        authorId: String!
        authorName: String!
        currentVersion: Int!
        createdAt: String!
        updatedAt: String!
        submittedAt: String
        publishedAt: String
        lastReviewerId: String
        lastReviewNote: String
      }

      type Revision {
        id: ID!
        draftId: ID!
        versionNumber: Int!
        title: String
        payload: JSON
        domains: [String]
        authorId: String!
        authorName: String!
        changeSummary: String
        createdAt: String!
      }

      type ApprovalEntry {
        id: ID!
        draftId: ID!
        action: String!
        actorId: String!
        actorName: String!
        actorRole: String!
        note: String
        fromStatus: String
        toStatus: String
        versionNumber: Int
        createdAt: String!
      }

      type FieldDiff {
        field: String!
        label: String!
        before: String
        after: String
        changeKind: String!
      }

      type ContentTypeCount {
        contentType: String!
        label: String!
        count: Int!
      }

      type ReviewerActivity {
        actorId: String!
        actorName: String!
        approvals: Int!
        rejections: Int!
      }

      type EditorialStats {
        totalDrafts: Int!
        pendingReview: Int!
        approvedThisPeriod: Int!
        publishedThisPeriod: Int!
        rejectedThisPeriod: Int!
        avgHoursToApproval: Float!
        byContentType: [ContentTypeCount]
        byReviewer: [ReviewerActivity]
      }

      input ListDraftsOptions {
        contentType: String
        status: [String]
        authorId: String
        domains: [String]
        search: String
        limit: Int
        offset: Int
      }

      input SaveDraftInput {
        id: ID
        contentType: String!
        contentRef: String
        title: String!
        payload: JSON
        domains: [String]
        changeSummary: String
      }

      input ReviewOptions {
        draftId: ID!
        note: String
      }

      input GetEditorialStatsOptions {
        days: Int
      }

      type Query {
        listDrafts(options: ListDraftsOptions): [Draft]
        getDraft(id: ID!): Draft
        listRevisions(draftId: ID): [Revision]
        diffRevisions(draftId: ID!, fromVersion: Int!, toVersion: Int!): [FieldDiff]
        listApprovalTrail(draftId: ID): [ApprovalEntry]
        getEditorialStats(options: GetEditorialStatsOptions): EditorialStats
      }

      type Mutation {
        saveDraft(input: SaveDraftInput!): Draft
        restoreRevision(draftId: ID!, versionNumber: Int!): Draft
        submitForReview(options: ReviewOptions): Draft
        requestChanges(options: ReviewOptions): Draft
        approveDraft(options: ReviewOptions): Draft
        rejectDraft(options: ReviewOptions): Draft
        publishDraft(draftId: ID!): Draft
      }
    `,
    resolvers: {
      JSON: GraphQLJSON,
      Query: {
        listDrafts: async (_req: any, { options }: any, context: any) =>
          editorial.listDrafts(options, context?.session?.user),
        getDraft: async (_req: any, { id }: any, context: any) =>
          editorial.getDraft(id, context?.session?.user),
        listRevisions: async (_req: any, { draftId }: any) =>
          editorial.listRevisions(draftId),
        diffRevisions: async (_req: any, { draftId, fromVersion, toVersion }: any) =>
          editorial.diffRevisions(draftId, fromVersion, toVersion),
        listApprovalTrail: async (_req: any, { draftId }: any) =>
          editorial.listApprovalTrail(draftId),
        getEditorialStats: async (_req: any, { options }: any) =>
          editorial.getEditorialStats(options?.days),
      },
      Mutation: {
        saveDraft: async (_req: any, { input }: any, context: any) =>
          editorial.saveDraft(input, context?.session?.user),
        restoreRevision: async (_req: any, { draftId, versionNumber }: any, context: any) =>
          editorial.restoreRevision(draftId, versionNumber, context?.session?.user),
        submitForReview: async (_req: any, { options }: any, context: any) =>
          editorial.submitForReview(options, context?.session?.user),
        requestChanges: async (_req: any, { options }: any, context: any) =>
          editorial.requestChanges(options, context?.session?.user),
        approveDraft: async (_req: any, { options }: any, context: any) =>
          editorial.approveDraft(options, context?.session?.user),
        rejectDraft: async (_req: any, { options }: any, context: any) =>
          editorial.rejectDraft(options, context?.session?.user),
        publishDraft: async (_req: any, { draftId }: any, context: any) =>
          editorial.publishDraft(draftId, context?.session?.user),
      },
    },
  };
}
