import { theme } from './theme.js';
import { PageShell, Container, Button, Badge } from './ui.js';

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.sm,
  padding: '12px 14px',
  fontSize: 15,
  fontFamily: 'inherit',
  background: theme.color.white,
  color: theme.color.black,
};

/** Submit a new wishlist idea (registered member). */
export function WishlistNewPage() {
  return (
    <PageShell>
      <Container style={{ padding: '32px 20px 60px', maxWidth: 680 }}>
        <h1 style={{ fontSize: 30, fontWeight: 800, color: theme.color.primary, margin: '0 0 8px' }}>הצעת רעיון לכלי</h1>
        <p style={{ color: theme.color.textMuted, fontSize: 15.5, lineHeight: 1.6, marginTop: 0 }}>
          חסר לכם כלי שיכול לעזור בהתמודדות? שתפו את הרעיון, והקהילה תצביע. הרעיונות המובילים מקבלים עדיפות.
        </p>
        <div style={{ marginBottom: 20 }}><Badge tone="info">דרוש חשבון מחובר</Badge></div>
        <div style={{ display: 'grid', gap: 16 }}>
          <input style={inputStyle} placeholder="כותרת הרעיון" />
          <textarea style={{ ...inputStyle, minHeight: 130 }} placeholder="תארו את הרעיון — איזו בעיה הוא פותר ולמי הוא עוזר" />
          <input style={inputStyle} placeholder="תחומי התמודדות רלוונטיים (תגיות)" />
          <Button variant="accent" size="lg">שליחת הרעיון</Button>
        </div>
      </Container>
    </PageShell>
  );
}
