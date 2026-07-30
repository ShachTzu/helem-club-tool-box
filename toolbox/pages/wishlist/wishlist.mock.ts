import type { WishlistIdea } from './wishlist-idea-type.js';

/**
 * seed catalog of community tool ideas, ported from the Helam Club prototype.
 */
export const WISHLIST_IDEAS: WishlistIdea[] = [
  {
    id: 'i1',
    title: 'אפליקציית יומן טריגרים',
    description:
      'כלי פשוט לתיעוד טריגרים יומיומיים וזיהוי דפוסים לאורך זמן, עם ייצוא למטפל.',
    domains: ['טריגרים', 'ויסות רגשי'],
    votes: 128,
    status: 'בבדיקה',
    author: 'רון א.',
  },
  {
    id: 'i2',
    title: 'קבוצת תמיכה קולית אנונימית',
    description:
      'חדרי אודיו אנונימיים למפגשי תמיכה קצרים בשעות הלילה, כשהכי קשה.',
    domains: ['בדידות וחיבור חברתי', 'שינה'],
    votes: 96,
    status: 'נאסף',
    author: 'אנונימי',
  },
  {
    id: 'i3',
    title: 'מדריך זכויות אינטראקטיבי',
    description:
      'שאלון שמכוון אותך בדיוק לזכויות שמגיעות לך מול המוסדות, לפי המצב האישי.',
    domains: ['מיצוי זכויות', 'עבודה וקריירה'],
    votes: 74,
    status: 'בפיתוח',
    author: 'תמר ג.',
  },
  {
    id: 'i4',
    title: 'תזכורות עדינות לתרופות',
    description:
      'אפליקציה מכבדת שלא מייצרת חרדה — תזכורות רכות ומעקב פשוט אחרי נטילת תרופות.',
    domains: ['תרופות ופסיכיאטריה'],
    votes: 53,
    status: 'נאסף',
    author: 'מיכל ב.',
  },
];
