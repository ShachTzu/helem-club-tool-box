import { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import { gql } from 'graphql-tag';
import type { GalleryNode } from './gallery.node.runtime.js';
import type {
  ListGalleryItemsOptions,
  CreateGalleryItemOptions,
  UpdateGalleryItemOptions,
} from './gallery-options.js';

export function galleryGqlSchema(galleryMain: GalleryNode): GqlSchema {
  return {
    typeDefs: gql`
      type GalleryItem {
        id: ID!
        slug: String!
        title: String!
        description: String
        mediaType: String
        mediaUrl: String!
        thumbnailUrl: String
        artistName: String
        domains: [String]
        createdAt: String
      }

      input ListGalleryItemsOptions {
        mediaType: String
        domainIds: [String]
        query: String
        limit: Int
      }

      input CreateGalleryItemOptions {
        title: String!
        description: String
        mediaType: String!
        mediaUrl: String!
        thumbnailUrl: String
        artistName: String
        domains: [String]
      }

      input UpdateGalleryItemOptions {
        title: String
        description: String
        mediaType: String
        mediaUrl: String
        thumbnailUrl: String
        artistName: String
        domains: [String]
      }

      type Query {
        listItems(options: ListGalleryItemsOptions): [GalleryItem]
        getItem(idOrSlug: String!): GalleryItem
      }

      type Mutation {
        createItem(options: CreateGalleryItemOptions): GalleryItem
        updateItem(id: ID!, options: UpdateGalleryItemOptions): GalleryItem
        deleteItem(id: ID!): Boolean
      }
    `,
    resolvers: {
      Query: {
        listItems: async (
          _: unknown,
          { options }: { options?: ListGalleryItemsOptions }
        ) => {
          const items = await galleryMain.listItems(options);
          return items.map((item) => item.toObject());
        },
        getItem: async (_: unknown, { idOrSlug }: { idOrSlug?: string }) => {
          if (!idOrSlug) return null;
          const item = await galleryMain.getItem(idOrSlug);
          return item ? item.toObject() : null;
        },
      },
      Mutation: {
        createItem: async (
          _: unknown,
          { options }: { options?: CreateGalleryItemOptions },
          context: { session?: { userId?: string } }
        ) => {
          if (!options) return null;
          const item = await galleryMain.createItem(options, context);
          return item.toObject();
        },
        updateItem: async (
          _: unknown,
          { id, options }: { id: string; options?: UpdateGalleryItemOptions },
          context: { session?: { userId?: string } }
        ) => {
          const item = await galleryMain.updateItem(id, options || {}, context);
          return item ? item.toObject() : null;
        },
        deleteItem: async (
          _: unknown,
          { id }: { id: string },
          context: { session?: { userId?: string } }
        ) => {
          return galleryMain.deleteItem(id, context);
        },
      },
    },
  };
}
