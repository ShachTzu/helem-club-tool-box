import { useState } from 'react';
import { theme } from './theme.js';
import { PageShell, Hero, Container, Card, Badge, Button } from './ui.js';

type Idea = {
  id: string;
  title: string;
  description: string;
  domains: string[];
  votes: number;
  status: 'נאסף' | 'בבדיקה' | 'בפיתוח';
  author: string;
};

const IDEAS: Idea[] = [
  {
    id: 'i1',
    title: 'אפליקציית יומן טריגרים',
    description: 'כלי פשוט לתיעוד טריגרים יומיומיים וזיהוי דפוסים לאורך זמן, עם ייצוא למטפל.',
    domains: ['טריגרים', 'ויסות רגשי'],
    votes: 128,
    status: 'בבדיקה',
    author: 'רון א.',
  },
  {
    id: 'i2',
    title: 'קבוצת תמיכה קולית אנונימית',
    description: 'חדרי אודיו אנונימיים למפגשי תמיכה קצרים בשעות הלילה, כשהכי קשה.',
    domains: ['בדידות וחיבור חברתי', 'שינה'],
    votes: 96,
    status: 'נאסף',
    author: 'אנונימי',
  },
  {
    id: 'i3',
    title: 'מדריך זכויות אינטראקטיבי',
    description: 'שאלון שמכוון אותך בדיוק לזכויות שמגיעות לך מול המוסדות, לפי המצב האישי.',
    domains: ['מיצוי זכויות', 'עבודה וקריירה'],
    votes: 74,
    status: 'בפיתוח',
    author: 'תמר ג.',
  },
  {
    id: 'i4',
    title: 'תזכורות עדינות לתרופות',
    description: 'אפליקציה מכבדת שלא מייצרת חרדה — תזכורות רכות ומעקב פשוט אחרי נטילת תרופות.',
    domains: ['תרופות ופסיכיאטריה'],
    votes: 53,
    status: 'נאסף',
    author: 'מיכל ב.',
  },
];

const statusTone: Record<Idea['status'], 'neutral' | 'info' | 'success'> = {
  'נאסף': 'neutral',
  'בבדיקה': 'info',
  'בפיתוח': 'success',
};

/** Toolbox wishlist — community ideas for new tools, with voting. */
export function WishlistPage() {
  const [votes, setVotes] = useState<Record<string, number>>(
    Object.fromEntries(IDEAS.map((i) => [i.id, i.votes]))
  );
  const [voted, setVoted] = useState<Record<string, boolean>>({});

  const toggleVote = (id: string) => {
    setVoted((prev) => {
      const has = prev[id];
      setVotes((v) => ({ ...v, [id]: v[id] + (has ? -1 : 1) }));
      return { ...prev, [id]: !has };
    });
  };

  const sorted = [...IDEAS].sort((a, b) => votes[b.id] - votes[a.id]);

  return (
    <PageShell>
      <Hero
        eyebrow="ארגז הכלים · Wishlist"
        title="רשימת המשאלות של הקהילה"
        subtitle="חסר לכם כלי? הציעו רעיון, והצביעו לרעיונות של אחרים. הרעיונות המובילים מקבלים עדיפות בפיתוח ובגיוס יזמים."
      >
        <Button to="/toolbox/wishlist/new" variant="accent">💡 הצעת רעיון</Button>
      </Hero>

      <Container style={{ padding: '32px 20px 64px', maxWidth: 820 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {sorted.map((idea) => (
            <Card key={idea.id} style={{ padding: 20, display: 'flex', gap: 18, alignItems: 'flex-start' }}>
              <button
                onClick={() => toggleVote(idea.id)}
                style={{
                  flexShrink: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 2,
                  minWidth: 62,
                  padding: '12px 8px',
                  borderRadius: theme.radius.md,
                  border: `1px solid ${voted[idea.id] ? theme.color.accent : theme.color.border}`,
                  background: voted[idea.id] ? 'rgba(232,159,75,0.14)' : theme.color.white,
                  color: voted[idea.id] ? '#b06f1e' : theme.color.secondary,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: 18 }}>▲</span>
                <span style={{ fontSize: 19, fontWeight: 900 }}>{votes[idea.id]}</span>
                <span style={{ fontSize: 11, fontWeight: 600 }}>הצבעות</span>
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                  <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: theme.color.primary }}>{idea.title}</h3>
                  <Badge tone={statusTone[idea.status]}>{idea.status}</Badge>
                </div>
                <p style={{ margin: '0 0 12px', fontSize: 14.5, color: theme.color.textMuted, lineHeight: 1.6 }}>{idea.description}</p>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  {idea.domains.map((d) => (
                    <span key={d} style={{ fontSize: 12, color: theme.color.secondary, background: theme.color.surface, border: `1px solid ${theme.color.border}`, padding: '3px 10px', borderRadius: theme.radius.pill }}>{d}</span>
                  ))}
                  <span style={{ fontSize: 12.5, color: theme.color.textMuted, marginInlineStart: 'auto' }}>הוצע ע״י {idea.author}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div style={{ marginTop: 26, background: theme.color.surface, borderRadius: theme.radius.md, padding: 18, fontSize: 13.5, color: theme.color.textMuted, textAlign: 'center', lineHeight: 1.6 }}>
          הצבעה דורשת חשבון מחובר. הרעיונות שמקבלים הכי הרבה הצבעות עולים לראש הרשימה ומקבלים עדיפות.
        </div>
      </Container>
    </PageShell>
  );
}
