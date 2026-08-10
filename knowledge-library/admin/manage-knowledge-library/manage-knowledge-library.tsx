import React, { useState } from 'react';
import classNames from 'classnames';
import { Tabs } from '@helemclub/design.navigation.tabs';
import { ProtectedRoute } from '@helemclub/platform.ui.protected-route';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import { useCanManageKnowledgeLibrary } from '@helemclub/knowledge-library.hooks.use-knowledge-pages';
import type { PlainUser } from '@helemclub/platform.entities.user';
import { PagesTab } from './pages-tab.js';
import { ImportTab } from './import-tab.js';
import { PermissionsTab } from './permissions-tab.js';
import styles from './manage-knowledge-library.module.scss';

export type ManageKnowledgeLibraryProps = {
  /**
   * provide a mock signed-in user, bypassing the auth request. useful for
   * tests and compositions. pass null to simulate a signed-out state.
   */
  mockUser?: PlainUser | null;

  /**
   * bypass the meCanManageKnowledgeLibrary self-check, useful for tests and
   * compositions.
   */
  mockCanManage?: boolean;

  className?: string;
  style?: React.CSSProperties;
};

/**
 * admin panel for the knowledge library: page CRUD + hierarchy, CSV bulk
 * import, and (admin-only) the feature's own editor allowlist. gated to any
 * signed-in user at the route level — the real gate is `canManage`, checked
 * against both staff roles and the editor allowlist, since ProtectedRoute's
 * `allowedRoles` only understands the shared platform role enum.
 */
export function ManageKnowledgeLibrary({ mockUser, mockCanManage, className, style }: ManageKnowledgeLibraryProps) {
  return (
    <ProtectedRoute mockData={mockUser}>
      <ManageKnowledgeLibraryContent mockUser={mockUser} mockCanManage={mockCanManage} className={className} style={style} />
    </ProtectedRoute>
  );
}

function ManageKnowledgeLibraryContent({
  mockUser,
  mockCanManage,
  className,
  style,
}: Pick<ManageKnowledgeLibraryProps, 'mockUser' | 'mockCanManage' | 'className' | 'style'>) {
  const hasMockUser = mockUser !== undefined;
  const { user } = useAuth(hasMockUser ? { mockData: mockUser } : undefined);
  const { canManage, loading } = useCanManageKnowledgeLibrary({ mockCanManage });
  const [activeTab, setActiveTab] = useState('pages');

  if (loading) {
    return <div className={styles.loadingState}>בודק הרשאות...</div>;
  }

  if (!canManage) {
    return <div className={styles.errorBanner}>אין לך הרשאה לנהל את ספריית הידע.</div>;
  }

  const isAdmin = user?.role === 'admin';
  const tabs = [
    { key: 'pages', label: 'עמודים' },
    { key: 'import', label: 'ייבוא CSV' },
    ...(isAdmin ? [{ key: 'permissions', label: 'הרשאות' }] : []),
  ];

  return (
    <div className={classNames(styles.manageKnowledgeLibrary, className)} style={style}>
      <Tabs items={tabs} activeKey={activeTab} onChange={setActiveTab} />
      <div className={styles.tabContent}>
        {activeTab === 'pages' && <PagesTab />}
        {activeTab === 'import' && <ImportTab />}
        {activeTab === 'permissions' && isAdmin && <PermissionsTab />}
      </div>
    </div>
  );
}

export default ManageKnowledgeLibrary;
