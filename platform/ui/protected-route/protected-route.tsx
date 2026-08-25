import React, { type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import type { UserRole, PlainUser } from '@helemclub/platform.entities.user';
import { Spinner } from '@helemclub/design.loaders.spinner';
import { Link } from '@helemclub/design.navigation.link';
import styles from './protected-route.module.scss';

export type ProtectedRouteProps = {
  /**
   * the protected content, rendered only when the current user is
   * signed in and holds one of the allowed roles.
   */
  children?: ReactNode;

  /**
   * path to redirect anonymous (signed-out) users to.
   */
  redirectTo?: string;

  /**
   * roles allowed to view the protected content. when omitted, any
   * signed-in user is allowed regardless of role.
   */
  allowedRoles?: UserRole[];

  /**
   * also allow users scoped in as content-domain admins (writers, the
   * knowledge library and the blog), even when their role is not in
   * `allowedRoles`. use on content-management routes that a content admin
   * should reach without holding the site-wide admin role.
   */
  allowContentAdmin?: boolean;

  /**
   * provide mock data for the current user, bypassing the auth query.
   * useful for tests and previews. pass null to simulate a signed-out state.
   */
  mockData?: PlainUser | null;
};

/**
 * guards a route from anonymous access and, optionally, from users whose
 * role is not included in `allowedRoles`. shows a spinner while the auth
 * state is resolving, redirects signed-out users to `redirectTo`, and
 * renders an access-denied message for signed-in users with an
 * insufficient role.
 */
export function ProtectedRoute({
  children,
  redirectTo = '/login',
  allowedRoles,
  allowContentAdmin,
  mockData,
}: ProtectedRouteProps) {
  const hasMockData = mockData !== undefined;
  const { user, loading } = useAuth(hasMockData ? { mockData } : undefined);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <Spinner size="large" message="בודקים את החשבון שלך, רגע אחד..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  const isAllowed =
    !allowedRoles ||
    allowedRoles.length === 0 ||
    allowedRoles.includes(user.role) ||
    (allowContentAdmin && user.contentAdmin === true);

  if (!isAllowed) {
    return (
      <div className={styles.forbiddenContainer}>
        <div className={styles.forbiddenCard}>
          <div className={styles.forbiddenIcon}>🔒</div>
          <h1 className={styles.forbiddenTitle}>אין לך הרשאה לצפות בעמוד זה</h1>
          <p className={styles.forbiddenSubtitle}>
            הגישה לעמוד זה מוגבלת לתפקידים מסוימים בקהילה. אם לדעתך מדובר בטעות, פנה/י לצוות
            הקהילה.
          </p>
          <Link href="/" className={styles.forbiddenLink}>
            חזרה לדף הבית
          </Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
