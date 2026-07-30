import type { ProtectedRouteProps } from '@helemclub/platform.ui.protected-route';

/**
 * mock data accepted for the currently signed-in user, bypassing the auth
 * query used by the admin guard. useful for tests and previews.
 */
export type ReviewPostsMockUser = ProtectedRouteProps['mockData'];
