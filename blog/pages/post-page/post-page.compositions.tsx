import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockPost } from '@helemclub/blog.entities.post';
import { PostPage } from './post-page.js';

/** A published post rendered in full. */
export const BasicPostPage = () => (
  <MockProvider>
    <PostPage mockPost={mockPost().toObject()} />
  </MockProvider>
);

/** Not-found state for a missing post. */
export const PostNotFound = () => (
  <MockProvider>
    <PostPage mockPost={null} />
  </MockProvider>
);
