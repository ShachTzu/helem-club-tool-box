/**
 * platform roles ordered by increasing privilege, mirrors the platform's
 * role hierarchy (member < writer < moderator < admin).
 */
export type AdminRole = `member` | `writer` | `moderator` | `admin`;

/**
 * a minimal, plain representation of the current platform user, used to
 * bypass the auth check for tests and previews via the `mockUser` prop.
 */
export type AdminUserRecord = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: AdminRole;
  provider: `email` | `google`;
  createdAt: string;
};
