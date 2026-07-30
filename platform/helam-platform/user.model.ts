import { prop } from '@typegoose/typegoose';

/**
 * the community role a platform user holds, ordered by increasing privilege.
 */
export type UserModelRole = 'member' | 'writer' | 'moderator' | 'admin';

/**
 * the authentication provider used to create the user's account.
 */
export type UserModelProvider = 'email' | 'google';

/**
 * the typegoose User model persisted in MongoDB. mirrors the platform's
 * User entity (helemclub.platform/entities/user) with a few backend-only
 * fields used for the onboarding gate and interest matching.
 */
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
   * ISO timestamp of when the user was created.
   */
  @prop({ type: String })
  public createdAt?: string;
}
