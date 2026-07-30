import React from 'react';
import classNames from 'classnames';
import { Dropdown } from '@helemclub/design.overlays.dropdown';
import type { DropdownItemType } from '@helemclub/design.overlays.dropdown';
import type { RoleOption, UserRole } from './role-option-type.js';
import { DEFAULT_ROLE_OPTIONS } from './role-selector.mock.js';
import styles from './role-selector.module.scss';

export type { RoleOption, UserRole } from './role-option-type.js';

const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  member: styles.roleBadgeMember,
  writer: styles.roleBadgeWriter,
  moderator: styles.roleBadgeModerator,
  admin: styles.roleBadgeAdmin,
};

export type RoleSelectorProps = {
  /**
   * the currently selected role.
   */
  value?: UserRole;

  /**
   * called with the newly selected role.
   */
  onChange?: (role: UserRole) => void;

  /**
   * the list of role options rendered in the dropdown, in order.
   */
  options?: RoleOption[];

  /**
   * disables the selector, preventing role changes.
   */
  disabled?: boolean;

  /**
   * class name for the root container.
   */
  className?: string;

  /**
   * style for the root container.
   */
  style?: React.CSSProperties;
};

/**
 * a dropdown for picking a platform user role, with Hebrew labels for each
 * role in the hierarchy (member, writer, moderator, admin). used in the user
 * admin screens to change a member's permissions.
 */
export function RoleSelector({
  value = `member`,
  onChange,
  options = DEFAULT_ROLE_OPTIONS,
  disabled,
  className,
  style,
}: RoleSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedOption = options.find((option) => option.role === value) || options[0];

  const items: DropdownItemType[] = options.map((option) => ({
    id: option.role,
    label: option.description ? `${option.label} — ${option.description}` : option.label,
    icon: option.icon,
    disabled,
    onSelect: () => onChange?.(option.role),
  }));

  return (
    <div className={classNames(styles.roleSelector, className)} style={style}>
      <Dropdown
        open={disabled ? false : isOpen}
        onOpenChange={(next) => setIsOpen(disabled ? false : next)}
        items={items}
        align="end"
        menuClassName={styles.menu}
        trigger={
          <button
            type="button"
            className={styles.trigger}
            disabled={disabled}
            aria-haspopup="true"
            aria-expanded={isOpen}
          >
            <span className={classNames(styles.roleBadge, ROLE_BADGE_CLASS[selectedOption.role])}>
              {selectedOption.icon && <span className={styles.triggerIcon}>{selectedOption.icon}</span>}
              <span className={styles.triggerLabel}>{selectedOption.label}</span>
            </span>
            <span className={classNames(styles.chevron, isOpen && styles.chevronOpen)}>▾</span>
          </button>
        }
      />
    </div>
  );
}
