import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { CtaButton } from './cta-button.js';

export const HeroCta = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          padding: 64,
          background: 'linear-gradient(160deg, #0B1A30 0%, #12294a 100%)',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <CtaButton href="/toolbox">גלו את ארגז הכלים</CtaButton>
      </div>
    </MemoryRouter>
  );
};

export const SectionCtaSizes = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 32, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <CtaButton size="sm">הצטרפו לקהילה</CtaButton>
        <CtaButton size="md">הצטרפו לקהילה</CtaButton>
        <CtaButton size="lg">הצטרפו לקהילה</CtaButton>
      </div>
    </MemoryRouter>
  );
};

export const FullWidthAndLoadingCta = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 360 }}>
        <CtaButton fullWidth>הרשמה לניוזלטר</CtaButton>
        <CtaButton loading>שולח בקשה...</CtaButton>
        <CtaButton disabled>לא זמין כרגע</CtaButton>
      </div>
    </MemoryRouter>
  );
};
