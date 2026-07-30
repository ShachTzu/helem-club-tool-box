import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { Badge } from './badge.js';

export const BasicBadge = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <Badge>חדש</Badge>
      </div>
    </MockProvider>
  );
};

export const BadgeVariants = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <Badge variant="neutral">כללי</Badge>
        <Badge variant="accent">מומלץ</Badge>
        <Badge variant="success">פעיל</Badge>
        <Badge variant="warning">ממתין</Badge>
        <Badge variant="danger">שגוי</Badge>
      </div>
    </MockProvider>
  );
};

export const BadgeWithDotAndCount = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <Badge variant="success" showDot>
          מחובר
        </Badge>
        <Badge variant="danger" showDot>
          לא מקוון
        </Badge>
        <Badge variant="accent">12 חדשים</Badge>
        <Badge variant="neutral">3</Badge>
      </div>
    </MockProvider>
  );
};
