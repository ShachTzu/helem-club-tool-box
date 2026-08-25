import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelamTheme } from '@helemclub/design.helam-theme';
import { Heading } from './heading.js';

export const AllHeadingLevels = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Heading level={1}>הלם קלאב — כותרת ראשית H1</Heading>
          <Heading level={2}>ארגז הכלים — כותרת H2</Heading>
          <Heading level={3}>ספריית הידע — כותרת H3</Heading>
          <Heading level={4}>אירועים קהילתיים — כותרת H4</Heading>
          <Heading level={5}>גלריית PTSDART — כותרת H5</Heading>
          <Heading level={6}>תחומי התמודדות — כותרת H6</Heading>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const HeadingColorsAndAlignment = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Heading level={2} color="primary">
            כותרת בצבע ראשי
          </Heading>
          <Heading level={2} color="secondary">
            כותרת בצבע משני
          </Heading>
          <Heading level={2} color="accent">
            כותרת בצבע הדגשה
          </Heading>
          <Heading level={2} color="muted" align="center">
            כותרת מעומעמת וממורכזת
          </Heading>
          <Heading level={2} align="left">
            כותרת מיושרת לשמאל
          </Heading>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};

export const HeadingOnHeroSurface = () => {
  return (
    <MemoryRouter>
      <HelamTheme>
        <div
          style={{
            padding: 40,
            background: 'var(--effects-gradients-primary)',
            borderRadius: 'var(--borders-radius-large)',
          }}
        >
          <Heading level={1} as="h1" color="inverse">
            מקום אחד, מסודר ונגיש — לכל מי שמתמודד
          </Heading>
          <Heading level={4} as="p" color="inverse" style={{ marginTop: 12, opacity: 0.85 }}>
            חממה שמאגדת ידע, כלים וחוויות אישיות מתוך קהילת הלם קלאב.
          </Heading>
        </div>
      </HelamTheme>
    </MemoryRouter>
  );
};
