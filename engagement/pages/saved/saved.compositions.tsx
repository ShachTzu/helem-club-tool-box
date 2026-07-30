import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Saved } from './saved.js';
import { mockSavedItems } from './saved.mock.js';

export const SavedWithItems = () => {
  return (
    <MockProvider>
      <Saved mockOptions={{ mockDeviceId: `device-preview`, mockSavedItems: mockSavedItems() }} />
    </MockProvider>
  );
};

export const EmptySavedList = () => {
  return (
    <MockProvider>
      <Saved mockOptions={{ mockDeviceId: `device-preview`, mockSavedItems: [] }} />
    </MockProvider>
  );
};

export const SavedWithCustomCopy = () => {
  return (
    <MockProvider>
      <Saved
        title="הרשימה שלי"
        subtitle="כל מה ששמרתם כדי לחזור אליו כשיהיה לכם זמן — שמור רק על המכשיר הזה."
        discoverHref="/blog"
        mockOptions={{ mockDeviceId: `device-preview`, mockSavedItems: mockSavedItems().slice(0, 2) }}
      />
    </MockProvider>
  );
};
