export type MembersOnlyGateUserRole = `member` | `writer` | `moderator` | `admin`;

/**
 * shape of the viewer data accepted as mock input for the underlying
 * auth hook. mirrors the platform user fields needed to determine
 * membership status.
 */
export type MembersOnlyGateUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: MembersOnlyGateUserRole;
  provider: `email` | `google`;
  createdAt: string;
};
