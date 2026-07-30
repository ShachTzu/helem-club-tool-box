import React, { useState } from 'react';
import { MockProvider } from '@helemclub/platform.testing.mock-provider';
import { DomainSelector } from './domain-selector.js';

const MOCK_DOMAINS = [
  {
    id: `anxiety`,
    slug: `anxiety`,
    name: `חרדה`,
    description: `כלים מיידיים ומתמשכים להתמודדות עם חרדה והתקפי פאניקה.`,
    icon: `😰`,
    count: 5,
  },
  {
    id: `sleep`,
    slug: `sleep`,
    name: `שינה`,
    description: `נדודי שינה, סיוטים וכלים להירדמות רגועה.`,
    icon: `🌙`,
    count: 4,
  },
  {
    id: `emotional-regulation`,
    slug: `emotional-regulation`,
    name: `ויסות רגשי`,
    description: `כלים לזיהוי, ויסות והבנת רגשות עזים.`,
    icon: `🌊`,
    count: 4,
  },
  {
    id: `family-relationships`,
    slug: `family-relationships`,
    name: `משפחה, זוגיות ויחסים`,
    description: `זוגיות, הורות ומערכות יחסים בצל התמודדות עם פוסט-טראומה.`,
    icon: `👨‍👩‍👧`,
    count: 3,
  },
  {
    id: `mindfulness-breathing`,
    slug: `mindfulness-breathing`,
    name: `מיינדפולנס ונשימות`,
    description: `תרגילי נשימה, מדיטציה ומיינדפולנס להרגעת הגוף והנפש.`,
    icon: `🧘`,
    count: 5,
  },
];

export const BasicDomainSelector = () => {
  const [value, setValue] = useState<string[]>([`anxiety`, `sleep`]);

  return (
    <MockProvider>
      <div style={{ padding: 32, maxWidth: 420 }}>
        <DomainSelector
          value={value}
          onChange={(next) => setValue(next)}
          mockDomains={MOCK_DOMAINS}
        />
      </div>
    </MockProvider>
  );
};

export const EmptyRequiredDomainSelector = () => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <MockProvider>
      <div style={{ padding: 32, maxWidth: 420 }}>
        <DomainSelector
          value={value}
          onChange={(next) => setValue(next)}
          mockDomains={MOCK_DOMAINS}
          label="תחומים רלוונטיים למאמר"
          helperText="בחרו לפחות תחום אחד — נעזור להתאים את המאמר שלכם לקוראים הנכונים."
          required
        />
      </div>
    </MockProvider>
  );
};

export const LimitedDomainSelector = () => {
  const [value, setValue] = useState<string[]>([`anxiety`]);

  return (
    <MockProvider>
      <div style={{ padding: 32, maxWidth: 420 }}>
        <DomainSelector
          value={value}
          onChange={(next) => setValue(next)}
          mockDomains={MOCK_DOMAINS}
          label="תחומים לאירוע"
          maxSelections={2}
          placeholder="עד שני תחומים..."
        />
      </div>
    </MockProvider>
  );
};
