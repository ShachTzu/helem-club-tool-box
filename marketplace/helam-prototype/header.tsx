import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { theme } from './theme.js';

/** Primary ecosystem navigation items. */
export const NAV_ITEMS = [
  { label: 'בית', path: '/' },
  { label: 'חוכמת הקהילה', path: '/wisdom' },
  { label: 'ארגז כלים', path: '/toolbox' },
  { label: 'מאגר ידע', path: '/knowledge' },
  { label: 'בלוג', path: '/blog' },
  { label: 'אירועים', path: '/events' },
  { label: 'גלריית PTSDART', path: '/gallery' },
  { label: 'תחומי התמודדות', path: '/domains' },
];

/** Top navigation bar with the Helam Club brand and ecosystem sections. */
export function Header() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);

  const navLink = (active: boolean): React.CSSProperties => ({
    color: theme.color.white,
    textDecoration: 'none',
    fontSize: 14.5,
    fontWeight: active ? 800 : 600,
    opacity: active ? 1 : 0.82,
    padding: '6px 2px',
    borderBottom: `2px solid ${active ? theme.color.accent : 'transparent'}`,
    whiteSpace: 'nowrap',
  });

  return (
    <header
      style={{
        background: theme.color.primary,
        boxShadow: theme.shadow.header,
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: 1180,
          margin: '0 auto',
          padding: '0 20px',
          height: 62,
          display: 'flex',
          alignItems: 'center',
          gap: 22,
        }}
      >
        <Link
          to="/"
          style={{
            color: theme.color.white,
            textDecoration: 'none',
            fontWeight: 900,
            fontSize: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{ color: theme.color.accent }}>●</span> הלם קלאב
        </Link>

        {/* desktop nav */}
        <nav className="helam-desktop-nav" style={{ display: 'flex', gap: 18, alignItems: 'center', flex: 1 }}>
          {NAV_ITEMS.map((item) => (
            <Link key={item.path} to={item.path} style={navLink(isActive(item.path))}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="helam-desktop-nav" style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link
            to="/saved"
            style={{ color: theme.color.white, textDecoration: 'none', fontSize: 18, opacity: 0.85 }}
            aria-label="שמורים"
          >
            🔖
          </Link>
          <Link
            to="/login"
            style={{
              background: theme.color.accent,
              color: theme.color.primary,
              textDecoration: 'none',
              fontWeight: 700,
              fontSize: 14,
              padding: '8px 16px',
              borderRadius: theme.radius.pill,
            }}
          >
            התחברות
          </Link>
        </div>

        {/* mobile hamburger */}
        <button
          className="helam-mobile-toggle"
          onClick={() => setOpen((v) => !v)}
          style={{
            display: 'none',
            marginInlineStart: 'auto',
            background: 'transparent',
            border: 'none',
            color: theme.color.white,
            fontSize: 26,
            cursor: 'pointer',
          }}
          aria-label="תפריט"
        >
          ☰
        </button>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="helam-mobile-drawer" style={{ background: '#12294a', padding: '8px 20px 16px' }}>
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              style={{
                display: 'block',
                color: theme.color.white,
                textDecoration: 'none',
                fontSize: 16,
                fontWeight: isActive(item.path) ? 800 : 600,
                padding: '11px 0',
                borderBottom: `1px solid rgba(255,255,255,0.08)`,
              }}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/login"
            onClick={() => setOpen(false)}
            style={{
              display: 'inline-block',
              marginTop: 14,
              background: theme.color.accent,
              color: theme.color.primary,
              textDecoration: 'none',
              fontWeight: 700,
              padding: '10px 20px',
              borderRadius: theme.radius.pill,
            }}
          >
            התחברות / הרשמה
          </Link>
        </div>
      )}
    </header>
  );
}
