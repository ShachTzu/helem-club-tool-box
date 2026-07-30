import type { DomainOption } from '@helemclub/knowledge-domains.ui.domain-selector';
import type { ProtectedRouteProps } from '@helemclub/platform.ui.protected-route';

/**
 * a small catalog of knowledge domains used to preview and test the
 * post-editor's domain selection field.
 */
export const POST_EDITOR_MOCK_DOMAINS: DomainOption[] = [
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
    id: `mindfulness-breathing`,
    slug: `mindfulness-breathing`,
    name: `מיינדפולנס ונשימות`,
    description: `תרגילי נשימה, מדיטציה ומיינדפולנס להרגעת הגוף והנפש.`,
    icon: `🧘`,
    count: 5,
  },
];

/**
 * create a plain, mock signed-in user for previewing/testing the
 * post-editor's protected route gate.
 */
export function mockPostEditorUser(
  overrides: Partial<NonNullable<ProtectedRouteProps['mockData']>> = {}
): NonNullable<ProtectedRouteProps['mockData']> {
  return {
    id: `user-writer-1`,
    email: `writer@helam.club`,
    displayName: `ד״ר מיכל ברק`,
    role: `writer`,
    provider: `email`,
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}
