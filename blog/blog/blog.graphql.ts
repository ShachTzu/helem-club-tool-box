import { gql } from 'graphql-tag';
import type { GqlSchema } from '@bitdev/symphony.backends.backend-server';
import type { BlogNode } from './blog.node.runtime.js';

/**
 * builds the GraphQL schema exposing the blog API. the contract mirrors exactly
 * what the blog hooks send: hooks/use-posts (listPosts, getPost,
 * listPendingPosts, createPost, updatePost, submitPost, reviewPost,
 * incrementView), hooks/use-authors (listAuthors, setWritePermission) and
 * hooks/use-blog-stats (getBlogStats).
 *
 * the BlogPost type matches the BLOG_POST_FIELDS fragment exactly and never
 * exposes the community submitter contact details.
 */
export function blogGqlSchema(blog: BlogNode): GqlSchema {
  return {
    typeDefs: gql`
      type BlogPost {
        id: ID!
        slug: String!
        title: String!
        excerpt: String
        coverImage: String
        body: String
        authorName: String
        authorRef: String
        isStaffAuthor: Boolean
        domains: [String]
        embeddedApps: [String]
        status: String!
        visibility: String
        metaDescription: String
        publishDate: String
        viewCount: Int
        uniqueVisitors: Int
      }

      type BlogAuthor {
        id: ID!
        userId: String!
        name: String!
        bio: String
        photo: String
        hasWritePermission: Boolean
        postCount: Int
        lastPostDate: String
      }

      type BlogTopPost {
        id: ID!
        title: String!
        views: Int
      }

      type BlogAuthorPost {
        title: String!
        date: String
      }

      type BlogAuthorStats {
        name: String!
        postCount: Int
        lastPostDate: String
        posts: [BlogAuthorPost]
      }

      type BlogStats {
        id: String
        totalPosts: Int
        uniqueVisitors: Int
        totalViews: Int
        comments: Int
        reactions: Int
        saves: Int
        verifiedMembers: Int
        topPosts: [BlogTopPost]
        authors: [BlogAuthorStats]
      }

      input ListPostsOptions {
        domainIds: [String]
        query: String
        limit: Int
        offset: Int
      }

      input CreatePostOptions {
        title: String!
        excerpt: String!
        coverImage: String
        body: String!
        domains: [String]
        embeddedApps: [String]
        visibility: String
        metaDescription: String
      }

      input UpdatePostOptions {
        title: String
        excerpt: String
        coverImage: String
        body: String
        domains: [String]
        embeddedApps: [String]
        visibility: String
        metaDescription: String
      }

      input SubmitPostOptions {
        title: String!
        excerpt: String!
        coverImage: String
        body: String!
        domains: [String]
        submitterName: String!
        submitterEmail: String!
        submitterPhone: String!
        submitterFacebook: String!
        displayName: String
      }

      input BlogTimeRangeOptions {
        preset: String
        from: String
        to: String
      }

      input GetBlogStatsOptions {
        range: BlogTimeRangeOptions
      }

      type Query {
        listPosts(options: ListPostsOptions): [BlogPost]
        getPost(slug: String!): BlogPost
        listPendingPosts: [BlogPost]
        listAuthors: [BlogAuthor]
        getBlogStats(options: GetBlogStatsOptions): BlogStats
      }

      type Mutation {
        createPost(options: CreatePostOptions): BlogPost
        updatePost(id: ID!, options: UpdatePostOptions): BlogPost
        submitPost(options: SubmitPostOptions): BlogPost
        reviewPost(id: ID!, action: String!): BlogPost
        incrementPostView(postId: ID!, deviceId: String!): Boolean
        setWritePermission(userId: ID!, canWrite: Boolean!): BlogAuthor
      }
    `,
    resolvers: {
      Query: {
        listPosts: async (_req: unknown, { options }: { options?: any }, context: any) => {
          const posts = await blog.listPosts(options, context);
          return posts.map((post) => post.toObject());
        },
        getPost: async (_req: unknown, { slug }: { slug: string }, context: any) => {
          const post = await blog.getPost(slug, context);
          return post ? post.toObject() : null;
        },
        listPendingPosts: async (_req: unknown, _args: unknown, context: any) => {
          const posts = await blog.listPendingPosts(context);
          return posts.map((post) => post.toObject());
        },
        listAuthors: async () => {
          const authors = await blog.listAuthors();
          return authors.map((author) => author.toObject());
        },
        getBlogStats: async (_req: unknown, { options }: { options?: any }) => {
          const stats = await blog.getBlogStats(options?.range);
          return stats.toObject();
        },
      },
      Mutation: {
        createPost: async (_req: unknown, { options }: { options: any }, context: any) => {
          const post = await blog.createPost(options, context);
          return post.toObject();
        },
        updatePost: async (
          _req: unknown,
          { id, options }: { id: string; options: any },
          context: any
        ) => {
          const post = await blog.updatePost(id, options, context);
          return post ? post.toObject() : null;
        },
        submitPost: async (_req: unknown, { options }: { options: any }, context: any) => {
          const post = await blog.submitPost(options, context);
          return post.toObject();
        },
        reviewPost: async (
          _req: unknown,
          { id, action }: { id: string; action: string },
          context: any
        ) => {
          const post = await blog.reviewPost(id, action, context);
          return post ? post.toObject() : null;
        },
        incrementPostView: async (
          _req: unknown,
          { postId, deviceId }: { postId: string; deviceId: string }
        ) => {
          return blog.incrementView(postId, deviceId);
        },
        setWritePermission: async (
          _req: unknown,
          { userId, canWrite }: { userId: string; canWrite: boolean },
          context: any
        ) => {
          const author = await blog.setWritePermission(userId, canWrite, context);
          return author ? author.toObject() : null;
        },
      },
    },
  };
}
