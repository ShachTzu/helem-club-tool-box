import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Signup } from './signup.js';

export const BasicSignup = () => {
  return (
    <MockProvider>
      <Signup />
    </MockProvider>
  );
};

export const SignupWithGoogleIntegration = () => {
  return (
    <MockProvider>
      <Signup
        requestGoogleIdToken={() => Promise.resolve(`mock-google-id-token`)}
      />
    </MockProvider>
  );
};

export const SignupWithCustomLoginLink = () => {
  return (
    <MockProvider>
      <Signup loginHref="/auth/login" />
    </MockProvider>
  );
};
