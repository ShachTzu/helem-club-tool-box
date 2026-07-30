import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { PostCard } from './post-card.js';

const sharedDomains = [
  { id: 'anxiety', slug: 'anxiety', name: `חרדה` },
  { id: 'mindfulness-breathing', slug: 'mindfulness-breathing', name: `מיינדפולנס ונשימות` },
];

export const BasicPostCard = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 340 }}>
        <PostCard
          title="הבושה שאף אחד לא מדבר עליה"
          excerpt="על אשמה ובושה אחרי טראומה — למה הן מופיעות, ואיך אפשר להתחיל לשחרר."
          coverImage="https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=80"
          authorName="ד״ר מיכל ברק"
          date="12 במאי 2026"
          domains={[
            { id: 'shame-guilt', slug: 'shame-guilt', name: `אשמה, בושה וביקורת עצמית` },
            { id: 'emotional-regulation', slug: 'emotional-regulation', name: `ויסות רגשי` },
          ]}
          href="/blog/shame-and-guilt"
        />
      </div>
    </MockProvider>
  );
};

export const MembersOnlyPostCard = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 340 }}>
        <PostCard
          title="זוגיות בצל הפוסט-טראומה"
          excerpt="שיתוף אישי על מערכת יחסים שמחזיקה שניים — כשאחד המתמודד מתמודד עם פוסט-טראומה."
          coverImage="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
          authorName="אנונימי"
          date="3 במאי 2026"
          domains={[
            { id: 'family-relationships', slug: 'family-relationships', name: `משפחה, זוגיות ויחסים` },
            { id: 'loneliness-connection', slug: 'loneliness-connection', name: `בדידות וחיבור חברתי` },
          ]}
          membersOnly
          href="/blog/couples-after-trauma"
        />
      </div>
    </MockProvider>
  );
};

export const PostCardGrid = () => {
  const posts = [
    {
      title: '5 כלים שעוזרים לי עם טריגרים',
      excerpt: 'רשימה פרקטית של כלים קטנים שאני משתמש בהם ברגעים של הצפה.',
      coverImage: 'https://images.unsplash.com/photo-1476611317561-60117649dd94?auto=format&fit=crop&w=900&q=80',
      authorName: 'רון אבני',
      date: '28 באפריל 2026',
      domains: sharedDomains,
      href: '/blog/triggers-toolkit',
    },
    {
      title: 'הלילות הארוכים — ומה שעזר לי לישון',
      excerpt: 'על נדודי שינה אחרי טראומה, וסיפור אישי על הדרך חזרה למנוחה.',
      coverImage: 'https://images.unsplash.com/photo-1520206183501-b80df61043c2?auto=format&fit=crop&w=900&q=80',
      authorName: 'תמר גל',
      date: '19 באפריל 2026',
      domains: [{ id: 'sleep', slug: 'sleep', name: `שינה` }],
      href: '/blog/sleep-story',
    },
    {
      title: 'הבושה שאף אחד לא מדבר עליה',
      excerpt: 'על אשמה ובושה אחרי טראומה — למה הן מופיעות, ואיך אפשר להתחיל לשחרר.',
      coverImage: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=900&q=80',
      authorName: 'ד״ר מיכל ברק',
      date: '12 במאי 2026',
      domains: [{ id: 'shame-guilt', slug: 'shame-guilt', name: `אשמה, בושה וביקורת עצמית` }],
      membersOnly: true,
      href: '/blog/shame-and-guilt',
    },
  ];

  return (
    <MockProvider>
      <div
        style={{
          padding: 24,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 18,
        }}
      >
        {posts.map((post) => (
          <PostCard key={post.href} {...post} />
        ))}
      </div>
    </MockProvider>
  );
};
