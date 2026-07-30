import { mockPost } from '@helemclub/blog.entities.post';
import type { PlainPost } from '@helemclub/blog.entities.post';

/**
 * mock published posts for the blog home page, tagged with domain ids that
 * match the domain filter's mock domains.
 */
export function mockBlogHomePosts(): PlainPost[] {
  return [
    mockPost({
      slug: 'shame-and-guilt',
      title: `הבושה שאף אחד לא מדבר עליה`,
      excerpt: `על אשמה ובושה אחרי טראומה — למה הן מופיעות, ואיך אפשר להתחיל לשחרר.`,
      coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_calm__warm_editorial_illustr_0_1785198190597.png`,
      authorName: `ד״ר מיכל ברק`,
      isStaffAuthor: true,
      domains: ['guilt-shame', 'emotional-regulation'],
      status: 'published',
      visibility: 'public',
      publishDate: '2026-05-12',
      viewCount: 1240,
      uniqueVisitors: 860,
    }).toObject(),
    mockPost({
      slug: 'sleep-story',
      title: `הלילות הארוכים — ומה שעזר לי לישון`,
      excerpt: `על נדודי שינה אחרי טראומה, וסיפור אישי על הדרך חזרה למנוחה.`,
      coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_serene_editorial_illustratio_0_1785198188974.png`,
      authorName: `תמר גל`,
      isStaffAuthor: false,
      domains: ['sleep', 'anxiety'],
      status: 'published',
      visibility: 'public',
      publishDate: '2026-04-19',
      viewCount: 640,
      uniqueVisitors: 512,
    }).toObject(),
    mockPost({
      slug: 'couples-after-trauma',
      title: `זוגיות בצל הפוסט-טראומה`,
      excerpt: `שיתוף אישי על מערכת יחסים שמחזיקה שניים — כשאחד המתמודד מתמודד עם פוסט-טראומה.`,
      coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_gentle_editorial_illustratio_0_1785198189545.png`,
      authorName: `אנונימי`,
      isStaffAuthor: false,
      domains: ['family-relationships', 'loneliness-connection'],
      status: 'published',
      visibility: 'members_only',
      publishDate: '2026-05-03',
      viewCount: 640,
      uniqueVisitors: 512,
    }).toObject(),
    mockPost({
      slug: 'triggers-toolkit',
      title: `5 כלים שעוזרים לי עם טריגרים`,
      excerpt: `רשימה פרקטית של כלים קטנים שאני משתמש בהם ברגעים של הצפה.`,
      coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_calm__warm_editorial_illustr_0_1785198190597.png`,
      authorName: `רון אבני`,
      isStaffAuthor: false,
      domains: ['triggers', 'mindfulness-breathing', 'anxiety'],
      status: 'published',
      visibility: 'public',
      publishDate: '2026-04-28',
      viewCount: 410,
      uniqueVisitors: 322,
    }).toObject(),
    mockPost({
      slug: 'pending-article',
      title: `כתבה הממתינה לאישור`,
      excerpt: `כתבה זו נמצאת עדיין בבדיקה ולא תופיע בעמוד הבלוג הציבורי.`,
      coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_a_serene_editorial_illustratio_0_1785198188974.png`,
      authorName: `כותב קהילה`,
      isStaffAuthor: false,
      domains: ['work-career'],
      status: 'pending',
      visibility: 'public',
      viewCount: 0,
      uniqueVisitors: 0,
    }).toObject(),
  ];
}
