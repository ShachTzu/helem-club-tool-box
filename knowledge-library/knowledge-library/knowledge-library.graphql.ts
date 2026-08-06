import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import { AccessDenied } from '@bitdev/symphony.exceptions.access-denied';
import type { KnowledgeLibraryNode } from './knowledge-library.node.runtime.js';
import type { ListPagesOptions, CreatePageOptions, UpdatePageOptions } from '@helemclub/knowledge-library.entities.knowledge-page';
import type { ImportRow } from './knowledge-library-importer.js';

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
async function canManage(context: ResolverContext, knowledgeLibrary: KnowledgeLibraryNode): Promise<boolean> {
  const user = context?.session?.user;
  if (!user) return false;
  if (user.role && STAFF_ROLES.includes(user.role)) return true;
  return knowledgeLibrary.isEditor(user.id);
}

async function assertCanManage(context: ResolverContext, knowledgeLibrary: KnowledgeLibraryNode): Promise<void> {
  if (!(await canManage(context, knowledgeLibrary))) throw new AccessDenied();
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

      input KnowledgeLibraryImportRow {
        text: String
        imageFilename: String
        videoHtmlEmbed: String
        videoUrl: String
        date: String
        currentPageTitle: String!
        currentPageUrl: String
        parentPageTitle: String
      }

      input KnowledgeLibraryImageMapping {
        filename: String!
        url: String!
      }

      type KnowledgeLibraryImportRejection {
        currentPageTitle: String!
        reason: String!
      }

      type KnowledgeLibraryImportSummary {
        createdPageIds: [String]
        matchedExistingParents: [String]
        createdParents: [String]
        rejected: [KnowledgeLibraryImportRejection]
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
        """
        whether the signed-in caller may manage knowledge-library content —
        a self-check only (never exposes the allowlist itself), so the admin
        UI can gate itself for an allowlisted editor who isn't staff.
        """
        meCanManageKnowledgeLibrary: Boolean
      }

      type Mutation {
        createKnowledgePage(options: KnowledgeLibraryCreatePageOptions!): KnowledgeLibraryPage
        updateKnowledgePage(id: String!, options: KnowledgeLibraryUpdatePageOptions!): KnowledgeLibraryPage
        deleteKnowledgePage(id: String!): Boolean
        grantKnowledgeLibraryEditor(userId: String!): Boolean
        revokeKnowledgeLibraryEditor(userId: String!): Boolean
        createKnowledgeLibraryUploadSignature: KnowledgeLibraryUploadSignature
        importKnowledgeLibraryPages(
          rows: [KnowledgeLibraryImportRow!]!
          images: [KnowledgeLibraryImageMapping!]
          topAnchorParentId: String
        ): KnowledgeLibraryImportSummary
      }
    `,
    resolvers: {
      Query: {
        listKnowledgePages: async (
          _req: unknown,
          { options }: { options?: ListPagesOptions },
          context: ResolverContext
        ) => {
          // isPublished:false must be enforced here, from the session — a
          // client-side-only filter would still let anyone read a hidden
          // page's full content straight from the public API.
          const includeUnpublished = await canManage(context, knowledgeLibrary);
          return knowledgeLibrary.listPages(options, includeUnpublished);
        },
        getKnowledgePage: async (_req: unknown, { idOrSlug }: { idOrSlug: string }, context: ResolverContext) => {
          const page = await knowledgeLibrary.getPage(idOrSlug);
          if (!page) return null;
          if (!page.isPublished && !(await canManage(context, knowledgeLibrary))) return null;
          return page;
        },
        listKnowledgeLibraryEditors: async (_req: unknown, _args: unknown, context: ResolverContext) => {
          assertIsAdmin(context);
          return knowledgeLibrary.listEditors();
        },
        meCanManageKnowledgeLibrary: async (_req: unknown, _args: unknown, context: ResolverContext) => {
          return canManage(context, knowledgeLibrary);
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
        importKnowledgeLibraryPages: async (
          _req: unknown,
          {
            rows,
            images,
            topAnchorParentId,
          }: { rows: ImportRow[]; images?: { filename: string; url: string }[]; topAnchorParentId?: string },
          context: ResolverContext
        ) => {
          await assertCanManage(context, knowledgeLibrary);
          const imagesByFilename = Object.fromEntries((images || []).map((image) => [image.filename, image.url]));
          return knowledgeLibrary.importPages(rows, imagesByFilename, topAnchorParentId || null);
        },
      },
    },
  };
}
