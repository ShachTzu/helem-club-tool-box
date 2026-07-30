import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { Hero } from './hero.js';

export const BasicHero = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <Hero />
      </HelamTheme>
    </MemoryRouter>
  );
};

export const HeroWithCustomContent = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <Hero
          eyebrow="קהילת הלם קלאב"
          title="ביחד, צעד אחר צעד, לדרך של החלמה"
          subtitle="פלטפורמה קהילתית שמחברת בין ידע מקצועי, כלים דיגיטליים וסיפורים אישיים - כדי שאף אחד לא יתמודד לבד."
          primaryCta={{ label: `התחילו כאן`, href: `/onboarding` }}
          secondaryCta={{ label: `קראו על הקהילה`, href: `/domains` }}
        />
      </HelamTheme>
    </MemoryRouter>
  );
};

export const HeroWithExternalSecondaryCta = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <Hero
          eyebrow="שותפים ותומכים"
          title="בונים יחד את ארגז הכלים של המחר"
          subtitle="הצטרפו כארגון שותף או תרמו ידע מקצועי למאגר הידע הקהילתי."
          primaryCta={{ label: `לארגז הכלים`, href: `/toolbox` }}
          secondaryCta={{ label: `אתר עמותת הלם קלאב`, href: `https://example.org`, external: true }}
        />
      </HelamTheme>
    </MemoryRouter>
  );
};
