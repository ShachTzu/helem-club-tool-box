import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { KnowledgeDomainsNode } from './knowledge-domains.node.runtime.js';

/**
 * builds the GraphQL schema exposing the knowledge-domains API. the contract
 * mirrors exactly what hooks/use-domains and hooks/use-domain-content send:
 * `listDomains`, `getContentDomains`, `getContentByDomain` and `tagContent`.
 */
export function knowledgeDomainsGqlSchema(knowledgeDomains: KnowledgeDomainsNode): GqlSchema {
  return {
    typeDefs: gql`
      type Domain {
        id: String!
        slug: String!
        name: String!
        description: String
        icon: String
        count: Int
      }

      type TaggedContent {
        type: String!
        id: String!
        title: String!
        excerpt: String
        url: String!
        imageUrl: String
        domains: [String]
      }

      type DomainTag {
        id: String!
        domainId: String!
        targetType: String!
        targetId: String!
      }

      input GetContentByDomainOptions {
        domainId: String!
        types: [String]
        limit: Int
        offset: Int
      }

      input GetContentDomainsOptions {
        targetType: String!
        targetId: String!
      }

      input TagContentOptions {
        targetType: String!
        targetId: String!
        domainIds: [String!]!
      }

      type Query {
        listDomains: [Domain]
        getContentDomains(options: GetContentDomainsOptions): [Domain]
        getContentByDomain(options: GetContentByDomainOptions): [TaggedContent]
      }

      type Mutation {
        tagContent(options: TagContentOptions): [DomainTag]
      }
    `,
    resolvers: {
      Query: {
        listDomains: async () => {
          const domains = await knowledgeDomains.listDomains();
          return domains;
        },
        getContentDomains: async (
          _req: unknown,
          { options }: { options?: { targetType: string; targetId: string } }
        ) => {
          if (!options?.targetType || !options?.targetId) return [];
          return knowledgeDomains.getContentDomains(options);
        },
        getContentByDomain: async (
          _req: unknown,
          { options }: { options?: { domainId: string; types?: string[]; limit?: number; offset?: number } }
        ) => {
          if (!options?.domainId) return [];
          return knowledgeDomains.getContentByDomain(options);
        },
      },
      Mutation: {
        tagContent: async (
          _req: unknown,
          { options }: { options?: { targetType: string; targetId: string; domainIds: string[] } }
        ) => {
          if (!options?.targetType || !options?.targetId) return [];
          return knowledgeDomains.tagContent(options);
        },
      },
    },
  };
}
