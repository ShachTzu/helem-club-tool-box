import { Link } from 'react-router-dom';
import { theme } from './theme.js';

/** Site footer with ecosystem links, social, and the medical disclaimer. */
export function Footer() {
  const col: React.CSSProperties = { display: 'flex', flexDirection: 'column', gap: 9 };
  const link: React.CSSProperties = {
    color: 'rgba(255,255,255,0.72)',
    textDecoration: 'none',
    fontSize: 14,
  };
  const heading: React.CSSProperties = {
    color: theme.color.white,
    fontWeight: 800,
    fontSize: 15,
    marginBottom: 4,
  };
  return (
    <footer style={{ background: theme.color.primary, color: theme.color.white, marginTop: 20 }}>
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '44px 20px 28px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 32,
        }}
      >
        <div style={{ ...col, gap: 12 }}>
          <div style={{ fontWeight: 900, fontSize: 20 }}>
            <span style={{ color: theme.color.accent }}>●</span> הלם קלאב
          </div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
            האקוסיסטם הדיגיטלי של קהילת המתמודדים עם פוסט-טראומה — מקום אחד, מסודר ונגיש.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: 20 }}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={link}>📘</a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={link}>📷</a>
          </div>
        </div>
        <div style={col}>
          <div style={heading}>האקוסיסטם</div>
          <Link to="/toolbox" style={link}>ארגז כלים</Link>
          <Link to="/knowledge" style={link}>מאגר ידע</Link>
          <Link to="/blog" style={link}>בלוג</Link>
          <Link to="/events" style={link}>אירועים</Link>
          <Link to="/gallery" style={link}>גלריית PTSDART</Link>
        </div>
        <div style={col}>
          <div style={heading}>קהילה</div>
          <Link to="/domains" style={link}>תחומי התמודדות</Link>
          <Link to="/saved" style={link}>שמורים שלי</Link>
          <Link to="/login" style={link}>התחברות / הרשמה</Link>
          <Link to="/admin" style={link}>אזור ניהול</Link>
        </div>
        <div style={col}>
          <div style={heading}>מקרה חירום</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13.5, lineHeight: 1.7, margin: 0 }}>
            האתר אינו למצבי חירום. במצוקה מיידית:
            <br />מד״א — 101
            <br />ער״ן — 1201
          </p>
        </div>
      </div>
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.1)',
          padding: '16px 20px',
          textAlign: 'center',
          fontSize: 12.5,
          color: 'rgba(255,255,255,0.5)',
          lineHeight: 1.6,
        }}
      >
        התכנים באתר הם חוויה אישית, ידע והשראה — אינם ייעוץ, אבחון או טיפול, ואינם תחליף לטיפול מקצועי.
        © {new Date().getFullYear()} הלם קלאב
      </div>
    </footer>
  );
}
