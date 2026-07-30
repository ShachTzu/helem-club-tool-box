import { v4 as uuid } from 'uuid';
import { Author, type PlainAuthor } from './author.js';

/**
 * create a mock Author with the ability to override any property.
 */
export function mockAuthor(overrides: Partial<PlainAuthor> = {}) {
  return Author.from({
    id: uuid(),
    userId: uuid(),
    name: 'ד״ר מיכל ברק',
    bio: 'פסיכולוגית קלינית וכותבת, מתמחה בהתמודדות עם פוסט-טראומה ובניית קהילות תמיכה.',
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    hasWritePermission: true,
    postCount: 12,
    lastPostDate: '2026-05-12',
    ...overrides,
  });
}

/**
 * create a list of mock Authors for development and testing purposes.
 */
export function mockAuthors() {
  return [
    mockAuthor(),
    mockAuthor({
      id: uuid(),
      userId: uuid(),
      name: 'רון אבני',
      bio: 'מתמודד ופעיל קהילתי, כותב על טריגרים וכלים יומיומיים.',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      hasWritePermission: true,
      postCount: 4,
      lastPostDate: '2026-04-28',
    }),
    mockAuthor({
      id: uuid(),
      userId: uuid(),
      name: 'תמר גל',
      bio: undefined,
      photo: undefined,
      hasWritePermission: false,
      postCount: 1,
      lastPostDate: '2026-04-19',
    }),
    mockAuthor({
      id: uuid(),
      userId: uuid(),
      name: 'אנונימי',
      bio: undefined,
      photo: undefined,
      hasWritePermission: false,
      postCount: 0,
      lastPostDate: undefined,
    }),
  ];
}
