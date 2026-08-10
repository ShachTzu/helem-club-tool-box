import { createKnowledgeLibraryGqlSchema } from './knowledge-library.graphql.js';
import type { KnowledgeLibraryNode } from './knowledge-library.node.runtime.js';

/**
 * pins server-side enforcement of isPublished: a hidden page's content must
 * not be readable from the public GraphQL API by an unauthenticated or
 * unauthorized caller, regardless of what the UI chooses to render. this is
 * the fix for a real bug found in the red-team-engineering pass — the
 * resolvers originally had no auth check and returned everything.
 */

const UNPUBLISHED_PAGE = { id: 'p1', slug: 'p1', title: 'hidden', isPublished: false };
const PUBLISHED_PAGE = { id: 'p2', slug: 'p2', title: 'visible', isPublished: true };

function fakeKnowledgeLibrary(overrides: Partial<KnowledgeLibraryNode> = {}) {
  return {
    getPage: async () => null,
    listPages: async () => [],
    isEditor: async () => false,
    ...overrides,
  } as unknown as KnowledgeLibraryNode;
}

function noContext() {
  return { session: undefined };
}

function memberContext() {
  return { session: { user: { id: 'member-1', role: 'member' } } };
}

function editorContext() {
  return { session: { user: { id: 'editor-1' } } };
}

function adminContext() {
  return { session: { user: { id: 'admin-1', role: 'admin' } } };
}

it('getKnowledgePage hides an unpublished page from an anonymous caller', async () => {
  const knowledgeLibrary = fakeKnowledgeLibrary({ getPage: async () => UNPUBLISHED_PAGE as never });
  const schema = createKnowledgeLibraryGqlSchema(knowledgeLibrary);

  const result = await (schema.resolvers as any).Query.getKnowledgePage({}, { idOrSlug: 'p1' }, noContext());
  expect(result).toBeNull();
});

it('getKnowledgePage hides an unpublished page from a signed-in member with no manage access', async () => {
  const knowledgeLibrary = fakeKnowledgeLibrary({ getPage: async () => UNPUBLISHED_PAGE as never });
  const schema = createKnowledgeLibraryGqlSchema(knowledgeLibrary);

  const result = await (schema.resolvers as any).Query.getKnowledgePage({}, { idOrSlug: 'p1' }, memberContext());
  expect(result).toBeNull();
});

it('getKnowledgePage reveals an unpublished page to a staff caller (admin)', async () => {
  const knowledgeLibrary = fakeKnowledgeLibrary({ getPage: async () => UNPUBLISHED_PAGE as never });
  const schema = createKnowledgeLibraryGqlSchema(knowledgeLibrary);

  const result = await (schema.resolvers as any).Query.getKnowledgePage({}, { idOrSlug: 'p1' }, adminContext());
  expect(result).toEqual(UNPUBLISHED_PAGE);
});

it('getKnowledgePage reveals an unpublished page to an allowlisted editor', async () => {
  const knowledgeLibrary = fakeKnowledgeLibrary({
    getPage: async () => UNPUBLISHED_PAGE as never,
    isEditor: async (userId: string) => userId === 'editor-1',
  });
  const schema = createKnowledgeLibraryGqlSchema(knowledgeLibrary);

  const result = await (schema.resolvers as any).Query.getKnowledgePage({}, { idOrSlug: 'p1' }, editorContext());
  expect(result).toEqual(UNPUBLISHED_PAGE);
});

it('getKnowledgePage returns a published page to anyone', async () => {
  const knowledgeLibrary = fakeKnowledgeLibrary({ getPage: async () => PUBLISHED_PAGE as never });
  const schema = createKnowledgeLibraryGqlSchema(knowledgeLibrary);

  const result = await (schema.resolvers as any).Query.getKnowledgePage({}, { idOrSlug: 'p2' }, noContext());
  expect(result).toEqual(PUBLISHED_PAGE);
});

it('listKnowledgePages tells the repository to exclude unpublished pages for an anonymous caller', async () => {
  let capturedIncludeUnpublished: unknown;
  const knowledgeLibrary = fakeKnowledgeLibrary({
    listPages: async (_options, includeUnpublished) => {
      capturedIncludeUnpublished = includeUnpublished;
      return [];
    },
  });
  const schema = createKnowledgeLibraryGqlSchema(knowledgeLibrary);

  await (schema.resolvers as any).Query.listKnowledgePages({}, { options: undefined }, noContext());
  expect(capturedIncludeUnpublished).toBe(false);
});

it('listKnowledgePages tells the repository to include unpublished pages for an admin caller', async () => {
  let capturedIncludeUnpublished: unknown;
  const knowledgeLibrary = fakeKnowledgeLibrary({
    listPages: async (_options, includeUnpublished) => {
      capturedIncludeUnpublished = includeUnpublished;
      return [];
    },
  });
  const schema = createKnowledgeLibraryGqlSchema(knowledgeLibrary);

  await (schema.resolvers as any).Query.listKnowledgePages({}, { options: undefined }, adminContext());
  expect(capturedIncludeUnpublished).toBe(true);
});
