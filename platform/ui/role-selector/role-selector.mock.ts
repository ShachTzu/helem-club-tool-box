import type { RoleOption } from './role-option-type.js';

/**
 * the default set of role options rendered by the role selector, covering
 * the full Helem Club role hierarchy with Hebrew labels and descriptions.
 */
export const DEFAULT_ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'member',
    label: 'חבר קהילה',
    description: 'גישה לתוכן חברי-קהילה ושמירת מועדפים',
    icon: '🙂',
  },
  {
    role: 'writer',
    label: 'כותב',
    description: 'יכול ליצור ולערוך תוכן',
    icon: '✍️',
  },
  {
    role: 'moderator',
    label: 'מודרטור',
    description: 'מנהל תגובות ומאשר הגשות',
    icon: '🛡️',
  },
  {
    role: 'admin',
    label: 'אדמין',
    description: 'גישה מלאה לניהול המערכת',
    icon: '👑',
  },
];
