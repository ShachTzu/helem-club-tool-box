import { useMemo } from 'react';
import { useAuth, type UseAuthOptions } from '@helemclub/platform.hooks.use-auth';
import { useDeviceId } from '@helemclub/platform.hooks.use-device-id';
import type { Post, PlainPost } from '@helemclub/blog.entities.post';
import { useListPosts } from './use-list-posts.js';
import { useCreatePost, type CreatePostInput } from './use-create-post.js';
import { useUpdatePost, type UpdatePostInput } from './use-update-post.js';
import { useSubmitPost, type SubmitPostInput } from './use-submit-post.js';
import { useReviewPost, type ReviewPostAction } from './use-review-post.js';
import { useIncrementView } from './use-increment-view.js';

export type UsePostsOptions = {
  /**
   * restrict results to posts tagged with any of the given coping-domains.
   */
  domainIds?: string[];

  /**
   * free-text search query matched against post content.
   */
  query?: string;

  /**
   * maximum number of posts to return.
   */
  limit?: number;

  /**
   * number of posts to skip, for pagination.
   */
  offset?: number;

  /**
   * provide mock data for the post list to bypass the GraphQL query,
   * useful for tests and previews.
   */
  mockData?: PlainPost[];

  /**
   * provide mock data for the current user to bypass the auth query,
   * useful for tests and previews. pass null to simulate a signed-out
   * state.
   */
  mockUser?: UseAuthOptions['mockData'];

  /**
   * override the generated/persisted anonymous device id, useful for
   * tests and previews.
   */
  mockDeviceId?: string;
};

export type UsePostsValue = {
  /**
   * published posts matching the requested filters, gated by community
   * membership when a post is marked as members-only.
   */
  posts: Post[];

  /**
   * whether the post list is still loading.
   */
  loading: boolean;

  /**
   * error raised while loading the post list, if any.
   */
  error?: Error;

  /**
   * re-fetches the post list from the server.
   */
  refetch: () => Promise<unknown>;

  /**
   * whether the current visitor is signed in and may read members-only
   * content.
   */
  isMember: boolean;

  /**
   * whether the current user may create or edit posts.
   */
  canWrite: boolean;

  /**
   * whether the current user may review pending submissions.
   */
  canModerate: boolean;

  /**
   * the anonymous device id used to track unique views.
   */
  deviceId: string;

  /**
   * creates a new post, authored by the currently signed-in writer.
   */
  createPost: (input: CreatePostInput) => Promise<Post | undefined>;

  /**
   * whether a create mutation is in flight.
   */
  creating: boolean;

  /**
   * updates an existing post's fields.
   */
  updatePost: (id: string, input: UpdatePostInput) => Promise<Post | undefined>;

  /**
   * whether an update mutation is in flight.
   */
  updating: boolean;

  /**
   * submits a community-authored article for moderation review.
   */
  submitPost: (input: SubmitPostInput) => Promise<Post | undefined>;

  /**
   * whether a submission mutation is in flight.
   */
  submitting: boolean;

  /**
   * approves or rejects a pending post submission.
   */
  reviewPost: (id: string, action: ReviewPostAction) => Promise<Post | undefined>;

  /**
   * whether a review mutation is in flight.
   */
  reviewing: boolean;

  /**
   * records a view for the given post, keyed by the current anonymous
   * device id, so unique visitors can be tracked without authentication.
   */
  incrementView: (postId: string) => Promise<boolean>;
};

/**
 * manages the blog post reading experience: lists published posts
 * filtered by coping-domain and free-text query, gates members-only posts
 * behind the current authentication state, and exposes actions for
 * creating, updating, submitting, reviewing and tracking views of posts.
 * relies on the platform's useAuth for membership/role checks and
 * useDeviceId for anonymous view tracking.
 */
export function usePosts(options?: UsePostsOptions): UsePostsValue {
  const hasMockUser = options !== undefined && Object.prototype.hasOwnProperty.call(options, 'mockUser');

  const { user, canWrite, isModerator } = useAuth(hasMockUser ? { mockData: options?.mockUser } : undefined);
  const deviceId = useDeviceId({ mockDeviceId: options?.mockDeviceId });

  const { posts: fetchedPosts, loading, error, refetch } = useListPosts({
    domainIds: options?.domainIds,
    query: options?.query,
    limit: options?.limit,
    offset: options?.offset,
    mockData: options?.mockData,
  });

  const isMember = Boolean(user);

  const posts = useMemo(
    () =>
      fetchedPosts.filter(
        (post) => post.isPublished && (!post.isMembersOnly || isMember)
      ),
    [fetchedPosts, isMember]
  );

  const { createPost, loading: creating } = useCreatePost();
  const { updatePost, loading: updating } = useUpdatePost();
  const { submitPost, loading: submitting } = useSubmitPost();
  const { reviewPost, loading: reviewing } = useReviewPost();
  const { incrementView: incrementViewMutation } = useIncrementView();

  const incrementView = (postId: string) => incrementViewMutation(postId, deviceId);

  return {
    posts,
    loading,
    error,
    refetch,
    isMember,
    canWrite,
    canModerate: isModerator,
    deviceId,
    createPost,
    creating,
    updatePost,
    updating,
    submitPost,
    submitting,
    reviewPost,
    reviewing,
    incrementView,
  };
}
