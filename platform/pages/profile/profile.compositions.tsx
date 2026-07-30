import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Profile } from './profile.js';
import { mockProfileUser, mockProfileUserNoAvatar } from './profile.mock.js';

export const BasicProfile = () => {
  return (
    <MockProvider>
      <Profile mockUser={mockProfileUser} />
    </MockProvider>
  );
};

export const ProfileWithoutAvatar = () => {
  return (
    <MockProvider>
      <Profile mockUser={mockProfileUserNoAvatar} />
    </MockProvider>
  );
};

export const ProfileWithSaveHandler = () => {
  const handleSave = async () => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    return true;
  };

  return (
    <MockProvider>
      <Profile mockUser={{ ...mockProfileUser, role: `admin` }} onSave={handleSave} />
    </MockProvider>
  );
};

export const SignedOutProfile = () => {
  return (
    <MockProvider>
      <Profile mockUser={null} />
    </MockProvider>
  );
};
