import type { FooterLink } from './footer-link-type.js';
import type { EmergencyContact } from './emergency-contact-type.js';

export const DEFAULT_FOOTER_LINKS: FooterLink[] = [
  { label: `ארגז כלים`, href: `/toolbox`, group: `האקוסיסטם` },
  { label: `ספריית הידע`, href: `/knowledge-library`, group: `האקוסיסטם` },
  { label: `בלוג`, href: `/blog`, group: `האקוסיסטם` },
  { label: `אירועים`, href: `/events`, group: `האקוסיסטם` },
  { label: `גלריית PTSDART`, href: `/gallery`, group: `האקוסיסטם` },
  { label: `תחומי התמודדות`, href: `/domains`, group: `קהילה` },
  { label: `שמורים שלי`, href: `/saved`, group: `קהילה` },
  { label: `התחברות / הרשמה`, href: `/login`, group: `קהילה` },
  { label: `אזור ניהול`, href: `/admin`, group: `קהילה` },
  // temporary link until the customer-facing area is added
  { label: `מהתוכנית לייצור`, href: `/plan-to-production`, group: `קהילה` },
];

export const DEFAULT_EMERGENCY_CONTACTS: EmergencyContact[] = [
  { label: `מד"א`, phone: `101` },
  { label: `ער"ן`, phone: `1201` },
];
