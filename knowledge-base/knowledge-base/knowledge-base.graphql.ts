import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import type { KnowledgeBaseNode } from './knowledge-base.node.runtime.js';
import type {
  ListRecordsOptions,
  CreateRecordOptions,
  UpdateRecordOptions,
  UpsertLabelOptions,
} from './media-record-options.js';

type SessionUser = {
  id: string;
  role?: string;
};

type ResolverContext = {
  session?: {
    user?: SessionUser;
  };
};

/**
 * roles allowed to manage knowledge-base content (records and labels).
 */
const MANAGE_ROLES = ['moderator', 'admin'];

/**
 * ensure the current user holds a role allowed to manage the knowledge base.
 */
function assertCanManage(context: ResolverContext) {
  const role = context?.session?.user?.role;
  if (!role || !MANAGE_ROLES.includes(role)) {
    throw new AccessDenied();
  }
}

/**
 * GraphQL schema for the knowledge-base aspect: media records (video/audio)
 * grouped under labels (projects) and tagged with cross-cutting coping domains.
 */
export function knowledgeBaseGqlSchema(knowledgeBase: KnowledgeBaseNode): GqlSchema {
  return {
    typeDefs: gql`
      type KnowledgeBaseMediaRecord {
        id: String!
        slug: String!
        labelId: String!
        title: String!
        description: String
        mediaType: String!
        mediaUrl: String!
        thumbnailUrl: String
        durationSec: Int
        domains: [String]
        viewCount: Int
        publishedAt: String!
      }

      type KnowledgeBaseLabel {
        id: String!
        slug: String!
        name: String!
        description: String
        coverImage: String
        recordCount: Int
      }

      input KnowledgeBaseListRecordsOptions {
        labelId: String
        domainIds: [String!]
        query: String
        limit: Int
      }

      input KnowledgeBaseCreateRecordOptions {
        labelId: String!
        title: String!
        description: String
        mediaType: String
        mediaUrl: String!
        thumbnailUrl: String
        durationSec: Int
        domains: [String!]
        slug: String
        publishedAt: String
      }

      input KnowledgeBaseUpdateRecordOptions {
        labelId: String
        title: String
        description: String
        mediaType: String
        mediaUrl: String
        thumbnailUrl: String
        durationSec: Int
        domains: [String!]
      }

      input KnowledgeBaseUpsertLabelOptions {
        slug: String!
        name: String!
        description: String
        coverImage: String
      }

      type Query {
        listRecords(options: KnowledgeBaseListRecordsOptions): [KnowledgeBaseMediaRecord]
        getRecord(idOrSlug: String!): KnowledgeBaseMediaRecord
        listLabels: [KnowledgeBaseLabel]
        getLabel(idOrSlug: String!): KnowledgeBaseLabel
      }

      type Mutation {
        createRecord(options: KnowledgeBaseCreateRecordOptions): KnowledgeBaseMediaRecord
        updateRecord(id: String!, options: KnowledgeBaseUpdateRecordOptions): KnowledgeBaseMediaRecord
        deleteRecord(id: String!): Boolean
        incrementRecordView(recordId: String!): Boolean
        upsertLabel(options: KnowledgeBaseUpsertLabelOptions): KnowledgeBaseLabel
      }
    `,
    resolvers: {
      Query: {
        listRecords: async (_req: unknown, { options }: { options?: ListRecordsOptions }) => {
          const records = await knowledgeBase.listRecords(options);
          return records.map((record) => record.toObject());
        },
        getRecord: async (_req: unknown, { idOrSlug }: { idOrSlug: string }) => {
          const record = await knowledgeBase.getRecord(idOrSlug);
          return record ? record.toObject() : null;
        },
        listLabels: async () => {
          return knowledgeBase.listLabels();
        },
        getLabel: async (_req: unknown, { idOrSlug }: { idOrSlug: string }) => {
          return knowledgeBase.getLabel(idOrSlug);
        },
      },
      Mutation: {
        createRecord: async (
          _req: unknown,
          { options }: { options: CreateRecordOptions },
          context: ResolverContext
        ) => {
          assertCanManage(context);
          const record = await knowledgeBase.createRecord(options);
          return record.toObject();
        },
        updateRecord: async (
          _req: unknown,
          { id, options }: { id: string; options: UpdateRecordOptions },
          context: ResolverContext
        ) => {
          assertCanManage(context);
          const record = await knowledgeBase.updateRecord(id, options);
          return record ? record.toObject() : null;
        },
        deleteRecord: async (
          _req: unknown,
          { id }: { id: string },
          context: ResolverContext
        ) => {
          assertCanManage(context);
          return knowledgeBase.deleteRecord(id);
        },
        incrementRecordView: async (_req: unknown, { recordId }: { recordId: string }) => {
          return knowledgeBase.incrementView(recordId);
        },
        upsertLabel: async (
          _req: unknown,
          { options }: { options: UpsertLabelOptions },
          context: ResolverContext
        ) => {
          assertCanManage(context);
          return knowledgeBase.upsertLabel(options);
        },
      },
    },
  };
}
