import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Footer } from './footer.js';
import type { FooterLink } from './footer-link-type.js';

const ecosystemLinks: FooterLink[] = [
  { label: `ארגז כלים`, href: `/toolbox`, group: `האקוסיסטם` },
  { label: `ספריית הידע`, href: `/knowledge`, group: `האקוסיסטם` },
  { label: `בלוג`, href: `/blog`, group: `האקוסיסטם` },
  { label: `אירועים`, href: `/events`, group: `האקוסיסטם` },
  { label: `גלריית PTSDART`, href: `/gallery`, group: `האקוסיסטם` },
  { label: `תחומי התמודדות`, href: `/domains`, group: `קהילה` },
  { label: `שמורים שלי`, href: `/saved`, group: `קהילה` },
  { label: `התחברות / הרשמה`, href: `/login`, group: `קהילה` },
];

export const BasicFooter = () => {
  return (
    <MockProvider>
      <Footer />
    </MockProvider>
  );
};

export const FooterWithCustomLinks = () => {
  return (
    <MockProvider>
      <Footer
        links={ecosystemLinks}
        description="קהילה תומכת של בוגרי קרב, ניצולי אירועים ובני משפחה - יחד, בלי שיפוטיות."
      />
    </MockProvider>
  );
};

export const FooterWithSingleGroup = () => {
  const supportLinks: FooterLink[] = [
    { label: `צור קשר`, href: `/contact`, group: `תמיכה` },
    { label: `שאלות נפוצות`, href: `/faq`, group: `תמיכה` },
    { label: `מדיניות פרטיות`, href: `/privacy`, group: `תמיכה` },
  ];

  return (
    <MockProvider>
      <Footer links={supportLinks} facebookUrl="https://facebook.com/helamclub" instagramUrl="https://instagram.com/helamclub" />
    </MockProvider>
  );
};
