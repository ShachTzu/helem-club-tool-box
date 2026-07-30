import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Login } from './login.js';

export const BasicLogin = () => {
  return (
    <MockProvider>
      <Login />
    </MockProvider>
  );
};

export const LoginWithCustomRedirect = () => {
  return (
    <MockProvider>
      <Login defaultRedirectPath="/toolbox" />
    </MockProvider>
  );
};

export const LoginWithGoogleConfigured = () => {
  const getGoogleIdToken = () => Promise.resolve(`mock-google-id-token`);

  return (
    <MockProvider>
      <Login getGoogleIdToken={getGoogleIdToken} />
    </MockProvider>
  );
};
