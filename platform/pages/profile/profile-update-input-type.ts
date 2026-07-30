/**
 * Input describing the fields a member can update on their own profile.
 */
export type ProfileUpdateInput = {
  /**
   * the new display name shown across the platform.
   */
  displayName: string;

  /**
   * the new avatar image url, or undefined to fall back to initials.
   */
  avatarUrl?: string;
};
