/**
 * A user role recognized across the Helem Club platform, ordered by
 * increasing privilege: member < writer < moderator < admin.
 */
export type UserRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * A selectable role option rendered by the role selector, pairing the
 * underlying role value with its Hebrew label and presentation details.
 */
export type RoleOption = {
  /**
   * the underlying role value.
   */
  role: UserRole;

  /**
   * Hebrew label shown to the user for this role.
   */
  label: string;

  /**
   * short Hebrew description of the role's privileges.
   */
  description?: string;

  /**
   * emoji/icon rendered next to the role label.
   */
  icon?: string;
};
