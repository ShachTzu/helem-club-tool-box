/**
 * role hierarchy of a platform user, ordered by increasing privilege.
 */
export type ReviewActionsUserRole = `member` | `writer` | `moderator` | `admin`;

/**
 * authentication provider used to create the user's account.
 */
export type ReviewActionsUserProvider = `email` | `google`;

/**
 * community membership status of a user, independent of their role.
 */
export type ReviewActionsMembershipStatus = `pending` | `approved` | `rejected`;

/**
 * the minimal, plain shape of a signed-in user needed to render role-aware
 * review actions. mirrors the platform's PlainUser shape so it can be passed
 * as mock data to `useAuth`.
 */
export type ReviewActionsUser = {
  /**
   * unique identifier of the user.
   */
  id: string;

  /**
   * email address of the user.
   */
  email: string;

  /**
   * display name shown across the platform.
   */
  displayName: string;

  /**
   * role assigned to the user, determines editorial privileges.
   */
  role: ReviewActionsUserRole;

  /**
   * provider used by the user to authenticate.
   */
  provider: ReviewActionsUserProvider;

  /**
   * ISO timestamp of when the user was created.
   */
  createdAt: string;

  /**
   * optional avatar image url.
   */
  avatarUrl?: string;

  /**
   * whether the user has completed the mandatory post-signup onboarding flow.
   */
  onboardingCompleted?: boolean;

  /**
   * the coping-domain names the user is most interested in.
   */
  interests?: string[];

  /**
   * community membership status.
   */
  membershipStatus?: ReviewActionsMembershipStatus;
};
