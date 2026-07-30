import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { Button } from '@helemclub/design.actions.button';
import { Avatar } from '@helemclub/design.content.avatar';
import { Dropdown } from '@helemclub/design.overlays.dropdown';
import type { DropdownItemType } from '@helemclub/design.overlays.dropdown';
import { useAuth } from '@helemclub/platform.hooks.use-auth';
import type { PlainUser } from '@helemclub/platform.entities.user';
import type { UserBarUserMenuItem } from './user-menu-item-type.js';
import styles from './user-bar.module.scss';

const DEFAULT_USER_MENU_ITEMS: UserBarUserMenuItem[] = [];

export type UserBarProps = {
  /**
   * path to navigate to for the login action, shown to anonymous users.
   */
  loginHref?: string;

  /**
   * path to navigate to for the signup action, shown to anonymous users.
   */
  signupHref?: string;

  /**
   * path to the signed-in user's profile page.
   */
  profileHref?: string;

  /**
   * path to the signed-in user's saved items page.
   */
  savedHref?: string;

  /**
   * path to the admin area, shown only to moderators/admins.
   */
  adminHref?: string;

  /**
   * user menu entries registered by feature aspects through the platform's
   * `UserMenuItem` slot, rendered inside the dropdown for authenticated users.
   */
  userMenuItems?: UserBarUserMenuItem[];

  /**
   * provide mock data for the current user, bypassing the auth query.
   * useful for tests and previews. pass null to simulate a signed-out state.
   */
  mockUser?: PlainUser | null;

  /**
   * called after the user successfully signs out.
   */
  onSignOut?: () => void;

  /**
   * class name for the root element.
   */
  className?: string;

  /**
   * style for the root element.
   */
  style?: React.CSSProperties;
};

/**
 * user bar rendered in the platform header. shows login/signup actions for
 * anonymous users, and an avatar with a dropdown menu (profile, saved, admin
 * when permitted, sign out, plus registered user menu entries) for
 * authenticated users. Hebrew, RTL.
 */
export function UserBar({
  loginHref = `/login`,
  signupHref = `/signup`,
  profileHref = `/profile`,
  savedHref = `/saved`,
  adminHref = `/admin`,
  userMenuItems = DEFAULT_USER_MENU_ITEMS,
  mockUser,
  onSignOut,
  className,
  style,
}: UserBarProps) {
  const hasMockUser = mockUser !== undefined;
  const { user, loading, isModerator, signOut } = useAuth(hasMockUser ? { mockData: mockUser } : undefined);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const visibleUserMenuItems = useMemo(() => {
    return userMenuItems.filter((item) => {
      if (!item.roles || item.roles.length === 0) return true;
      if (!user) return false;
      return item.roles.some((role) => user.isAtLeast(role));
    });
  }, [userMenuItems, user]);

  const handleSignOut = async () => {
    await signOut();
    onSignOut?.();
    navigate(`/`);
  };

  const menuItems = useMemo<DropdownItemType[]>(() => {
    const items: DropdownItemType[] = [
      { id: `profile`, label: `הפרופיל שלי`, icon: `👤`, onSelect: () => navigate(profileHref) },
      { id: `saved`, label: `שמורים`, icon: `🔖`, onSelect: () => navigate(savedHref) },
    ];

    visibleUserMenuItems.forEach((item) => {
      items.push({ id: `menu-item-${item.path}`, label: item.label, onSelect: () => navigate(item.path) });
    });

    if (isModerator) {
      items.push({ id: `admin`, label: `אזור ניהול`, icon: `🛡️`, onSelect: () => navigate(adminHref) });
    }

    items.push({
      id: `sign-out`,
      label: `התנתקות`,
      icon: `🚪`,
      danger: true,
      onSelect: () => {
        handleSignOut();
      },
    });

    return items;
  }, [visibleUserMenuItems, isModerator, navigate, profileHref, savedHref, adminHref]);

  if (loading) {
    return <div className={classNames(styles.userBar, className)} style={style}>
      <span className={styles.placeholder} />
    </div>;
  }

  if (!user) {
    return (
      <div className={classNames(styles.userBar, styles.authActions, className)} style={style}>
        <Button variant="secondary" size="sm" href={loginHref} className={styles.loginLink}>
          התחברות
        </Button>
        <Button variant="accent" size="sm" href={signupHref}>
          הרשמה
        </Button>
      </div>
    );
  }

  return (
    <div className={classNames(styles.userBar, className)} style={style}>
      <Dropdown
        align="end"
        items={menuItems}
        onOpenChange={(open) => setIsOpen(open)}
        trigger={
          <button type="button" className={styles.trigger} aria-expanded={isOpen} aria-haspopup="true">
            <Avatar name={user.displayName} imageUrl={user.avatarUrl} size="small" />
            <span className={styles.name}>{user.displayName}</span>
            <span className={classNames(styles.chevron, isOpen && styles.chevronOpen)}>▾</span>
          </button>
        }
      />
    </div>
  );
}
