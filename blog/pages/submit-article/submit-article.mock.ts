import type { DomainOption } from '@helemclub/knowledge-domains.ui.domain-selector';

/**
 * mock coping-domain options, useful for tests and previews of the submission form.
 */
export function mockDomainOptions(): DomainOption[] {
  return [
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
}
