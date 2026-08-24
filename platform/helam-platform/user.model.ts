import { prop, index } from '@typegoose/typegoose';

/**
 * the community role a platform user holds, ordered by increasing privilege.
 */
export type UserModelRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * the authentication provider used to create the user's account.
 */
export type UserModelProvider = 'email' | 'google';

/**
 * the community membership status of a user. new signups start as 'pending'
 * and must be approved by a moderator or an admin before they may participate.
 */
export type UserModelMembershipStatus = 'pending' | 'approved' | 'rejected';

/**
 * the typegoose User model persisted in MongoDB. mirrors the platform's
 * User entity (helemclub.platform/entities/user) with a few backend-only
 * fields used for the onboarding gate and interest matching.
 */
@index({ googleSub: 1 }, { unique: true, sparse: true })
export class UserModel {
  /**
   * stable, unique identifier of the user. mapped to the GraphQL `id` field.
   */
  @prop({ required: true, unique: true, type: String })
  public userId!: string;

  /**
   * email address of the user, unique across the platform.
   */
  @prop({ required: true, unique: true, type: String })
  public email!: string;

  /**
   * display name shown across the platform.
   */
  @prop({ required: true, type: String })
  public displayName!: string;

  /**
   * optional avatar image url.
   */
  @prop({ type: String })
  public avatarUrl?: string;

  /**
   * community role, determines platform privileges.
   */
  @prop({ type: String, default: 'member' })
  public role!: string;

  /**
   * the provider the user authenticated with (email OTP or Google).
   */
  @prop({ type: String, default: 'email' })
  public provider!: string;

  /**
   * Google's stable subject identifier, present only for accounts that have
   * signed in with Google. indexed unique+sparse so accounts are keyed on this
   * rather than on the email, which a user can change on the Google side.
   */
  @prop({ type: String })
  public googleSub?: string;

  /**
   * whether ownership of the email address has been proven — by Google having
   * verified it. gates sensitive actions such as submitting an app.
   */
  @prop({ type: Boolean, default: false })
  public emailVerified!: boolean;

  /**
   * whether the user has completed the mandatory post-signup onboarding flow.
   */
  @prop({ type: Boolean, default: false })
  public onboardingCompleted!: boolean;

  /**
   * the coping-domain names the user is most interested in.
   */
  @prop({ type: [String], default: [] })
  public interests!: string[];

  /**
   * community membership status. new signups are 'pending' until a moderator
   * or an admin approves them into the community.
   */
  @prop({ type: String, default: 'pending' })
  public membershipStatus!: string;

  /**
   * the id of the moderator or admin who last decided on this membership.
   */
  @prop({ type: String })
  public membershipDecidedBy?: string;

  /**
   * ISO timestamp of the last membership approval/rejection decision.
   */
  @prop({ type: String })
  public membershipDecidedAt?: string;

  /**
   * ISO timestamp of when the user was created.
   */
  @prop({ type: String })
  public createdAt?: string;

  /**
   * scoped content-domain admin: can manage writers, the knowledge library
   * and the blog, without holding the site-wide 'admin' role. granted on
   * top of any role — typically 'moderator' — by a full admin.
   */
  @prop({ type: Boolean, default: false })
  public contentAdmin!: boolean;
}
