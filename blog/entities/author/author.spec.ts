import { Author } from './author.js';
import { mockAuthor, mockAuthors } from './author.mock.js';

it('has an Author.from() method', () => {
  expect(Author.from).toBeTruthy();
});

it('should create an Author instance from a plain object', () => {
  const author = Author.from({
    id: 'author-1',
    userId: 'user-1',
    name: 'ד״ר מיכל ברק',
    bio: 'פסיכולוגית קלינית',
    photo: 'https://example.com/photo.png',
    hasWritePermission: true,
    postCount: 5,
    lastPostDate: '2026-05-12',
  });

  expect(author).toBeInstanceOf(Author);
  expect(author.id).toEqual('author-1');
  expect(author.userId).toEqual('user-1');
  expect(author.name).toEqual('ד״ר מיכל ברק');
  expect(author.bio).toEqual('פסיכולוגית קלינית');
  expect(author.photo).toEqual('https://example.com/photo.png');
  expect(author.hasWritePermission).toEqual(true);
  expect(author.postCount).toEqual(5);
  expect(author.lastPostDate).toEqual('2026-05-12');
});

it('should default hasWritePermission and postCount when missing', () => {
  const author = Author.from({
    id: 'author-2',
    userId: 'user-2',
    name: 'רון אבני',
  } as any);

  expect(author.hasWritePermission).toEqual(false);
  expect(author.postCount).toEqual(0);
});

it('should serialize an Author into a plain object with toObject()', () => {
  const author = mockAuthor({ id: 'author-3', name: 'תמר גל' });
  const plain = author.toObject();

  expect(plain).toEqual({
    id: 'author-3',
    userId: author.userId,
    name: 'תמר גל',
    bio: author.bio,
    photo: author.photo,
    hasWritePermission: author.hasWritePermission,
    postCount: author.postCount,
    lastPostDate: author.lastPostDate,
  });
});

it('should return an id in toObject()', () => {
  const author = mockAuthor({ id: 'author-4' });
  expect(author.toObject().id).toEqual('author-4');
});

it('mockAuthors() should return a list of Author instances', () => {
  const authors = mockAuthors();
  expect(authors.length).toBeGreaterThan(0);
  authors.forEach((author) => {
    expect(author).toBeInstanceOf(Author);
  });
});
