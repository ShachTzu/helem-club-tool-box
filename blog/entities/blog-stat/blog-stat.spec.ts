import { BlogStats, BlogTopPost, BlogAuthorStats, BlogAuthorPost } from './blog-stat.js';
import { mockBlogStats, mockEmptyBlogStats } from './blog-stat.mock.js';

it('has a BlogStats.from() method', () => {
  expect(BlogStats.from).toBeTruthy();
});

it('creates a BlogStats entity from a plain object', () => {
  const stats = BlogStats.from({
    totalPosts: 10,
    uniqueVisitors: 100,
    totalViews: 500,
    topPosts: [{ id: 'p1', title: 'Post 1', views: 200 }],
    authors: [
      {
        name: 'Jane Doe',
        postCount: 3,
        lastPostDate: '2026-01-01',
        posts: [{ title: 'Post 1', date: '2026-01-01' }],
      },
    ],
    comments: 12,
    reactions: 34,
    saves: 5,
    verifiedMembers: 8,
  });

  expect(stats).toBeInstanceOf(BlogStats);
  expect(stats.totalPosts).toEqual(10);
  expect(stats.uniqueVisitors).toEqual(100);
  expect(stats.totalViews).toEqual(500);
  expect(stats.topPosts).toHaveLength(1);
  expect(stats.topPosts[0]).toBeInstanceOf(BlogTopPost);
  expect(stats.authors).toHaveLength(1);
  expect(stats.authors[0]).toBeInstanceOf(BlogAuthorStats);
  expect(stats.authors[0].posts[0]).toBeInstanceOf(BlogAuthorPost);
});

it('defaults missing numeric properties safely', () => {
  const stats = BlogStats.from({} as any);

  expect(stats.totalPosts).toEqual(0);
  expect(stats.uniqueVisitors).toEqual(0);
  expect(stats.totalViews).toEqual(0);
  expect(stats.topPosts).toEqual([]);
  expect(stats.authors).toEqual([]);
  expect(stats.comments).toEqual(0);
  expect(stats.reactions).toEqual(0);
  expect(stats.saves).toEqual(0);
  expect(stats.verifiedMembers).toEqual(0);
});

it('serializes a BlogStats entity into a plain object with an id', () => {
  const stats = mockBlogStats();
  const plain = stats.toObject();

  expect(plain.id).toEqual('current');
  expect(plain.totalPosts).toEqual(stats.totalPosts);
  expect(plain.topPosts[0]).toEqual({
    id: stats.topPosts[0].id,
    title: stats.topPosts[0].title,
    views: stats.topPosts[0].views,
  });
  expect(plain.authors[0].posts[0]).toEqual({
    title: stats.authors[0].posts[0].title,
    date: stats.authors[0].posts[0].date,
  });
});

it('returns a virtual id for author stats derived from the author name', () => {
  const stats = mockBlogStats();
  expect(stats.authors[0].id).toEqual(stats.authors[0].name);
});

it('creates an empty BlogStats mock with zeroed values', () => {
  const stats = mockEmptyBlogStats();

  expect(stats.totalPosts).toEqual(0);
  expect(stats.topPosts).toEqual([]);
  expect(stats.authors).toEqual([]);
});

it('supports partial overrides in mockBlogStats', () => {
  const stats = mockBlogStats({ totalPosts: 99 });
  expect(stats.totalPosts).toEqual(99);
  expect(stats.totalViews).toBeGreaterThan(0);
});
