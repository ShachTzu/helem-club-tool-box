/**
 * plain, serializable shape of the current user, matching the platform's
 * user entity, used to bypass the auth request in tests and compositions.
 */
export type KnowledgeBaseDashboardMockUser = {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: 'member' | 'writer' | 'moderator' | 'admin';
  provider: 'email' | 'google';
  createdAt: string;
};
