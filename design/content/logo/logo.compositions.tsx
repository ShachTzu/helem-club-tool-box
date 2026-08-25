import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Logo } from './logo.js';

export const BasicLogo = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, background: 'var(--colors-primary-default)' }}>
        <Logo />
      </div>
    </MockProvider>
  );
};

export const LogoSizes = () => {
  return (
    <MockProvider>
      <div
        style={{
          padding: 24,
          background: 'var(--colors-primary-default)',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'flex-start',
        }}
      >
        <Logo size="small" />
        <Logo size="medium" />
        <Logo size="large" />
      </div>
    </MockProvider>
  );
};

export const LightVariantOnSurface = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, background: 'var(--colors-surface-background)' }}>
        <Logo variant="light" size="large" />
      </div>
    </MockProvider>
  );
};

export const BothVariantsOnTheirSurfaces = () => {
  return (
    <MockProvider>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 240px', padding: 24, background: 'var(--colors-primary-default)' }}>
          <Logo variant="dark" size="large" />
        </div>
        <div
          style={{ flex: '1 1 240px', padding: 24, background: 'var(--colors-surface-background)' }}
        >
          <Logo variant="light" size="large" />
        </div>
      </div>
    </MockProvider>
  );
};
