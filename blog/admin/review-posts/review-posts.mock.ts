import { mockPosts } from '@helemclub/blog.entities.post';
import type { PendingPostMock } from './pending-post-type.js';

/**
 * default mock queue of posts awaiting moderation review, used for
 * previews, tests and as a graceful fallback when no live data is
 * available yet.
 */
export function mockPendingPostList(): PendingPostMock[] {
  return mockPosts([
    {
      slug: `grounding-toolkit`,
      title: `5 כלים שעוזרים לי עם טריגרים`,
      excerpt: `רשימה פרקטית של כלים קטנים שאני משתמש בהם ברגעים של הצפה, מהנשימה ועד להארקה.`,
      coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_calm__editorial_illustration_f_0_1785194279122.png`,
      authorName: `רון אבני`,
      isStaffAuthor: false,
      domains: [`טריגרים`, `מיינדפולנס ונשימות`],
      status: `pending`,
      visibility: `public`,
    },
    {
      slug: `gratitude-journal`,
      title: `יומן הכרת תודה — הרגל קטן שעשה לי שינוי`,
      excerpt: `איך שלוש שורות ביום החזירו לי תחושת שליטה קטנה על החיים.`,
      coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_calm__editorial_illustration_f_0_1785194271062.png`,
      authorName: `אנונימי`,
      isStaffAuthor: false,
      domains: [`ויסות רגשי`],
      status: `pending`,
      visibility: `members_only`,
    },
    {
      slug: `back-to-work`,
      title: `החזרה לעבודה אחרי תקופה קשה`,
      excerpt: `שיתפתי את הצוות שלי במה שעברתי — וזה שינה הכל. סיפור אישי על חזרה הדרגתית לשגרה.`,
      coverImage: `https://storage.googleapis.com/bit-generated-images/images/image_calm__editorial_illustration_f_0_1785194270630.png`,
      authorName: `ד״ר מיכל ברק`,
      isStaffAuthor: true,
      domains: [`תפקוד יומיומי`, `עבודה ותעסוקה`],
      status: `pending`,
      visibility: `public`,
    },
  ]).map((post) => post.toObject());
}
