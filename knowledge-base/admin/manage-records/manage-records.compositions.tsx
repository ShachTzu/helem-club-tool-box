import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { ManageRecords } from './manage-records.js';
import type { ManageRecordsMockRecord } from './manage-records-mock-record-type.js';
import type { ManageRecordsMockLabel } from './manage-records-mock-label-type.js';

const mockLabels: ManageRecordsMockLabel[] = [
  {
    id: `label-first-aid`,
    slug: `first-aid`,
    name: `עזרה ראשונה`,
    description: `כלים מיידיים לרגעי הצפה, חרדה ומשבר.`,
    recordCount: 2,
  },
  {
    id: `label-after`,
    slug: `after`,
    name: `אפטר`,
    description: `סדרת שיחות על החיים שאחרי.`,
    recordCount: 1,
  },
];

const mockRecords: ManageRecordsMockRecord[] = [
  {
    id: `rec-1`,
    slug: `grounding-flashbacks`,
    labelId: `label-first-aid`,
    title: `קרקוע ברגע של פלאשבק`,
    mediaType: `video`,
    mediaUrl: `https://example.com/media/grounding-flashbacks.mp4`,
    thumbnailUrl:
      `https://storage.googleapis.com/bit-generated-images/images/image_calm__soothing_therapeutic_vid_0_1785194430013.png`,
    domains: [`טריגרים`, `חרדה`],
    viewCount: 3240,
    publishedAt: `2026-03-01T09:00:00.000Z`,
  },
  {
    id: `rec-2`,
    slug: `panic-breathing`,
    labelId: `label-first-aid`,
    title: `נשימה בזמן התקף חרדה`,
    mediaType: `audio`,
    mediaUrl: `https://example.com/media/panic-breathing.mp3`,
    thumbnailUrl:
      `https://storage.googleapis.com/bit-generated-images/images/image_calm_podcast_audio_cover_art___0_1785194429395.png`,
    domains: [`חרדה`, `מיינדפולנס ונשימות`],
    viewCount: 2115,
    publishedAt: `2026-02-18T09:00:00.000Z`,
  },
  {
    id: `rec-3`,
    slug: `life-after-panel`,
    labelId: `label-after`,
    title: `החיים שאחרי — שולחן עגול`,
    mediaType: `video`,
    mediaUrl: `https://example.com/media/life-after-panel.mp4`,
    thumbnailUrl:
      `https://storage.googleapis.com/bit-generated-images/images/image_warm_supportive_group_conversa_0_1785194430053.png`,
    domains: [`משפחה, זוגיות ויחסים`],
    viewCount: 1870,
    publishedAt: `2026-01-22T09:00:00.000Z`,
  },
];

const adminUser = {
  id: `user-1`,
  email: `admin@helam.club`,
  displayName: `הלם אדמין`,
  role: `admin` as const,
  provider: `email` as const,
  createdAt: `2025-01-01T09:00:00.000Z`,
};

export const AdminManageRecords = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageRecords mockUser={adminUser} mockRecords={mockRecords} mockLabels={mockLabels} />
      </div>
    </MockProvider>
  );
};

export const EmptyRecordsList = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageRecords mockUser={adminUser} mockRecords={[]} mockLabels={mockLabels} />
      </div>
    </MockProvider>
  );
};

export const RestrictedForMembers = () => {
  const member = { ...adminUser, displayName: `חבר קהילה`, role: `member` as const };
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <ManageRecords mockUser={member} mockRecords={mockRecords} mockLabels={mockLabels} />
      </div>
    </MockProvider>
  );
};
