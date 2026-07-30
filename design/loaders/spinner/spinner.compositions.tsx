import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { Spinner } from './spinner.js';

export const BasicSpinner = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 32 }}>
        <Spinner />
      </div>
    </MemoryRouter>
  );
};

export const SpinnerSizes = () => {
  return (
    <MemoryRouter>
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', padding: 32 }}>
        <Spinner size="small" />
        <Spinner size="medium" />
        <Spinner size="large" />
        <Spinner size="xLarge" />
      </div>
    </MemoryRouter>
  );
};

export const SpinnerWithMessage = () => {
  return (
    <MemoryRouter>
      <div style={{ padding: 32 }}>
        <Spinner size="large" message="מאמתים את פרטי ההתחברות שלך..." />
      </div>
    </MemoryRouter>
  );
};

export const AuthLoadingState = () => {
  return (
    <MemoryRouter>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 320,
          background: 'var(--colors-surface-background)',
        }}
      >
        <Spinner size="large" message="בודקים את החשבון שלך, רגע אחד..." />
      </div>
    </MemoryRouter>
  );
};
