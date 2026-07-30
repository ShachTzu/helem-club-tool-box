import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Avatar } from './avatar.js';

export const BasicAvatar = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Avatar name="מיכל רבין" imageUrl="https://i.pravatar.cc/150?img=32" />
        <Avatar name="דניאל כהן" />
        <Avatar anonymous />
      </div>
    </MockProvider>
  );
};

export const AvatarSizes = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Avatar name="נועה לוי" size="small" imageUrl="https://i.pravatar.cc/150?img=5" />
        <Avatar name="נועה לוי" size="medium" imageUrl="https://i.pravatar.cc/150?img=5" />
        <Avatar name="נועה לוי" size="large" imageUrl="https://i.pravatar.cc/150?img=5" />
        <Avatar name="נועה לוי" size="x-large" imageUrl="https://i.pravatar.cc/150?img=5" />
      </div>
    </MockProvider>
  );
};

export const AvatarWithRingAndAnonymous = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 16, alignItems: 'center' }}>
        <Avatar name="צוות הלם קלאב" size="large" ring imageUrl="https://i.pravatar.cc/150?img=12" />
        <Avatar name="אנונימי/ת" size="large" ring anonymous />
        <Avatar name="ר." size="medium" ring />
      </div>
    </MockProvider>
  );
};
