import React from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { EcosystemOverview } from './ecosystem-overview.js';
import { DEFAULT_PILLARS } from './ecosystem-overview.mock.js';
import { EcosystemPillar } from './ecosystem-pillar-type.js';

export const BasicEcosystemOverview = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <EcosystemOverview />
      </div>
    </MockProvider>
  );
};

const CUSTOM_PILLARS: EcosystemPillar[] = [
  {
    slug: `knowledge`,
    icon: `📚`,
    title: `מאגר ידע`,
    description: `סרטונים והרצאות שנבנו עם אנשי מקצוע, מסודרים לפי תחום התמודדות.`,
    href: `/knowledge`,
  },
  {
    slug: `toolbox`,
    icon: `🧰`,
    title: `ארגז כלים`,
    description: `אפליקציות מדורגות שהקהילה בדקה וממליצה עליהן.`,
    href: `/toolbox`,
  },
  {
    slug: `blog`,
    icon: `📝`,
    title: `בלוג`,
    description: `שיתופים אישיים וכתבות מקצועיות מהקהילה שלנו.`,
    href: `/blog`,
  },
];

export const CustomPillarsSet = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24 }}>
        <EcosystemOverview
          pillars={CUSTOM_PILLARS}
          title="שלושת עמודי התווך"
          subtitle="מבחר מצומצם להדגמה"
        />
      </div>
    </MockProvider>
  );
};

export const NarrowContainerLayout = () => {
  return (
    <MockProvider>
      <div style={{ padding: 24, maxWidth: 480, margin: '0 auto' }}>
        <EcosystemOverview pillars={DEFAULT_PILLARS} />
      </div>
    </MockProvider>
  );
};
