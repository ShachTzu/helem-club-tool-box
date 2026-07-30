import { mockPosts } from '@helemclub/blog.entities.post';
import type { PlainPost } from '@helemclub/blog.entities.post';

/**
 * mock post list, useful for previews and tests of usePosts consumers.
 */
export function mockPostList(): PlainPost[] {
  return mockPosts().map((post) => post.toObject());
}
