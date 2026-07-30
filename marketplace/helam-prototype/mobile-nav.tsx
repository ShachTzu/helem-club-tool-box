import { Link, useLocation } from 'react-router-dom';
import { theme } from './theme.js';

const ITEMS = [
  { label: 'בית', path: '/', icon: '🏠' },
  { label: 'כלים', path: '/toolbox', icon: '🧰' },
  { label: 'ידע', path: '/knowledge', icon: '📚' },
  { label: 'בלוג', path: '/blog', icon: '📝' },
  { label: 'אירועים', path: '/events', icon: '📅' },
];

/** Fixed bottom navigation for mobile / PWA. Hidden on desktop via CSS. */
export function MobileNav() {
  const { pathname } = useLocation();
  const isActive = (path: string) =>
    path === '/' ? pathname === '/' : pathname.startsWith(path);
  return (
    <nav
      className="helam-bottom-nav"
      style={{
        display: 'none',
        position: 'fixed',
        bottom: 0,
        insetInline: 0,
        background: theme.color.white,
        borderTop: `1px solid ${theme.color.border}`,
        boxShadow: '0 -4px 16px rgba(11,26,48,0.08)',
        zIndex: 60,
        padding: '6px 6px calc(6px + env(safe-area-inset-bottom))',
        justifyContent: 'space-around',
      }}
    >
      {ITEMS.map((item) => {
        const active = isActive(item.path);
        return (
          <Link
            key={item.path}
            to={item.path}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              textDecoration: 'none',
              color: active ? theme.color.accent : theme.color.textMuted,
              fontSize: 11,
              fontWeight: active ? 800 : 600,
              padding: '4px 0',
            }}
          >
            <span style={{ fontSize: 20, filter: active ? 'none' : 'grayscale(0.4)' }}>{item.icon}</span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
