import { v4 as uuidv4 } from 'uuid';
import { Post } from './post.js';
import type { PlainPost } from './post.js';

const img = (seed: string, w = 900) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=${w}&q=80`;

/**
 * create a single mock Post, with optional partial overrides.
 */
export function mockPost(overrides: Partial<PlainPost> = {}): Post {
  return Post.from({
    id: uuidv4(),
    slug: 'shame-and-guilt',
    title: 'הבושה שאף אחד לא מדבר עליה',
    excerpt: 'על אשמה ובושה אחרי טראומה — למה הן מופיעות, ואיך אפשר להתחיל לשחרר.',
    coverImage: img('photo-1499209974431-9dddcece7f88'),
    body: '<p>זהו טקסט הדגמה לגוף הכתבה, הכולל פסקאות, ציטוטים ובלוקי אפליקציה מוטמעים.</p>',
    authorName: 'ד״ר מיכל ברק',
    authorRef: undefined,
    isStaffAuthor: true,
    domains: ['אשמה, בושה וביקורת עצמית', 'ויסות רגשי'],
    embeddedApps: ['ground-me'],
    status: 'published',
    visibility: 'public',
    metaDescription: 'על אשמה ובושה אחרי טראומה — למה הן מופיעות, ואיך אפשר להתחיל לשחרר.',
    publishDate: '2026-05-12',
    viewCount: 1240,
    uniqueVisitors: 860,
    ...overrides,
  });
}

/**
 * create a list of mock Posts, useful for feeds and listing pages.
 */
export function mockPosts(overrides: Partial<PlainPost>[] = []): Post[] {
  const defaults: Partial<PlainPost>[] = [
    {
      slug: 'shame-and-guilt',
      title: 'הבושה שאף אחד לא מדבר עליה',
      excerpt: 'על אשמה ובושה אחרי טראומה — למה הן מופיעות, ואיך אפשר להתחיל לשחרר.',
      coverImage: img('photo-1499209974431-9dddcece7f88'),
      authorName: 'ד״ר מיכל ברק',
      isStaffAuthor: true,
      domains: ['אשמה, בושה וביקורת עצמית', 'ויסות רגשי'],
      status: 'published',
      visibility: 'public',
      publishDate: '2026-05-12',
      viewCount: 1240,
      uniqueVisitors: 860,
    },
    {
      slug: 'couples-after-trauma',
      title: 'זוגיות בצל הפוסט-טראומה',
      excerpt: 'שיתוף אישי על מערכת יחסים שמחזיקה שניים — כשאחד המתמודד.',
      coverImage: img('photo-1522202176988-66273c2fd55f'),
      authorName: 'אנונימי',
      isStaffAuthor: false,
      domains: ['משפחה, זוגיות ויחסים', 'בדידות וחיבור חברתי'],
      status: 'published',
      visibility: 'members_only',
      publishDate: '2026-05-03',
      viewCount: 640,
      uniqueVisitors: 512,
    },
    {
      slug: 'triggers-toolkit',
      title: '5 כלים שעוזרים לי עם טריגרים',
      excerpt: 'רשימה פרקטית של כלים קטנים שאני משתמש בהם ברגעים של הצפה.',
      coverImage: img('photo-1476611317561-60117649dd94'),
      authorName: 'רון אבני',
      isStaffAuthor: false,
      domains: ['טריגרים', 'מיינדפולנס ונשימות', 'חרדה'],
      embeddedApps: ['ground-me', 'breathe-calm'],
      status: 'pending',
      visibility: 'public',
      viewCount: 0,
      uniqueVisitors: 0,
    },
    {
      slug: 'sleep-story',
      title: 'הלילות הארוכים — ומה שעזר לי לישון',
      excerpt: 'על נדודי שינה אחרי טראומה, וסיפור אישי על הדרך חזרה למנוחה.',
      coverImage: img('photo-1520206183501-b80df61043c2'),
      authorName: 'תמר גל',
      isStaffAuthor: false,
      domains: ['שינה', 'חרדה'],
      status: 'draft',
      visibility: 'public',
      viewCount: 0,
      uniqueVisitors: 0,
    },
  ];

  return defaults.map((defaultPost, index) =>
    mockPost({ ...defaultPost, ...overrides[index] })
  );
}
