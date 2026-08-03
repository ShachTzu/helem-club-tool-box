import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { mockUser } from '@helemclub/platform.entities.user';
import { mockApp, type PlainApp } from '@helemclub/toolbox.entities.app';
import { MySubmissions } from './my-submissions.js';

const member = mockUser({ role: `member`, displayName: `שם דוגמה` }).toObject();

const submissions: PlainApp[] = [
  { ...mockApp().toObject(), id: `1`, slug: `calm-breath`, name: `נשימה רגועה`, subtitle: `תרגול נשימות`, status: `approved` },
  { ...mockApp().toObject(), id: `2`, slug: `mood-diary`, name: `יומן מצב רוח`, subtitle: `מעקב יומי`, status: `pending` },
  { ...mockApp().toObject(), id: `3`, slug: `my-draft`, name: `הכלי שאני עדיין כותב`, subtitle: ``, status: `draft` },
  { ...mockApp().toObject(), id: `4`, slug: `needs-fix`, name: `צריך תיקון קטן`, subtitle: `הקישור לא עבד`, status: `changes_requested` },
];

export const BasicMySubmissions = () => (
  <MockProvider>
    <MySubmissions mockUser={member} mockData={submissions} />
  </MockProvider>
);

export const EmptyMySubmissions = () => (
  <MockProvider>
    <MySubmissions mockUser={member} mockData={[]} />
  </MockProvider>
);
