import { Post } from './post.js';
import { mockPost, mockPosts } from './post.mock.js';

it('has a Post.from() method', () => {
  expect(Post.from).toBeTruthy();
});

it('creates a Post instance from a plain object', () => {
  const post = Post.from({
    id: '1',
    slug: 'hello-world',
    title: 'Hello World',
    excerpt: 'An excerpt.',
    body: '<p>body</p>',
    authorName: 'Jane Doe',
    isStaffAuthor: false,
    domains: ['anxiety'],
    embeddedApps: [],
    status: 'draft',
    visibility: 'public',
    viewCount: 0,
    uniqueVisitors: 0,
  });

  expect(post).toBeInstanceOf(Post);
  expect(post.title).toEqual('Hello World');
  expect(post.slug).toEqual('hello-world');
});

it('applies default values for missing optional properties', () => {
  const post = Post.from({ title: 'Only a title' });

  expect(post.id).toEqual('');
  expect(post.status).toEqual('draft');
  expect(post.visibility).toEqual('public');
  expect(post.domains).toEqual([]);
  expect(post.embeddedApps).toEqual([]);
  expect(post.viewCount).toEqual(0);
  expect(post.uniqueVisitors).toEqual(0);
  expect(post.isStaffAuthor).toEqual(false);
});

it('serializes a Post into a plain object with toObject()', () => {
  const post = mockPost({ id: 'post-1' });
  const plain = post.toObject();

  expect(plain).toEqual({
    id: 'post-1',
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    coverImage: post.coverImage,
    body: post.body,
    authorName: post.authorName,
    authorRef: post.authorRef,
    isStaffAuthor: post.isStaffAuthor,
    domains: post.domains,
    embeddedApps: post.embeddedApps,
    status: post.status,
    visibility: post.visibility,
    metaDescription: post.metaDescription,
    publishDate: post.publishDate,
    viewCount: post.viewCount,
    uniqueVisitors: post.uniqueVisitors,
  });
});

it('exposes an isPublished getter based on status', () => {
  const published = mockPost({ status: 'published' });
  const draft = mockPost({ status: 'draft' });

  expect(published.isPublished).toBe(true);
  expect(draft.isPublished).toBe(false);
});

it('exposes an isMembersOnly getter based on visibility', () => {
  const membersOnly = mockPost({ visibility: 'members_only' });
  const publicPost = mockPost({ visibility: 'public' });

  expect(membersOnly.isMembersOnly).toBe(true);
  expect(publicPost.isMembersOnly).toBe(false);
});

it('creates unique mock posts with mockPosts()', () => {
  const posts = mockPosts();

  expect(posts.length).toBeGreaterThan(0);
  posts.forEach((post) => {
    expect(post).toBeInstanceOf(Post);
  });
});

it('supports partial overrides in mockPosts()', () => {
  const posts = mockPosts([{ title: 'Custom Title' }]);

  expect(posts[0].title).toEqual('Custom Title');
});
