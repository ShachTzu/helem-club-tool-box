import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import type { KnowledgeLibraryNode } from './knowledge-library.node.runtime.js';
import type { ListPagesOptions, CreatePageOptions, UpdatePageOptions } from './knowledge-page-options.js';

type SessionUser = {
  id: string;
  role?: string;
};

type ResolverContext = {
  session?: {
    user?: SessionUser;
  };
};

const STAFF_ROLES = ['moderator', 'admin'];

/**
 * a caller may manage knowledge-library content if they hold a staff role
 * (moderator/admin) OR are on this feature's own editor allowlist — the
 * allowlist check is a DB lookup, so this is async, unlike knowledge-base's
 * role-only assertCanManage.
 */
async function assertCanManage(context: ResolverContext, knowledgeLibrary: KnowledgeLibraryNode): Promise<void> {
  const user = context?.session?.user;
  if (!user) throw new AccessDenied();
  if (user.role && STAFF_ROLES.includes(user.role)) return;
  const isEditor = await knowledgeLibrary.isEditor(user.id);
  if (!isEditor) throw new AccessDenied();
}

/**
 * granting/revoking editor access is admin-only — an editor themselves
 * can't add other editors.
 */
function assertIsAdmin(context: ResolverContext): void {
  if (context?.session?.user?.role !== 'admin') {
    throw new AccessDenied();
  }
}

/**
 * GraphQL schema for the knowledge-library aspect: hierarchical text pages,
 * tagged with cross-cutting coping domains, managed by staff or by this
 * feature's own editor allowlist.
 */
export function createKnowledgeLibraryGqlSchema(knowledgeLibrary: KnowledgeLibraryNode): GqlSchema {
  return {
    typeDefs: gql`
      type KnowledgeLibraryPage {
        id: String!
        slug: String!
        title: String!
        body: String!
        parentId: String
        ancestorIds: [String]
        domains: [String]
        image: String
        videoUrl: String
        videoEmbedHtml: String
        publishDate: String!
        authorName: String!
        isStaffAuthor: Boolean!
        isPublished: Boolean!
        createdAt: String!
        updatedAt: String!
      }

      type KnowledgeLibraryEditor {
        userId: String!
        grantedAt: String!
      }

      type KnowledgeLibraryUploadSignature {
        signature: String!
        timestamp: Int!
        apiKey: String!
        cloudName: String!
        folder: String!
      }

      input KnowledgeLibraryListPagesOptions {
        parentId: String
        domainIds: [String!]
        query: String
        limit: Int
      }

      input KnowledgeLibraryCreatePageOptions {
        title: String!
        body: String!
        parentId: String
        domains: [String!]
        image: String
        videoUrl: String
        videoEmbedHtml: String
        slug: String
        publishDate: String
        isPublished: Boolean
      }

      input KnowledgeLibraryUpdatePageOptions {
        title: String
        body: String
        parentId: String
        domains: [String!]
        image: String
        videoUrl: String
        videoEmbedHtml: String
        publishDate: String
        isPublished: Boolean
      }

      type Query {
        listKnowledgePages(options: KnowledgeLibraryListPagesOptions): [KnowledgeLibraryPage]
        getKnowledgePage(idOrSlug: String!): KnowledgeLibraryPage
        listKnowledgeLibraryEditors: [KnowledgeLibraryEditor]
      }

      type Mutation {
        createKnowledgePage(options: KnowledgeLibraryCreatePageOptions!): KnowledgeLibraryPage
        updateKnowledgePage(id: String!, options: KnowledgeLibraryUpdatePageOptions!): KnowledgeLibraryPage
        deleteKnowledgePage(id: String!): Boolean
        grantKnowledgeLibraryEditor(userId: String!): Boolean
        revokeKnowledgeLibraryEditor(userId: String!): Boolean
        createKnowledgeLibraryUploadSignature: KnowledgeLibraryUploadSignature
      }
    `,
    resolvers: {
      Query: {
        listKnowledgePages: async (_req: unknown, { options }: { options?: ListPagesOptions }) => {
          return knowledgeLibrary.listPages(options);
        },
        getKnowledgePage: async (_req: unknown, { idOrSlug }: { idOrSlug: string }) => {
          return knowledgeLibrary.getPage(idOrSlug);
        },
        listKnowledgeLibraryEditors: async (_req: unknown, _args: unknown, context: ResolverContext) => {
          assertIsAdmin(context);
          return knowledgeLibrary.listEditors();
        },
      },
      Mutation: {
        createKnowledgePage: async (
          _req: unknown,
          { options }: { options: CreatePageOptions },
          context: ResolverContext
        ) => {
          await assertCanManage(context, knowledgeLibrary);
          return knowledgeLibrary.createPage(options);
        },
        updateKnowledgePage: async (
          _req: unknown,
          { id, options }: { id: string; options: UpdatePageOptions },
          context: ResolverContext
        ) => {
          await assertCanManage(context, knowledgeLibrary);
          return knowledgeLibrary.updatePage(id, options);
        },
        deleteKnowledgePage: async (_req: unknown, { id }: { id: string }, context: ResolverContext) => {
          await assertCanManage(context, knowledgeLibrary);
          return knowledgeLibrary.deletePage(id);
        },
        grantKnowledgeLibraryEditor: async (_req: unknown, { userId }: { userId: string }, context: ResolverContext) => {
          assertIsAdmin(context);
          await knowledgeLibrary.grantEditor(userId);
          return true;
        },
        revokeKnowledgeLibraryEditor: async (_req: unknown, { userId }: { userId: string }, context: ResolverContext) => {
          assertIsAdmin(context);
          return knowledgeLibrary.revokeEditor(userId);
        },
        createKnowledgeLibraryUploadSignature: async (_req: unknown, _args: unknown, context: ResolverContext) => {
          await assertCanManage(context, knowledgeLibrary);
          return knowledgeLibrary.createUploadSignature(context.session!.user!.id);
        },
      },
    },
  };
}
